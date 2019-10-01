import {sound,t_onset,f_onset,e,max_freq} from './data.js'

sound.play();
var canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
var pressed_frames = 5
var node_scores = new Array(t_onset.length).fill(0);

function lrp(v1, v2, t) {
  return v1 + ((v2 - v1) * t);
  
}


function getcolor(percent)
{
  var r1 = 252
  var g1 = 92
  var b1 = 125

  var r2 = 106
  var g2 = 130
  var b2 = 251
  
  var r =lrp(r1,r2,percent)
  var g= lrp(g1,g2,percent)
  var b= lrp(b1,b2,percent)

  return ["rgb(",r,",",g,",",b,")"].join("");
 
}

function getcolor2(percent)
{
  var r1 = 0
  var g1 = 255
  var b1 = 0

  var r2 = 255
  var g2 = 0
  var b2 = 0
  
  var r =lrp(r1,r2,percent)
  var g= lrp(g1,g2,percent)
  var b= lrp(b1,b2,percent)

  return ["rgb(",r,",",g,",",b,")"].join("");
 
}

function draw() {

  var t_cur = sound.seek()

  var t_max = (t_cur + 2)
  var t_min = (t_cur - 1)



  var duration = sound.duration()
  var cur_idx =  parseInt(t_cur/duration * e.length)
  var ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas


  for (let i = 0; i < t_onset.length; i++) {
    
    const time = t_onset[i];
    
    var t_min_ok = t_onset[i] - 0.1
    var t_max_ok = t_onset[i] + 0.1
     

    if (time > t_min && time < t_max) {
      var freq = f_onset[i]+1
      var percent = 1 - (time - t_min) / (t_max - t_min);
      ctx.beginPath();
      ctx.arc(freq * innerWidth / max_freq, percent * innerHeight, 5, 0, Math.PI * 2, false)
      if (pressed_frames>0 && t_cur > t_min_ok && t_max_ok > t_cur) {
        node_scores[i] = 1
        
      }  
      if (node_scores[i] == 1) {
        ctx.fillStyle = "green"
      }
      else
      {
        var t= freq/max_freq
        ctx.fillStyle =getcolor(t)
      }
      ctx.fill()
      ctx.restore();
    }

  }
  var y_now = (1 - (t_cur - t_min) / (t_max - t_min)) * innerHeight;
  if(pressed_frames > 0)
  {
    ctx.strokeStyle = "green"
    pressed_frames--
  }
  else
  {
    var cur_e = e[cur_idx]
    ctx.strokeStyle = getcolor2(cur_e*2)
  }
  ctx.filter = 'blur(2px)'
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, y_now)
  ctx.lineTo(innerWidth, y_now);
  ctx.stroke();

  window.requestAnimationFrame(draw);
}
draw()


document.addEventListener('keydown', function(event) {
  pressed_frames = 5
 
});

