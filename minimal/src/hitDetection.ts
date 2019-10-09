import { Song } from "./song";
import { maxNotes, keycodes, margin } from "./config";
import { DynamicsManager } from "./dynamicsManager";


export const noteStates = {
    DEAD: 0,
    ALIVE: 1,
    HIT: 2,
    MISS: 3,
    Killed : 4
}

export class HitDetection {
    noteStates: any[];
    activeNotes: any[];
    activeNotesHits :number[]
    song: Song;
    scoremanager: DynamicsManager;

    constructor(song: Song, scoremanager: DynamicsManager) {
        this.noteStates = new Array(song.t_onset.length).fill(noteStates.DEAD);
        
        this.activeNotes = new Array(maxNotes).fill(0);
        this.activeNotesHits = new Array(maxNotes).fill(0);

        this.song = song;
        this.scoremanager = scoremanager;

    }
    updateKey(key) {

        if (keycodes.includes(key)) {
            this.activeNotes[keycodes.indexOf(key)] = 5;
  
        }
    }

    detectHits() {
        this.song.visibleIdx.forEach(idx => {
            var t_min = this.song.t_onset[idx] - margin;
            var t_max = this.song.t_onset[idx] + margin;
            if (this.noteStates[idx] == noteStates.DEAD) {
                this.noteStates[idx] = noteStates.ALIVE;
            }

            if (this.noteStates[idx] == noteStates.ALIVE) {
                if (this.song.t_cur > t_min && this.song.t_cur < t_max) {
                    var noteIdx = parseInt(this.song.f_onset[idx])
                    if (this.activeNotes[noteIdx] > 0) { // right button hit
                        this.noteStates[idx] = noteStates.HIT; // hit
                        this.scoremanager.hit(); //+=activeNotes[parseInt(f_onset[idx])]
                        this.activeNotesHits[noteIdx] = 1
                        //activeNotes[parseInt(f_onset[idx])] = 0                    
                    }
                }
                else if (this.song.t_cur > t_max) //no longer hittable
                {
                    this.noteStates[idx] = noteStates.MISS; // miss
                    this.scoremanager.falseNegsative(); //score-=0.3*score
                }
            }
        });
        for (let idx = 0; idx < this.activeNotes.length; idx++) {
            if (this.activeNotes[idx] < 0) {
                this.activeNotes[idx]++
            }
            if (this.activeNotes[idx] > 0) {
                this.activeNotes[idx]--;
                if (this.activeNotes[idx] == 0)  {
                    if (this.activeNotesHits[idx] == 0) {
                        this.scoremanager.falsePositive();
                        this.activeNotes[idx] = -5
                    }
                    else
                    {
                        this.activeNotesHits[idx] = 0
                    }
                }
                
            }

        }
    }
}
