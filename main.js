import {sound,t_onset,f_onset,e,max_freq} from './data.js'
import {updateState, get_pressed} from './statemanager.js'
import {select_visible_input_idx} from './analysis.js'
import { drawStates, drawInstrument } from './drawer.js';

sound.play();

var canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight



//sound.play();

function main() {
  var t_cur = sound.seek()
  var t_max = (t_cur + 2)
  var t_min = (t_cur - 1)
  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas

  var visible_idx = select_visible_input_idx(t_cur,t_min,t_max)
  var states = updateState(visible_idx,t_cur)
  var pressed = get_pressed()
  drawStates(visible_idx,states,ctx,t_min,t_max)
  drawInstrument(t_cur,t_min,t_max,pressed,ctx)

  window.requestAnimationFrame(main);
}
main()




