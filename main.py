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

@app.route("/")
def main():
   return render_template('index.html')

@app.route("/musicfolder")
def get_musicfolder():
   return musicfolder

@app.route("/songs")
def get_songs():
   return "\n".join(os.listdir(musicfolder))

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
if __name__ == '__main__':

   app.run(debug = True)
