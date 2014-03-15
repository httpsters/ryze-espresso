from database import firebase
import time


class Songs:

    def __init__(self):
        pass

    def add_song(self, track_id):
        '''
        Adds a song to the Firebase
        '''
        song = {
            "track_id": track_id,
            "date_added": time.time(),
            "last_played": -1,
            "play_count": 0,
            "likes": 0
        }
        result = firebase.post("/songs", song)
        return result

    def get_songs(self):
        result = firebase.get("/songs", None)
        songs = [song for song in result.values()]
        return songs


if __name__ == "__main__":
    s = Songs()
    from pprint import pprint
    pprint( s.get_songs() )
