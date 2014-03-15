from flask import Flask, request
from queue import SongQueue
import json

jsonify = json.dumps

app = Flask(__name__)
queue = SongQueue()


@app.route('/')
def index():
    return 'hello world'

@app.route('/current')
def current():
    songid = queue.get_current_song()
    return jsonify(songid)

@app.route('/previous')
def previous():
    prev_queue = queue.get_previous_queue()
    app.logger.debug(prev_queue)
    return jsonify(prev_queue)

@app.route('/next')
def next_song():
    next_song_id = queue.get_next_song()
    return jsonify(next_song_id)


if __name__ == '__main__':
    app.run(debug=True)
