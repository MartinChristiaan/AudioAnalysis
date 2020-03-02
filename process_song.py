#%%
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
import scipy.signal as sig
datadir = "../src/data/"
musicdir = "../music/"
from tqdm import tqdm
from multiprocessing import Pool
from anistrophicDiffusion import anisotropic_diffusion
import time
#%%

#%%
def process(y,sr):
    start = time.time()
    # print(f"loading wav took {time.time()-start} seconds")
    # print("hpss")
    
    y_harmonic, y_percussive = librosa.effects.hpss(y)
    print("chroma")
    C = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, bins_per_octave=12)
    print("tempo")
    tempo, frames = librosa.beat.beat_track(y=y,sr=sr)
    print("onset")

    e = librosa.feature.rms(y)
    w = 60
    
    e_full = np.convolve(e[0], np.ones(w), 'full') / w
    e_full = scipy.signal.resample(e_full,C.shape[1])
    e_n = e_full / max(e_full)

    o_env = librosa.onset.onset_strength(y, sr=sr) * e_n 
    onset = librosa.onset.onset_detect(onset_envelope=o_env, sr=sr)
    onset = np.unique(np.append(onset,frames))
    onset.sort()
    
    t_onset = onset*(len(y)/sr)/C.shape[1]
    t = np.linspace(0,len(y)/sr,C.shape[1])
    f_onset = np.argmax(C[:,onset],axis=0)
    e_onset = e_full[onset]
    
    e_n = e_full/e_full.max()
    e = librosa.feature.rms(y)
    e = scipy.signal.resample(e[0],C.shape[1])
    e = anisotropic_diffusion(e,10000,200,.2)
    e = e / max(e)
    return (t_onset,f_onset,e_onset,e)
 
        #f_onset = np.round(f_onset/np.max(f_onset) * (no_notes-1)) // done in js

#%% write data to ts library
# song is split up in x second intervals
period = 5
def np_arr_to_str(arr):
   return ",".join([str(item) for item in arr]) 
datadir =  "../data/"
songdatadir = datadir+"songs/"   

def filterTooMany(times,margin=0.3):
    good_idx = [0]
    
    for idx,otime in enumerate(times[1:]):
        if otime - times[good_idx[-1]] >= margin:
            good_idx+=[idx]
    
    return good_idx


class SongProcessor():
    
    def __init__(self,musicdir,songname):
        
        self.cur_period = 0
        self.t_onset = np.zeros(0)
        self.f_onset = np.zeros(0)
        self.e_onset = np.zeros(0)
        self.e = np.zeros(0)
        self.musicdir = musicdir
        self.songname = songname
        y,self.sr = librosa.load(self.musicdir + self.songname,duration=0.01,offset = 0)
  
        
    
    def process_period(self):
   
        t_start = self.cur_period * period
        y, sr = librosa.load(self.musicdir + self.songname,duration=period,offset = t_start)
        t_onset,f_onset,e_onset,e = process(y,sr)
        if t_start == 0:    
            headstart = np.argwhere(t_onset > 1)[:,0]
            print(headstart.shape)
            t_onset = t_onset[headstart]
            f_onset = f_onset[headstart]
            e_onset = e_onset[headstart]
        good_idx = filterTooMany(t_onset)
        
        
        self.t_onset = np.concatenate((self.t_onset,t_onset[good_idx]+t_start))
        # remove onsets to close together
        
        
        self.f_onset = np.concatenate((self.f_onset,f_onset[good_idx]))
        self.e_onset = np.concatenate((self.e_onset,e_onset[good_idx]))
        self.e  = np.concatenate((self.e,e))
        self.cur_period+=1
        items = [self.t_onset,self.f_onset,self.e_onset,self.e]
        lines = [np_arr_to_str(item) for item in items]
        return ":".join(lines)
        # f = open("static/data/currentsong.txt",'w')
        # f.writelines(lines)
        # f.close()


# songname = os.listdir("music")[0]
# processor = SongProcessor("music/",songname)
# import time

# for i in range(5):
    
#     start = time.time()
#     processor.process_period()
#     print(f"time taken {time.time()-start}")


# %%
