# -*- coding: utf-8 -*-
import os
import json
import process_song
musicfolder = os.getcwd() + "/static/music/"

from flask import Flask, render_template, request
app = Flask(__name__)

class State():
    def __init__(self):
        self.processor = None
        
state= State()
from mutagen.mp3 import MP3

@app.route("/")
def main():
   return render_template('index.html')

@app.route("/musicfolder")
def get_musicfolder():
   return musicfolder

@app.route("/songs")
def get_songs():
   
   paths = [f"{musicfolder}/{d}" for d in os.listdir(musicfolder)]
   lengths = [MP3(file_path).info.length for file_path in paths]
   minsecs = [ (int(length/60),int(length%60)) for length in lengths]
   
   lengths = [f"{minute}:{second}" for (minute,second) in minsecs]
   message = "\n".join(os.listdir(musicfolder)) + "\n" + "\n".join(lengths)
   print(message)
   return message
@app.route('/select_song',methods=['PUT'])
def select_song():
   songname =request.data.decode("utf-8")  
   state.processor = process_song.SongProcessor(musicfolder,songname)
   
   return update_data()
#   songname = request.form['songname']
#   print(songname)

@app.route('/update_data')
def update_data():
   result = state.processor.process_period()
   print(result)

   return result

def test_getsongs():
    get_songs()

if __name__ == '__main__':
   app.run(debug = True)
