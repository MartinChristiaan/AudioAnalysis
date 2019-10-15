import { Song } from "./songplayer";
import {  keycodes, margin } from "./config";
import { Scoremanager } from "./scoreManager";
import { Note } from "./noteParticle";
import { Gear } from "./gearmanager";


export enum NoteState {
    ALIVE,
    HIT,
    MISS,
    DEAD
}

export class HitDetection {
    noteStates: any[];
    activeNotes: any[];
    activeNotesHits :number[]
    
    scoremanager: Scoremanager;

    constructor(scoremanager: Scoremanager) {
        this.activeNotes = new Array(11).fill(0);
        this.activeNotesHits = new Array(11).fill(0);
        this.scoremanager = scoremanager;
    }
    updateKey(key,gear:Gear) {
        let curCodes = keycodes[gear.numNotes]
        if (curCodes.includes(key)) {
            this.activeNotes[curCodes.indexOf(key)] = 5;
        }
    }

    detectHits(visibleNotes : Note [],{t_cur} : Song) {
        visibleNotes.forEach(note => {

            var t_min = note.onsetTime - margin;
            var t_max = note.onsetTime + margin;

            if (note.state == NoteState.ALIVE) {
                if (t_cur > t_min && t_cur < t_max) {
                     if (this.activeNotes[note.frequencyIdx] > 0) { // right button hit
                        note.state = NoteState.HIT; // hit
                        this.scoremanager.hit(); //+=activeNotes[parseInt(f_onset[idx])]
                        this.activeNotesHits[note.frequencyIdx] = 1
                    }
                }
                else if (t_cur > t_max) //no longer hittable
                {
                    note.state = NoteState.MISS; // miss
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
