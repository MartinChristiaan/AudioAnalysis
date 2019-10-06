import { Song } from './song';
import { NoteParticle } from "./noteParticle";

export class NoteDrawer {
    song: Song;
    notePartles: NoteParticle[];
    constructor(song: Song,ctx : CanvasRenderingContext2D) {
        this.song = song;
        this.notePartles = []
        this.song.t_onset.forEach((time, idx, x) => {
            this.notePartles.push(new NoteParticle(song, idx,ctx));
        });
    }
    update(noteStates : number[],speed:number) {
        noteStates.forEach((state, idx) => {
            this.notePartles[idx].update(state,speed);
        });
    }
}
