from firebase import firebase
import time


def get_firebase():
    url = 'https://shining-fire-6877.firebaseio.com/'
    return firebase.FirebaseApplication(url, None)


class Songs:

    def __init__(self):
        self.firebase = get_firebase()

    def add_song(self, track_id):
        '''
        Adds a song to the Firebase
        '''
        song = {
            "track_id": track_id,
            "date_added": time.time(),
            "last_played": -1,
            "play_count": 0,
        }
        result = self.firebase.post("/songs", song)
        return result

    def get_songs(self):
        result = self.firebase.get("/songs", None)
        songs = [song for song in result.values()]
        return songs


if __name__ == "__main__":
    s = Songs()
    from pprint import pprint
    pprint( s.get_songs() )
