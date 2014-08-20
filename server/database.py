import config
from firebase import firebase

def _get_firebase():
    return firebase.FirebaseApplication(config.firebase.url, None)

firebase = _get_firebase()
