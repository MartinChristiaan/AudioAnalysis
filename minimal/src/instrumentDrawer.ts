import { Song } from "./song";
import { maxNotes } from "./config";
import { getNoteColor } from "./colors"
export class InstrumentDrawer {
    ctx: CanvasRenderingContext2D;
    song: Song;
    constructor(song: Song, ctx: CanvasRenderingContext2D) {
        this.song = song
        this.ctx = ctx
    }
    update(speed: number, ActiveNotes: number[]) {
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
            else {
                ctx.filter = "none"
                ctx.strokeStyle = getNoteColor((f + 1) / maxNotes, speed)
            }
            ctx.moveTo(x_start, y_now)
            ctx.lineTo(x_stop, y_now)
            ctx.stroke();
            ctx.restore()
        }
    }

}


