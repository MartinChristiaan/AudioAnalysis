import { Song } from './song';
import { noteStates } from './hitDetection';
import { maxNotes } from './config';
import { getNoteColor, getNoteColorRaw,rgb, addRandomDeviation } from './colors';

var decayFactor = 0.01
var drag = 0.01
class TrailParticle
{
    vy: any;
    vx: any;
    x: any;
    y: any;
    alpha: number;
    size: number;
    ctx: CanvasRenderingContext2D;
    color: string;

    constructor(x: any,y: any,vy: any,ctx:CanvasRenderingContext2D,color:string)
    {
        this.color = color
        this.vy = vy
        this.vx = (Math.random()-0.5)*100// random
        this.x = x
        this.y = y-20
        this.alpha = Math.random()*1 // random
        this.size = Math.random() * 3 //random ...
        this.ctx = ctx    

    }
    update(dt)
    {
        this.y = this.y + this.vy * dt 
        this.x = this.x + this.vx * dt

        this.vy -= this.vy * drag
        this.vx -= this.vx * drag
        
        
        this.draw()
        this.alpha -= decayFactor
    }
    draw()
    {
        this.ctx.beginPath();
        this.ctx.globalAlpha = this.alpha
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
       // draw decaying circle at my position
       
       this.ctx.fillStyle = this.color

       this.ctx.fill();
       this.ctx.restore();
       this.ctx.globalAlpha = 1

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

    constructor(song: Song, idx: number, ctx : CanvasRenderingContext2D) {
        this.song = song;
        this.t_onset = song.t_onset[idx]; // load from analyis  
        var f_onset = song.f_onset[idx];
        this.t = (f_onset+1) / maxNotes;
        this.color = getNoteColorRaw(this.t,0)
        this.x = (f_onset + .5) * innerWidth / (maxNotes);
        this.y = innerHeight;
        this.ctx = ctx
        this.alpha = 1
        this.TrailParticles = []


    }
    update(state: number, speed: number) {
        if (state != noteStates.DEAD) {
            var percentTravelled = (this.t_onset - this.song.t_min) / (this.song.t_max - this.song.t_min);
            this.y = innerHeight - (percentTravelled * innerHeight);
            this.color = getNoteColorRaw(this.t,speed,)
            this.draw(speed,state);
            //vy = speed?
            //vy = ds/dt -> innerheight/t_max-t_min
            if(state == noteStates.ALIVE)
            {
                if (Math.random() < 0.25)
                {
                    this.TrailParticles.push(
                        new TrailParticle(this.x,this.y,innerHeight/(this.song.t_max-this.song.t_min)
                        ,this.ctx, addRandomDeviation(this.color,20).getHTMLValue()))
                }
            }

            this.TrailParticles.forEach(p => {
                if (p.alpha>0) {
                    p.update(0.016)
                }
            });
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
    draw(speed:number,state:number) {

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 12, 0, Math.PI * 2, false);
        if (state == noteStates.ALIVE) {
            this.ctx.fillStyle = getNoteColor(this.t, speed);            
        }
        else if(state == noteStates.HIT)
        {
            // fade
            this.alpha-=0.1
            if (this.alpha<0) {
                this.alpha = 0
            }
            this.ctx.globalAlpha = this.alpha
            this.ctx.fillStyle = getNoteColor(this.t, speed);
            

        }
        else if(state == noteStates.MISS)
        {
            
            this.ctx.fillStyle = "red";

            // lerp to red/orange
            // add orange trial
        }
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.globalAlpha = 1

    }
}
