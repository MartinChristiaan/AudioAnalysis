import { t_onset, f_onset, max_freq } from "./datareader.ts/index.js.js";
import { getNoteColor } from "./colorizer.js"
import { score } from "./scoremanager.js/index.js";
import { updateEmitter } from "./trail.js";


 


}


export function drawInstrument(t_cur, t_min, t_max, pressed, ctx, speed) {
  var y_now = (1 - (t_cur - t_min) / (t_max - t_min)) * innerHeight;

  for (let f = 0; f < max_freq + 1; f++) {
    var x_start = (f) / (max_freq + 1) * innerWidth
    var x_stop = (f + 1) / (max_freq + 1) * innerWidth

    //console.log(x_stop)
    ctx.beginPath();
    //
    ctx.lineWidth = 10;
    if (pressed[f] > 0) {
      ctx.filter = 'blur(2px)'
      ctx.strokeStyle = "white"

    }
    else {
      ctx.filter = "none"
      ctx.strokeStyle = getNoteColor((f + 1) / max_freq, speed)
    }
    ctx.moveTo(x_start, y_now)
    ctx.lineTo(x_stop, y_now)
    ctx.stroke();
    ctx.restore()
  }
}

function frmt(num) {
  return Math.round((num + 0.0001) * 10) / 10

}

export function draw_score(ctx, t_cur, duration) //: CanvasRenderingContext2D)
{
  ctx.lineWidth = 2
  ctx.font = "30px Arial";
  ctx.strokeStyle = "white"
  ctx.strokeText(parseFloat(t_cur).toFixed(2) + " : " + frmt(duration), 100, 100)
  ctx.strokeText(score, 100, 200)

}