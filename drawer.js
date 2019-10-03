import { t_onset,f_onset,max_freq } from "./data.js";
import {get_note_color} from "./colorizer.js"
export function drawStates(visible_idx,note_states,ctx,t_min,t_max)
{
    visible_idx.forEach(i => {
        var time = t_onset[i]
        var freq = f_onset[i]+0.5
        var percent = 1 - (time - t_min) / (t_max - t_min);
        ctx.beginPath();
        ctx.arc(freq * innerWidth / max_freq, percent * innerHeight, 12, 0, Math.PI * 2, false)
  
        if (note_states[i] == 1) {
          ctx.fillStyle = "green"
        }
        else if (note_states[i] == 2)
        {
          ctx.fillStyle = "red"
        }
        else
        {
          var t= freq/max_freq
          ctx.fillStyle =get_note_color(t)
        }
        ctx.fill()
        ctx.restore();
    });
}
export function drawInstrument(t_cur,t_min,t_max,pressed,ctx)
{
    var y_now = (1 - (t_cur - t_min) / (t_max - t_min)) * innerHeight;

    for (let f = 0; f < max_freq; f++) {
        var x_start = (f) / max_freq * innerWidth
        var x_stop =  (f+1) / max_freq * innerWidth

        //console.log(x_stop)
        ctx.beginPath();
        //
        ctx.lineWidth = 10;
        if (pressed[f]>0) {
          ctx.filter = 'blur(2px)'
          ctx.strokeStyle = "white"
      
        }
        else
        {
          ctx.filter = "none"
          ctx.strokeStyle = get_note_color((f+1)/max_freq)
        }
        ctx.moveTo(x_start, y_now)
        ctx.lineTo(x_stop, y_now);
        ctx.stroke();
        ctx.restore()
    }
}
