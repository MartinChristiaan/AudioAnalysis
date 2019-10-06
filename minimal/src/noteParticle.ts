import { Song } from './song';
import { noteStates } from './hitDetection';
import { maxNotes } from './config';
import { getNoteColor } from './colors';

export class NoteParticle {
    song: Song;
    t_onset: number;
    x: number;
    y: number;
    t: number;
    ctx: CanvasRenderingContext2D;
    constructor(song: Song, idx: number, ctx : CanvasRenderingContext2D) {
        this.song = song;
        this.t_onset = song.t_onset[idx]; // load from analyis  
        var f_onset = song.f_onset[idx];
        this.t = f_onset / maxNotes;
        this.x = (f_onset + .5) * innerWidth / (maxNotes + 1);
        this.y = innerHeight;
        this.ctx = ctx
        //      this.TrailParticles = []
    }
    update(state: number, speed: number) {
        if (state != noteStates.DEAD) {
            var percentTravelled = (this.t_onset - this.song.t_min) / (this.song.t_max - this.song.t_min);
            this.y = innerHeight - (percentTravelled * innerHeight);
            this.draw(speed);
        }
        // this.TrailParticles.push(new TrailParticle())
        // this.TrailParticles.forEach(particle => {
        //     particle.update(dt)
        // });
        // remove dead particles
        // get position
        // draw circle at position
        // spawn particle
        // if below t_min, die
    }
    draw(speed:number) {

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        this.ctx.fillStyle = getNoteColor(this.t, speed);
        this.ctx.fill();
        this.ctx.restore();
    }
}
