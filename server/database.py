from firebase import firebase

def _get_firebase():
    url = 'https://shining-fire-6877.firebaseio.com/dev/'
    return firebase.FirebaseApplication(url, None)

firebase = _get_firebase()
