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

#%%

songdatas = []

srcs = os.listdir(musicdir)
def process(src):
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
   
    w = 60
    
    
    e_full = np.convolve(e[0], np.ones(w), 'full') / w
    e_full = scipy.signal.resample(e_full,C.shape[1])
    t_onset = onset*(len(y)/sr)/C.shape[1]

    t = np.linspace(0,len(y)/sr,C.shape[1])
    f_onset = np.argmax(C[:,onset],axis=0)
    
    
    e_n = e_full/e_full.max()
    peaks,_ = sig.find_peaks(e_n,0.80,distance = 400)
    peak_onsets = []
    distances = []
    
    for i,peak in enumerate(peaks):
        myOnsets = []
        myValue = e_n[peak]
        possibe_onsets = onset[onset<peak]
        decreasing = True
        idx = -1
        while (decreasing):
            myonset = possibe_onsets[idx]
            
            if e_n[myonset]  < myValue + .05:
                myOnsets+=[myonset]
                if e_n[myonset]  < myValue:
                    myValue = e_n[myonset]
            else:
                decreasing = False
            # if I have not decreased that much move make me new peak
                
            idx-=1
                
            
      
        final_onsets = []
        stopped = False
        for ons in myOnsets[::-1]:
            if not stopped:
                final_onsets.append(ons)
                if e_n[ons] > e_n[peak] - 0.02:
                    stopped = True
    
        peak_onsets+=[final_onsets]
        distances += [e_n[peak] - myValue]



    distances = np.array(distances)
    
    
    idx = np.arange(len(distances),dtype = int)[distances>0.25]
    peaks = peaks[idx]
    buildups_onset = []
    buildups_e = []
    for i in idx:
        for ons in peak_onsets[i]:
            buildups_onset+= [np.where(onset == ons)[0][0]]
            buildups_e += [ons]
    
        
    return (t_onset,f_onset,e_full,buildups_onset,buildups_e,src)
        #f_onset = np.round(f_onset/np.max(f_onset) * (no_notes-1)) // done in js

#%% write data to ts library
import time
if __name__ == '__main__':
    start = time.time()
    print("Starting")
    p = Pool(6)
    songdatas = p.map(process, srcs)
    print("Time Taken {} " .format(time.time()-start))
    
#%% write data to ts library
def np_arr_to_str(arr):
   return ",".join([str(item) for item in arr]) + "\n"
  
    
#%%
datadir =  "../data/"
songdatadir = datadir+"songs/"   
for (t_onset,f_onset,e,buildups_onset,buildups_e,src)  in songdatas:
    items = t_onset,f_onset,e,buildups_onset,buildups_e
    lines = [np_arr_to_str(item) for item in items]
    f = open(songdatadir + src[:-4] + ".txt",'w')
    f.writelines(lines)
    f.close()

availableSongs = [x + "\n" for x in os.listdir(songdatadir)]
f = open(datadir + "available.txt",'w')
f.writelines(availableSongs)
f.close()





#lines =[nparr_to_string(item) + "\n" for item in items]


