import { Song } from './song';
import { noteStates } from './hitDetection';
import {  orbitParticles } from './config';
import { rgb, addRandomDeviation, NoteColorer } from './colors';
import {  drawCircle } from './postprocessing';
import {ctx} from './main'
import { Gear } from './gearmanager';
var decayFactor = 0.01
var drag = 0.01
class TrailParticle {
    vy: any;
    vx: any;
    x: any;
    y: any;
    alpha: number;
    size: number;
    ctx: CanvasRenderingContext2D;
    color: string;

    constructor(x: any, y: any, vy: any, ctx: CanvasRenderingContext2D, color: string) {
        this.color = color
        this.vy = vy
        this.vx = (Math.random() - 0.5) * 100// random
        this.x = x
        this.y = y - 20
        this.alpha = Math.random() * 1 // random
        this.size = Math.random() * 3 //random ...
        this.ctx = ctx

    }
    update(dt) {
        this.y = this.y + this.vy * dt
        this.x = this.x + this.vx * dt

        this.vy -= this.vy * drag
        this.vx -= this.vx * drag


        this.draw()
        this.alpha -= decayFactor
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.globalAlpha = this.alpha
        drawCircle(this.x,this.y,this.size)
        //this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        // draw decaying circle at my position

        this.ctx.fillStyle = this.color

        this.ctx.fill();
        this.ctx.restore();
        this.ctx.globalAlpha = 1

    }

}

export class OrbitParticle {
    angle: number;
    r: number;
    y: number;
    x: number;
    color: rgb;
    size: number;
    constructor(r: number, angle: number, y: number, x: number, size: number, color: rgb) {
        this.r = r
        this.angle = angle
        this.y = y
        this.x = x
        this.color = color
        this.size = size
    }
    update(y) {

        this.y = y
        this.angle += Math.PI * 0.01 // slowly rotate
        this.draw()
    }
    updateExplode()
    {
        this.angle += Math.PI * 0.01
        this.r += 30
        this.draw()
    }
    draw() {
        ctx.beginPath();
        var x = this.x + Math.cos(this.angle) * this.r
        var y = this.y + Math.sin(this.angle) * this.r
        drawCircle(x,y,this.size)
  //      ctx.arc(x, y, this.size, 0, Math.PI * 2, false);
        // draw decaying circle at my position

        ctx.fillStyle = this.color.getHTMLValue()

        ctx.fill();
        ctx.restore();
    }



}


export class NoteParticle {
    song: Song;
    t_onset: number;
    x: number;
    y: number;
    t: number;
    ctx: CanvasRenderingContext2D;
    alpha: number;
    TrailParticles: TrailParticle[];
    color: rgb;
    noteColorer: NoteColorer;
    orbitParticles: OrbitParticle[];
    livetimeAfterDead: number;

    constructor({f_onset,t_onset,numNotes} : Gear, idx: number, ctx: CanvasRenderingContext2D, noteColorer: NoteColorer) {
        this.t_onset = t_onset[idx]; // load from analyis  
        let myf_onset = f_onset[idx];
        this.t = (myf_onset + 1) / numNotes;

        this.x = (myf_onset + .5) * innerWidth / (numNotes);
        this.y = innerHeight;
        this.ctx = ctx
        this.noteColorer = noteColorer
        this.alpha = 1
        this.TrailParticles = []
        this.color = this.noteColorer.getNoteColorRaw(this.t)
        this.livetimeAfterDead = 20
        this.orbitParticles = []

    }
    update(state: number) {
        if (state != noteStates.DEAD) {
            this.color = this.noteColorer.getNoteColorRaw(this.t)
            if (this.orbitParticles.length == 0) {
                this.orbitParticles =Array.from({ length: orbitParticles }, (_, id) => {
                    return new OrbitParticle(10
                        , id * Math.PI * 2 / orbitParticles
                        , this.y, this.x
                        , 3
                        , addRandomDeviation(this.color, 100))
        
                })        
            }
            
            var percentTravelled = (this.t_onset - this.song.t_min) / (this.song.t_max - this.song.t_min);
            this.y = innerHeight - (percentTravelled * innerHeight);

            
            //vy = speed?
            //vy = ds/dt -> innerheight/t_max-t_min
            if (state == noteStates.ALIVE) {
                if (Math.random() < 0.25) {
                    this.TrailParticles.push(
                        new TrailParticle(this.x, this.y, innerHeight / (this.song.t_max - this.song.t_min)
                            , this.ctx, addRandomDeviation(this.color, 20).getHTMLValue()))
                }
            }

            this.TrailParticles.forEach(p => {
                if (p.alpha > 0) {
                    p.update(0.016)
                }
            });
            return this.draw(state);
        }

        // this.TrailParticles.push(new TrailParticle())
        // this.TrailParticles.forEach(particle => {
        //     particle.update(dt)
        // });
        // remove dead particles
        // get position
        // draw circle at position
        // spawn particle
        // if below t_min, die
    }
    draw(state: number) {


        if (state == noteStates.ALIVE) {
            this.orbitParticles.forEach(x => { x.update(this.y) })

        }
        else if (state == noteStates.HIT) {
            this.orbitParticles.forEach(x => { x.updateExplode() })
            this.livetimeAfterDead-=1
            if (this.livetimeAfterDead==0) {
                return true
            }
            // // fade
            // this.alpha-=0.1
            // if (this.alpha<0) {
            //     this.alpha = 0
            // }
            // this.ctx.globalAlpha = this.alpha
            // this.ctx.fillStyle = this.noteColorer.getNoteColor(this.t);
            // EXPLODE!            

        }
        else if (state == noteStates.MISS) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "red";
            //this.ctx.arc(this.x, this.y, 12, 0, Math.PI * 2, false);
            drawCircle(this.x,this.y,12)
            this.ctx.fill();
            this.ctx.restore();


            // lerp to red/orange
            // add orange trial
        }
        return false

        //        this.ctx.globalAlpha = 1

    }
}
