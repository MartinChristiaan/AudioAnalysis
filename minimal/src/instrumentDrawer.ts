import { Song } from "./song";
import { maxNotes } from "./config";
import { NoteColorer } from "./colors";
import { lineTo,moveTo } from "./postprocessing";
export class InstrumentDrawer {
    ctx: CanvasRenderingContext2D;
    song: Song;
    noteColoror: NoteColorer;
    constructor(song: Song, ctx: CanvasRenderingContext2D,colorizer:NoteColorer) {
        this.song = song
        this.ctx = ctx
        this.noteColoror =colorizer
    }
    update(ActiveNotes: number[]) {
        var song = this.song
        var ctx = this.ctx
        var y_now = (1 - (song.t_cur - song.t_min) / (song.t_max - song.t_min)) * innerHeight;
        for (let f = 0; f < maxNotes ; f++) {
            var x_start = (f) / (maxNotes ) * innerWidth
            var x_stop = (f + 1) / (maxNotes) * innerWidth

            //console.log(x_stop)
            ctx.beginPath();
            //
            ctx.lineWidth = 10;
            if (ActiveNotes[f] > 0) {
                //ctx.filter = 'blur(2px)'
                ctx.strokeStyle = "white"
            }
            else if(ActiveNotes[f] < 0)
            {
                ctx.strokeStyle = "red"
            }
            else {
                ctx.filter = "none"
                ctx.strokeStyle = this.noteColoror.getNoteColor((f + 1) / maxNotes)
            }
            moveTo(x_start, y_now)
            lineTo(x_stop, y_now)
            ctx.stroke();
            ctx.restore()
        }
    }

}


