import {sound,t_onset,f_onset,e,max_freq} from './data.js'
import {updateState, get_pressed, getSpeed} from './statemanager.js'
import {select_visible_input_idx} from './analysis.js'
import { drawStates, drawInstrument, draw_score } from './drawer.js';


// TODO  

// streak bonus
// prettier particles

sound.play();
sound.volume(0)
var canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight



//sound.play();
// momentum system : streak for speed
var speed = 1

const speed_mults = [1,0.8,0.6,0.5,0.4]

function main() {
  var t_cur = sound.seek()
  var duration = sound.duration()

  var cur_idx =  parseInt(t_cur/duration * e.length)

  var speed = getSpeed()
  
  var delta = 2/(speed+1) //0.5/e[cur_idx]  0.5/speed
  var t_max = (t_cur + delta) 
  var t_min = (t_cur - 0.5 * delta)

  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas

  var visible_idx = select_visible_input_idx(t_cur,t_min,t_max)
  var states = updateState(visible_idx,t_cur)
  var pressed = get_pressed()
  drawStates(visible_idx,states,ctx,t_min,t_max,t_cur,speed)
  drawInstrument(t_cur,t_min,t_max,pressed,ctx,speed)
  draw_score(ctx,t_cur,sound.duration())
  window.requestAnimationFrame(main);
}
main()




