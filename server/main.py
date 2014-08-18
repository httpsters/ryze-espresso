from queue import SongQueue
import time
import threading
import logging
from tlshandler import TlsSMTPHandler
import config
import sys

ADMINS = ['george.lifchits@gmail.com']

smtp_handler = TlsSMTPHandler(
    mailhost=("smtp.gmail.com", 587),
    fromaddr="george.lifchits@gmail.com",
    toaddrs=ADMINS,
    subject=u"ryze-espresso error!",
    credentials=(config.gmail.username, config.gmail.password)
)
smtp_handler.setLevel(logging.ERROR)
logger = logging.getLogger()
logger.addHandler(smtp_handler)


def start_song():
    print "starting a new song"
    q.change_songs()
    song_id = q.get_current_song()
    song = q.lookup(song_id)
    song_length = int(song.get('duration', 0) / 1000.0)
    logging.info("song %s playing. waiting %d seconds for next song" % (song_id, song_length))
    threading.Timer(song_length, start_song).start()


if __name__ == '__main__':
    try:
        q = SongQueue()
        start_song()
        print "working"
    except Exception as e:
        logger.error(e)

