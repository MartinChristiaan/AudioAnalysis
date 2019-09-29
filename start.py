import logging
log = logging.getLogger('werkzeug')
           
import librosa        
import numpy as np

from os import path
from pydub import AudioSegment
import matplotlib.pyplot as plt
#%% files                                                                         
src = "stronger.mp3"
dst = src[:-4] +".wav"
if not path.exists(dst):
    print("converting to wav")
    sound = AudioSegment.from_mp3(src)
    sound.export(dst, format="wav")


#%%
y, sr = librosa.load(dst)
y_harmonic, y_percussive = librosa.effects.hpss(y)
C = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, bins_per_octave=36)
tempo, frames = librosa.beat.beat_track(y=y,sr=sr)
onset = librosa.onset.onset_detect(y,sr)
onset_strengths = librosa.onset.onset_strength(y,sr)
  
duration = len(y)/sr
sr2 = len(onset_strengths)/duration
plt.figure()
t = np.arange(len(onset_strengths))*1/sr2
plt.plot(t,onset_strengths)
plt.scatter(t[onset],onset_strengths[onset],c ="red")

plt.scatter(t[frames],np.ones_like(frames) * 10)



#%%

from scipy import signal
#onset = frames# np.unique(np.append(onset,frames))
#onset.sort()
t_onset = onset*(len(y)/sr)/C.shape[1]
f_onset = np.argmax(C[:,onset],axis=0)
p_onset = onset_strengths[onset]
def nparr_to_string(arr):
    return ",".join([str(item) for item in arr])



f = open("main.js",'r')
lines =  f.readlines()

lines[0] = "t_onset = [" + nparr_to_string(t_onset) + "]\n" 
lines[1] = "f_onset = [" + nparr_to_string(f_onset) + "]\n" 
lines[2] = "p_onset = [" + nparr_to_string(p_onset) + "]\n" 

lines[3] = "var sound = new Howl({src: ['" +src + "']});\n"
lines[4] = "max_freq = {}\n".format(np.max(f_onset))

f.close()
f= open("main.js",'w')
f.writelines(lines)
f.close()