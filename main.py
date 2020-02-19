# -*- coding: utf-8 -*-
import os
import json
musicfolder = os.getcwd() + "/music"

from flask import Flask, render_template
app = Flask(__name__)

@app.route("/musicfolder")
def get_musicfolder():
   return musicfolder

@app.route("/songs")
def get_songs():
   return json.dumps(os.listdir(musicfolder))




if __name__ == '__main__':
   # app.static_url_path = f"{app.root_path}\\dist"
   # print(app.static_url_path)
   app.run(debug = True)