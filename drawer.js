import { t_onset,f_onset,max_freq } from "./data.js";
import {getNoteColor} from "./colorizer.js"
import { score } from "./statemanager.js";
import { updateEmitter } from "./trail.js";





export function drawStates(visible_idx,note_states,ctx,t_min,t_max,t_cur,speed)
{
    visible_idx.forEach(i => {
        var time = t_onset[i]
        var freq = f_onset[i]+0.5
        var percent = 1 - (time - t_min) / (t_max - t_min);
        ctx.beginPath();
        var xpos = freq * innerWidth / (max_freq+1)
        var ypos = percent * innerHeight
        ctx.arc(xpos, ypos, 12, 0, Math.PI * 2, false)
  
        if (note_states[i] == 1) {
          ctx.fillStyle = "green"
        }
        else if (note_states[i] == 2)
        {
          ctx.fillStyle = "red"
        }
        else
        {
          var t= freq/(max_freq+1)
          ctx.fillStyle =getNoteColor(t,speed)
          updateEmitter(i,xpos,ypos,t_cur,ctx)
        }
        ctx.fill()
        ctx.restore();
    });
}
export function drawInstrument(t_cur,t_min,t_max,pressed,ctx,speed)
{
    var y_now = (1 - (t_cur - t_min) / (t_max - t_min)) * innerHeight;

    for (let f = 0; f < max_freq + 1; f++) {
        var x_start = (f) / (max_freq+1) * innerWidth
        var x_stop =  (f+1) / (max_freq+1) * innerWidth

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
          ctx.strokeStyle = getNoteColor((f+1)/max_freq,speed)
        }
        ctx.moveTo(x_start, y_now)
        ctx.lineTo(x_stop, y_now)
        ctx.stroke();
        ctx.restore()
    }
}

function frmt(num)
{
  return Math.round((num+0.0001) * 10) / 10

}

export function draw_score(ctx,t_cur,duration) //: CanvasRenderingContext2D)
{
  ctx.lineWidth = 2
  ctx.font = "30px Arial";
  ctx.strokeStyle = "white"
  ctx.strokeText(parseFloat(t_cur).toFixed(2)+ " : "+ frmt(duration) ,100,100)
  ctx.strokeText(score ,100,200)
  
}