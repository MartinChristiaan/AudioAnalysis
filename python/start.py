import warnings  
with warnings.catch_warnings():  
    warnings.filterwarnings("ignore",category=FutureWarning)
import logging
log = logging.getLogger('werkzeug')
import os           
import librosa        
import numpy as np
import scipy
from os import path
from pydub import AudioSegment
import matplotlib.pyplot as plt
datadir = "../src/data/"
musicdir = "../music/"
from tqdm import tqdm

#%%

songdatas = []


for src in tqdm(os.listdir(musicdir)):
    dst = src[:-4] +".wav"
 
    #print(musicdir+ src)
    sound = AudioSegment.from_mp3(musicdir + src)
    sound.export(musicdir + dst, format="wav")
    
    #print("Performing analysis")
    #print("Loading Wav")
    
    y, sr = librosa.load(musicdir + dst)
    os.remove(musicdir + dst)
    
    #print("hpss")
    
    y_harmonic, y_percussive = librosa.effects.hpss(y)
    #print("chroma")
    C = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, bins_per_octave=12)
    #print("tempo")
    tempo, frames = librosa.beat.beat_track(y=y,sr=sr)
    #print("onset")
    onset = librosa.onset.onset_detect(y,sr)
    onset = np.unique(np.append(onset,frames))
    onset.sort()
   
   

    e = librosa.feature.rms(y)
    w = 1000
    e = np.convolve(e[0], np.append(np.zeros(w),np.ones(w)), 'same') / w
    e = scipy.signal.resample(e,C.shape[1])
    t_onset = onset*(len(y)/sr)/C.shape[1]
    
    no_notes = 4
    
    f_onset = np.argmax(C[:,onset],axis=0)
    
    songdatas += [(t_onset,f_onset,e,src)]
    #f_onset = np.round(f_onset/np.max(f_onset) * (no_notes-1)) // done in js

#%% write data to ts library
    
    
#%% write data to ts library
def np_arr_to_str(arr):
   return ",".join([str(item) for item in arr]) + "\n"
  
    
#%%
datadir =  "../data/"
songdatadir = datadir+"songs/"   
for (t_onset,f_onset,e,src)  in songdatas:
    items = t_onset,f_onset,e
    lines = [np_arr_to_str(item) for item in items]
    f = open(songdatadir + src[:-4] + ".txt",'w')
    f.writelines(lines)
    f.close()

availableSongs = [x + "\n" for x in os.listdir(songdatadir)]
f = open(datadir + "available.txt",'w')
f.writelines(availableSongs)
f.close()





#lines =[nparr_to_string(item) + "\n" for item in items]


