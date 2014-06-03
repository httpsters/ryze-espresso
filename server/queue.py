from database import firebase
import schema
import json
import random
import time
import math
from pprint import pprint

class SongQueue:

    def get_songs(self):
        result = firebase.get(schema.SONGS, None)
        return result

    def lookup(self, song_id):
        return self.get_songs().get(str(song_id))

    def get_current_song(self):
        ''' returns the song that's playing right now '''
        result = firebase.get(schema.QUEUE, schema.CURRENT)
        return result

    def get_previous_queue(self):
        ''' returns the previously played queue '''
        queue = firebase.get(schema.QUEUE, schema.PREV) or []
        return queue

    def change_songs(self):
        ''' puts current song in previous queue, sets next song to current '''
        song_id = self.get_current_song() # get currently playing song ID
        song = self.lookup(song_id) # get the currently playing song object
        if song is not None:
            song['last_played'] = int(time.time() * 1000) # last played = now
            song['play_count'] = song.get('play_count', 0) + 1 # count += 1
            result = firebase.put(schema.SONGS, song_id, song)

        next_queue = firebase.get(schema.QUEUE, schema.NEXT)
        if next_queue is None:
            next_id = self._get_auto_song()
            print 'auto-choose: next song id is', next_id
        else:
            list_queue = [next_queue[key] for key in next_queue]
            comp = lambda song: song.get('time_added', -1)
            sorted_queue = sorted(list_queue, key=comp)

            print 'the sorted queue is'
            pprint(sorted_queue)

            next_id = sorted_queue.pop(0).get('key') # get current song off the front
            print 'next song id is', next_id

            # find key to remove from the queue. this is to update firebase
            # we have the key of the song, and we have to iterate through the
            # queue to see which {key, time_added} object to remove
            queue_key = None
            for k, v in next_queue.items():
                if v.get('key') == next_id:
                    queue_key = k
                    break

            if queue_key is not None:
                next_queue.pop(queue_key)
                print "removed key", next_id, "at", queue_key
                result = firebase.put(schema.QUEUE, schema.NEXT, next_queue)
            else:
                print "could not remove key", next_id, "at", queue_key
                result = False

        result = firebase.put(schema.QUEUE, schema.CURRENT, next_id)
        song = self.lookup(next_id)
        if song is not None:
            song_link = song.get('url')
            result = firebase.put('nowplaying', 'cur', song_link)
        return result

    def _get_auto_song(self):
        ''' uses some neat algorithm to pick the next song '''
        songs = self.get_songs()
        get_score = lambda song_id: self._song_score(songs.get(song_id))
        # generate a list of (song_id, song_score) pairs
        scores = [(song_id, get_score(song_id)) for song_id in songs.keys()]
        scores.sort(key=lambda song: float(song[1]), reverse=True) # get max score
        print "the top scores are", scores[:4]
        return scores[0][0] # return song ID of the max score

    def _song_score(self, song):
        ''' given a song, return its 'score', which will be used to pick the
        song to be played next if nothing is on the queue '''
        if song is None: return -1
        now = int(time.time() * 1000)
        # get the numbers
        time_since_song_added = now - int(song.get('date_added', now))
        time_since_last_liked = now - int(song.get('last_liked', now))
        time_since_last_played = now - int(song.get('last_played', now))
        like_count = int(song.get('likes', 0))
        play_count = int(song.get('play_count', 0))
        # compute score
        score = 1.0
        score += -1 * (play_count - 10) ** 2 + 200 if play_count < 24 else 0
        score += like_count
        score *= math.pow(time_since_last_played, 0.3)

        print """ since song added:  {}
        since last liked:  {}
        since last played: {}
        likes:             {}
        plays:             {}
        SCORE: ----------  {:.3f}""".format(time_since_song_added, \
                time_since_last_liked, time_since_last_played, \
                like_count, play_count, score)

        return score
