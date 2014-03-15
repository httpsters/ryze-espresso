from queue import SongQueue
from songs import Songs
import time
import threading

def start_song():
    print "starting a new song"
    q.change_songs()
    song_id = q.get_current_song()
    song = songs.lookup(song_id)
    song_length = song.get('seconds', 0)
    print "song %d playing. waiting %d seconds for next song" % \
            (song_id, song_length)
    threading.Timer(song_length, start_song).start()

if __name__ == '__main__':
    q = SongQueue()
    songs = Songs()
    start_song()
    start = time.time()
    while True:
        if time.time() - start > 3:
            print time.ctime()
            start = time.time()

