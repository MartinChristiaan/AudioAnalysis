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


src = "Pendulum - Watercolour (Official Video).mp3" # os.listdir(musicdir)[0]
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
#%%
w = 60
e = librosa.feature.rms(y)
e_full = np.convolve(e[0], np.ones(w), 'full') / w
e_full = scipy.signal.resample(e_full,C.shape[1])
onset1 = librosa.onset.onset_detect(y,sr)
e_n = e_full / max(e_full)

o_env = librosa.onset.onset_strength(y, sr=sr) * e_n 
onset2 = librosa.onset.onset_detect(onset_envelope=o_env, sr=sr)

onsets = [onset1,onset2]



#%%
lo = []
for onset in onsets:
    t_onset = onset*(len(y)/sr)/C.shape[1]
    t = np.linspace(0,len(y)/sr,C.shape[1])
    f_onset = np.argmax(C[:,onset],axis=0)
    
    local_intensity = np.zeros_like(t)
    local_intensity[onset] = 1
    lo += [np.convolve(local_intensity,np.ones(60),'same')/60]
    
    


#cqt = np.abs(librosa.cqt(y, sr=sr, hop_length=512))
#subseg = librosa.segment.subsegment(cqt, frames, n_segments=2)
#
#plt.vlines(t[subseg],0,0.5)

#lag_pad = librosa.segment.recurrence_to_lag(rec, pad=True)
#rec_smooth = librosa.segment.path_enhance(rec, 51, window='hann', n_filters=7)

#%%

#%%

import cv2 
rec = librosa.segment.recurrence_matrix(C, mode='affinity')
sim = np.mean(rec,axis=1)
totalSimilarity2 = np.convolve(sim, np.ones(400), 'same') / 400
totalSimilarity2 = (totalSimilarity2-min(totalSimilarity2))/(max(totalSimilarity2) - min(totalSimilarity2))

ani = anisotropic_diffusion(sim,10000,200,.2)
ani = ani/max(ani)    

e = librosa.feature.rms(y)
e = scipy.signal.resample(e[0],C.shape[1])
e = anisotropic_diffusion(e,10000,200,.2)

plt.figure()
plt.plot(t,ani)
plt.plot(t,e/max(e))


#plt.legend(["energy","boosted","Similarity"])


#kernel = np.ones((3,3))
#signal.convolve2d(rec,kernel)
#plt.imshow(rec, cmap='hot', interpolation='nearest')

#plt.show()
#e_onset = e_full[onset]

# find peaks in energy
# get highest peaks
# select nodes leading up to it











