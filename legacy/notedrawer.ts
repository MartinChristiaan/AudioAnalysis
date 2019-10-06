import {NoteParticle} from './particles.js'

class NoteDrawer {
    song: any;
    hitdetector: any;
    ctx: CanvasRenderingContext2D;
    particles : {}
    constructor(song,hitdetector,ctx) {
      this.song = song
      this.hitdetector = hitdetector
      this.ctx = ctx
      this.particles = []  
    }
  
    drawStates(speed) {
      var visible_idx = this.song.visible_idx  
      visible_idx.forEach(idx => {
          if (this.particles[idx] == undefined) {
              this.particles[idx] = new NoteParticle()
          }
          // do I have a particle for this id?
          // if no spawn new particle

      }

    //     var time = this.song.t_onset[i]
    //     var freq = this.song.f_onset[i] + 0.5
    //     var percent = 1 - (time - this.song.t_min) / (this.song.t_max - this.song.t_min);
    //     this.ctx.beginPath();
    //     var xpos = freq * innerWidth / (this.song.max_freq + 1)
    //     var ypos = percent * innerHeight
    //     this.ctx.arc(xpos, ypos, 12, 0, Math.PI * 2, false)
    
    //     if (this.hitdetector.note_states[i] == 1) {
    //       this.ctx.fillStyle = "green"
    //     }
    //     else if (this.hitdetector.note_states[i] == 2) {
    //       this.ctx.fillStyle = "red"
    //     }
    //     else {
    //       var t = freq / (this.song.max_freq + 1)
    //       this.ctx.fillStyle = getNoteColor(t, speed)
    //       updateEmitter(i, xpos, ypos, this.song.t_cur, this.ctx)
    //     }
    //     this.ctx.fill()
    //     this.ctx.restore();
    //   });
    }
}
   