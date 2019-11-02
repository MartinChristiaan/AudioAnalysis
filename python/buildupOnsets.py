import warnings  
with warnings.catch_warnings():  
    warnings.filterwarnings("ignore",category=FutureWarning)
import logging
import scipy.signal as sig
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


src = "lessons.mp3" # os.listdir(musicdir)[0]
dst = src[:-4] +".wav"
 
print(musicdir+ src)
sound = AudioSegment.from_mp3(musicdir + src)
sound.export(musicdir + dst, format="wav")

print("Performing analysis")
print("Loading Wav")

y, sr = librosa.load(musicdir + dst)
os.remove(musicdir + dst)

#print("hpss")

y_harmonic, y_percussive = librosa.effects.hpss(y)
print("chroma")
C = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, bins_per_octave=12)
print("tempo")

#%%
tempo, frames = librosa.beat.beat_track(y=y,sr=sr)
print("onset")
onset = librosa.onset.onset_detect(y,sr)


combined = np.unique(np.append(onset,frames))
#onset = 
#onset.sort()
   
   

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
            
        
    highestEnergyOnset = e_n[myOnsets].max()
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
peak_onsets_new = []
for i in idx:
    peak_onsets_new += [peak_onsets[i]]
os.listdir(musicdir)    
plt.figure()
plt.plot(t,e_n)
plt.plot(t[peaks],e_n[peaks],"o")


for po in peak_onsets_new:
    plt.plot(t[po],e_n[po],"x")


plt.show()

#e_onset = e_full[onset]

# find peaks in energy
# get highest peaks
# select nodes leading up to it










