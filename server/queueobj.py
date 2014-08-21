from database import firebase
import schema
import json


class Song(object):

    def __init__(self, key, song_obj):
        self._key = key
        self._obj = song_obj

    def __str__(self):
        title = self.get('title')
        return "<[%s] %s>" % (self._key, title)

    def get(self, key):
        obj = self._obj
        if key in obj:
            return obj[key]
        else:
            raise AttributeError(key)


class Queue(object):

    def __init__(self):
        songs = firebase.get(schema.SONGS, None)
        self.songs = [Song(key, obj) for key, obj in songs.iteritems()]
