import logging
log = logging.getLogger('werkzeug')
           
import librosa        
import numpy as np
import scipy
from os import path
from pydub import AudioSegment
import matplotlib.pyplot as plt
datadir = "data/"
musicdir = "music/"
                                                               
def load_song(src):
    dst = src[:-4] +".wav"
    if not path.exists(musicdir + dst):
        print("converting to wav")
        print(musicdir+ src)
        sound = AudioSegment.from_mp3(musicdir + src)
        sound.export(musicdir + dst, format="wav")
    

    if True:#not path.exists(datadir + src[:-4] + ".txt"):
        print("Performing analysis")
        print("Loading Wav")
        
        y, sr = librosa.load(musicdir + dst)
        print("hpss")
        
        y_harmonic, y_percussive = librosa.effects.hpss(y)
        print("chroma")
        C = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, bins_per_octave=12)
        print("tempo")
        tempo, frames = librosa.beat.beat_track(y=y,sr=sr)
        print("onset")
        onset = librosa.onset.onset_detect(y,sr)
        onset = np.unique(np.append(onset,frames))
        onset.sort()
#        onset_strengths = librosa.onset.onset_strength(y,sr)
#        onset_strengths = librosa.onset.onset_strength(y,sr)
#
#        samples_per_block = 50
#        
#        blocks = onset_strengths[:-(onset_strengths.shape[0]%samples_per_block)].reshape(-1,samples_per_block)
#        
#        norm_block = [] 
#        for block in blocks:
#            a = np.min(block)
#            b = np.max(block)
#            norm_block+=[(block-a)/(b-a)]
#        extra_block = onset_strengths[-(onset_strengths.shape[0]%samples_per_block):]
#        a = np.min(extra_block)
#        b = np.max(extra_block)
#        extra_block=(extra_block-a + 0.0000001)/(b-a +0.000001)
#        
#        
#         
#        norm_block = np.array(norm_block)
#        norm_block = norm_block.reshape(norm_block.shape[0] * norm_block.shape[1])
#        norm_block = np.concatenate([norm_block,extra_block])    
#        onset,_ = scipy.signal.find_peaks(norm_block,0.3)

        print("energy")
        e = librosa.feature.rms(y)
        w = 25
        e = np.convolve(e[0], np.ones(w), 'valid') / w
        e = scipy.signal.resample(e,C.shape[1])
#
#        duration = len(y)/sr
#        sr2 = len(onset_strengths)/duration
#        plt.figure()
#        t = np.arange(len(onset_strengths))*1/sr2
#        

        
        t_onset = onset*(len(y)/sr)/C.shape[1]
        f_onset = np.round(np.argmax(C[:,onset],axis=0)/2.5)
        #p_onset = onset_strengths[onset]
        def nparr_to_string(arr):
            return ",".join([str(item) for item in arr])
        
        
        items = [t_onset,f_onset,e]
        f = open(datadir + src[:-4] + ".txt",'w')
        lines =[nparr_to_string(item) + "\n" for item in items]
        f.writelines(lines)
        f.close()
        return t_onset,f_onset,e
    else:
        print("Loading from disk")
        f = open(datadir + src[:-4] + ".txt",'r')
        lines = np.array([[float(char) for char in line.split(',')] for line in f.readlines()]) #[nparr_to_string(item) + "\n" for item in items]
        return lines
    
def nparr_to_string(arr):
    return ",".join([str(item) for item in arr])

if __name__ == "__main__":
    src = musicdir + "timebomb.mp3"
    t_onset,f_onset,e = load_song("timebomb.mp3")
    f = open("data.js",'w')
    lines =  []
    print(f_onset)
    lines += ["export const t_onset = [" + nparr_to_string(t_onset) + "]\n"] 
    lines += ["export const f_onset = [" + nparr_to_string(f_onset) + "]\n"] 
    lines += ["export const e = [" + nparr_to_string(e) + "]\n" ]
    
    lines += ["export var sound = new Howl({src: ['" +src + "']});\n"]
    lines += ["export const max_freq = {}\n".format(np.max(f_onset))]
    
    f.writelines(lines)
    f.close()
        
        
    
    
#%%
    
#print("Performing analysis")
#print("Loading Wav")
#dst = "stronger.wav"
#y_raw, sr = librosa.load(musicdir + dst)
##%%
#print("hpss")
#y= y_raw[:int(len(y_raw)/3)]
#y_harmonic, y_percussive = librosa.effects.hpss(y)
#
#
#
#
#print("chroma")
#C = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, bins_per_octave=36)
#print("tempo")
#tempo, frames = librosa.beat.beat_track(y=y,sr=sr)
#print("onset")
##onset = librosa.onset.onset_detect(y,sr)
#
##%%
#onset_strengths = librosa.onset.onset_strength(y,sr)
#
#samples_per_block = 25
#
#blocks = onset_strengths[:-(onset_strengths.shape[0]%samples_per_block)].reshape(-1,samples_per_block)
#
#norm_block = [] 
#for block in blocks:
#    a = np.min(block)
#    b = np.max(block)
#    norm_block+=[(block-a)/(b-a)]
#extra_block = onset_strengths[-(onset_strengths.shape[0]%samples_per_block):]
#a = np.min(extra_block)
#b = np.max(extra_block)
#extra_block=(extra_block-a + 0.0000001)/(b-a +0.000001)
#
#
# 
#norm_block = np.array(norm_block)
#norm_block = norm_block.reshape(norm_block.shape[0] * norm_block.shape[1])
#norm_block = np.concatenate([norm_block,extra_block])    
#peaks,_ = scipy.signal.find_peaks(norm_block,0.2)
#
#
##%%
#print("energy")
#e = librosa.feature.rms(y)[0]
#w = 40
#e = scipy.signal.resample(e,C.shape[1])
#
#e = np.convolve(e, np.ones(w), 'same') / w
#duration = len(y)/sr
#sr2 = len(onset_strengths)/duration
#plt.figure()
#t = np.arange(len(onset_strengths))*1/sr2
#peaks,_ = scipy.signal.find_peaks(norm_block,0.3)
#
#
#plt.figure(figsize = (16,12))
#plt.plot(t,norm_block)
#plt.scatter(t[peaks],norm_block[peaks],c ="red")
#plt.plot(t,e*40)

