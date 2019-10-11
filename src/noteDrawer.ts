import { Song } from './song';
import { NoteParticle } from "./noteParticle";
import { NoteColorer } from './colors';

export class NoteDrawer {
    song: Song;
    notePartles: NoteParticle[];
    constructor(gear,ctx : CanvasRenderingContext2D,colorer : NoteColorer) {
        
        this.notePartles = []
        gear.t_onset.forEach((time, idx, x) => {
            this.notePartles.push(new NoteParticle(gear, idx,ctx,colorer));
        });
    }
    update(noteStates : number[]) {
        noteStates.forEach((state, idx) => {
            if(this.notePartles[idx].update(state))
            {
                noteStates[idx] = 4
            }
        });
    }
}
