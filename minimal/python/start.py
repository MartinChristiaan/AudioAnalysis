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
    
    
def nparr_to_string(arr):
    return "[" + ",".join([str(item) for item in arr]) + "]"
        
#items = [t_onset,f_onset,e]

base_template = """
export class SongData
{
    f_onset: number [];
    e: number [];
    t_onset: number[];
    name : string;
    constructor(f_onset : number [],t_onset: number [],e: number [], name : string)
    {
        this.f_onset = f_onset
        this.t_onset = t_onset
        this.e = e
        this.name = name
    }
}
export var songs =["""

for (t_onset,f_onset,e,src)  in songdatas:
    items = [f_onset,t_onset,e]
    stringified = [nparr_to_string(item) for item in items]
    base_template += "new SongData({},{},{},{})".format(stringified[0],stringified[1],stringified[2],"'"+src + "'")+ ","
    
base_template = base_template[:-1]
base_template+="]"




f = open(datadir + "lib.ts",'w')
f.writelines(base_template)
f.close()






#lines =[nparr_to_string(item) + "\n" for item in items]


