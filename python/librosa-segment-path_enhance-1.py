# Use a 51-frame diagonal smoothing filter to enhance paths in a recurrence matrix

y, sr = librosa.load(librosa.util.example_audio_file(), duration=30)
hop_length = 1024
chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)
rec = librosa.segment.recurrence_matrix(chroma, mode='affinity', self=True)
rec_smooth = librosa.segment.path_enhance(rec, 51, window='hann', n_filters=7)

# Plot the recurrence matrix before and after smoothing

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 4))
plt.subplot(1,2,1)
librosa.display.specshow(rec, x_axis='time', y_axis='time',
                         hop_length=hop_length)
plt.title('Unfiltered recurrence')
plt.subplot(1,2,2)
librosa.display.specshow(rec_smooth, x_axis='time', y_axis='time',
                         hop_length=hop_length)
plt.title('Multi-angle enhanced recurrence')
plt.tight_layout()
plt.show()
