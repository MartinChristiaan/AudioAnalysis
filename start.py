import logging
log = logging.getLogger('werkzeug')
           
import librosa        
import numpy as np

from os import path
from pydub import AudioSegment
import matplotlib.pyplot as plt
#%% files                                                                         
def load_song(src):
    dst = src[:-4] +".wav"
    datadir = "data/"
    musicdir = "music/"
    if not path.exists(musicdir + dst):
        print("converting to wav")
        sound = AudioSegment.from_mp3(musicdir + src)
        sound.export(dst, format="wav")
    
    #%%
    if not path.exists(datadir + src[:-4] + ".txt"):
        print("Performing analysis")
        y, sr = librosa.load(musicdir + dst)
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
        #frames# np.unique(np.append(onset,frames))
        #onset.sort()
        t_onset = onset*(len(y)/sr)/C.shape[1]
        f_onset = np.argmax(C[:,onset],axis=0)
        #p_onset = onset_strengths[onset]
        def nparr_to_string(arr):
            return ",".join([str(item) for item in arr])
        
        
        items = [t_onset,f_onset]
        f = open(datadir + src[:-4] + ".txt",'w')
        lines =[nparr_to_string(item) + "\n" for item in items]
        f.writelines(lines)
        f.close()
        return t_onset,f_onset
    else:
        print("Loading from disk")
        f = open(datadir + src[:-4] + ".txt",'r')
        lines = np.array([[float(char) for char in line.split(',')] for line in f.readlines()]) #[nparr_to_string(item) + "\n" for item in items]
        return lines[0],lines[1]
    
if __name__ == "__main__":
    t_onset,f_onset = load_song("stronger.mp3")