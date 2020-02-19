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

# Load song
# perform block of analysis

# push server message



# 


#%%
src = os.listdir(musicdir)[0]
start = time.time()
y, sr = librosa.load(musicdir + src)
print(y)
x = input()
#%%
