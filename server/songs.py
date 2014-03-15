from database import firebase
import time
import config


class Songs:

    def __init__(self):
        pass

    def add_song(self, track_id):
        ''' Adds a song to the Firebase '''
        song = {
            "date_added": time.time(),
            "last_played": -1,
            "play_count": 0,
            "likes": 0
        }
        result = firebase.put(config.SONGS, track_id, song)
        return result

    def get_songs(self):
        result = firebase.get(config.SONGS, None)
        songs = [song for song in result.values()]
        return songs


if __name__ == "__main__":
    s = Songs()
    from pprint import pprint
    pprint( s.get_songs() )
