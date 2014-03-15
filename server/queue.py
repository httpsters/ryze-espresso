from database import firebase
from songs import Songs
import config
import json
import random


class SongQueue:

    def __init__(self):
        self._songs = Songs()

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
        result = firebase.put(config.QUEUE, config.PREV, prev_queue) # update firebase

        next_queue = firebase.get(config.QUEUE, config.NEXT)
        if next_queue is None:
            next_id = self._get_auto_song()
        else:
            next_id = next_queue.pop(0) # get current song off the front
            result = firebase.put(config.QUEUE, config.NEXT, next_queue)

        result = firebase.put(config.QUEUE, config.CURRENT, int(next_id))
        return result

    def _get_auto_song(self):
        ''' uses some neat algorithm to pick the next song '''
        songs = self._songs.get_songs()
        return random.choice(songs.keys())
