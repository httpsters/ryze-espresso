from database import firebase
from songs import Songs
import config
import json
import random


class SongQueue:

    def __init__(self):
        self._songs = Songs()
        pass

    def get_current_song(self):
        ''' returns the song that's playing right now '''
        result = firebase.get(config.QUEUE, config.CURRENT)
        return result

    def get_previous_queue(self):
        ''' returns the previously played queue '''
        result = firebase.get(config.QUEUE, config.PREV)
        return result

    def change_songs(self):
        ''' puts current song in previous queue, sets next song to current '''
        prev_queue = self.get_previous_queue() # working copy of prev queue
        prev_queue.pop() # pop last song off the back
        prev_queue.insert(0, self.get_current_song()) # current song at front
        result = firebase.put(config.QUEUE, config.PREV, prev_queue) # update firebase

        new_id = self.get_next_song()
        result = firebase.put(config.QUEUE, config.CURRENT, int(new_id))
        return result

    def get_next_song(self):
        ''' returns the song ID to be played next '''
        queue = firebase.get(config.QUEUE, config.NEXT)
        next_id = None
        if len(queue) > 0: # if the queue has songs
            next_id = queue[0] # get song at front of queue
        else:
            next_id = self._auto_add_song()
            pass
        return next_id

    def _auto_add_song():
        ''' uses some neat algorithm to pick the next song '''
        songs = self._songs.get_songs()
        return random.choice(songs.keys())


