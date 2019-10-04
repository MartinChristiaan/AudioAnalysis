import {drawStates, drawInstrument, draw_score } from './drawer.js';

import {src,t_onset,f_onset,e} from "./data.js"
import {Song} from './song.ts'
import {ScoreManager} from './scoremanager.js'
import {HitDetection} from './hitdetection.js'
// TODO  

// streak bonus
// prettier particles

var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
var song = new Song(src,t_onset,f_onset,e) 
var scoreManager = ScoreManager()
var hitDetection = HitDetection()

// momentum system : streak for speed

//const speed_mults = [1,0.8,0.6,0.5,0.4]

function main() {

  ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas


  var speed:number = scoreManager.getSpeed()
  song.update(speed)
  hitDetection.detectHits()

  
  var visible_idx = select_visible_input_idx(t_cur,t_min,t_max)
  var states = updateState(visible_idx,t_cur)
  var pressed = get_pressed()
  drawStates(visible_idx,states,ctx,t_min,t_max,t_cur,speed)
  drawInstrument(t_cur,t_min,t_max,pressed,ctx,speed)
  draw_score(ctx,t_cur,sound.duration())
  window.requestAnimationFrame(main);
}
main()




