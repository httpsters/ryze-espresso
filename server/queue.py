from database import firebase
import config
import json
import random
import time
import math


class SongQueue:

    def __init__(self):
        self._songs = Songs()

    def get_songs(self):
        result = firebase.get(config.SONGS, None)
        return result

    def lookup(self, song_id):
        return self.get_songs().get(str(song_id))

    def get_current_song(self):
        ''' returns the song that's playing right now '''
        result = firebase.get(config.QUEUE, config.CURRENT)
        return result

    def get_previous_queue(self):
        ''' returns the previously played queue '''
        queue = firebase.get(config.QUEUE, config.PREV) or []
        return queue

    def change_songs(self):
        ''' puts current song in previous queue, sets next song to current '''
        prev_queue = self.get_previous_queue() # working copy of prev queue
        prev_queue.insert(0, self.get_current_song()) # current song at front
        prev_queue = prev_queue[:6] # only keep most recent 6 songs
        result = firebase.put(config.QUEUE, config.PREV, prev_queue) # update firebase

        next_queue = firebase.get(config.QUEUE, config.NEXT)
        if next_queue is None:
            next_id = self._get_auto_song()
        else:
            next_id = next_queue.pop(0) # get current song off the front
            result = firebase.put(config.QUEUE, config.NEXT, next_queue)

        result = firebase.put(config.QUEUE, config.CURRENT, int(next_id))
        song_link = self._songs.lookup(next_id).get('url')
        result = firebase.put('nowplaying', 'cur', song_link)
        return result

    def _get_auto_song(self):
        ''' uses some neat algorithm to pick the next song '''
        songs = self._songs.get_songs()
        get_score = lambda song_id: self._song_score(songs.get(song_id))
        # generate a list of (song_id, song_score) pairs
        scores = [(song_id, get_score(song_id)) for song_id in songs.keys()]
        max_score = max(scores, key=lambda song: float(song[1])) # get max score
        return int(max_score[0]) # return song ID of the max score

    def _song_score(self, song):
        ''' given a song, return its 'score', which will be used to pick the
        song to be played next if nothing is on the queue '''
        if song is None: return -1
        now = int(time.time())
        # get the numbers
        time_since_song_added = now - int(song.get('date_added', now))
        time_since_last_liked = now - int(song.get('last_liked', now))
        time_since_last_played = now - int(song.get('last_played', now))
        like_count = int(song.get('likes', 0))
        play_count = int(song.get('play_count', 0))
        # compute score
        score = 1.0
        score += 1000.0 / time_since_song_added
        score += like_count
        score *= math.pow(time_since_last_played, 0.3)
        return score
