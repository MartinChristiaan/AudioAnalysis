import { Song } from './song';
import { NoteState } from './hitDetection';
import {  orbitParticles } from './config';
import { rgb, addRandomDeviation, NoteColorer } from './colors';
import {  drawCircle } from './postprocessing';
import {ctx, noteColorer, canvas} from './main'
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
    color: string;

    constructor(x: any, y: any, vy: any, color: string) {
        this.color = color
        this.vy = vy
        this.vx = (Math.random() - 0.5) * 100// random
        this.x = x
        this.y = y - 20
        this.alpha = Math.random() * 1 // random
        this.size = Math.random() * 3 //random ...

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
        ctx.beginPath();
        ctx.globalAlpha = this.alpha
        drawCircle(this.x,this.y,this.size)
        //ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        // draw decaying circle at my position

        ctx.fillStyle = this.color

        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1

    }

}

export class OrbitParticle {
    angle: number;
    r: number;
    y: number;
    x: number;
    color: rgb;
    size: number;
    isbuildup : boolean
    constructor(r: number, angle: number, y: number, x: number, size: number, color: rgb) {
        this.r = r
        this.angle = angle
        this.y = y
        this.x = x
        this.color = color
        this.size = size

    }
    update(x,y) {
        this.x =x
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
        //console.log("drawing orbitprtcl")
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


export class Note {
    song: Song;
    t_onset: number;
    state : NoteState
    x: number;
    frequencyIdx:number
    y: number;
    t: number;

    TrailParticles: TrailParticle[];
    color: rgb;
    orbitParticles: OrbitParticle[];
    livetimeAfterDead: number;    
    isBuildUp: boolean;
    idx: number;
    
    constructor(song : Song,gear : Gear, idx: number) {
        this.t_onset = song.t_onset[idx]; // load from analyis  
        this.state= NoteState.ALIVE
        this.song = song
        this.y = innerHeight;
        this.TrailParticles = []
        this.color = noteColorer.getNoteColorRaw(this.t)
        this.livetimeAfterDead = 20
        this.orbitParticles = []
        this.idx= idx
        this.changeGear(song,gear)
        this.isBuildUp = song.buildupOnsets.includes(idx) // not e idx not onset idx

    }
    changeGear({f_onset,maxFreq}:Song,{numNotes,downSample} : Gear)
    {
        if (this.idx % downSample !==0 ) {
            this.state = NoteState.HIT
        }

        let myf_onset = f_onset[this.idx];
        this.frequencyIdx = Math.round(myf_onset/maxFreq *numNotes)
        this.t = (this.frequencyIdx + 1) / numNotes;
        this.x = (this.frequencyIdx + .5) * canvas.width / (numNotes);
        this.color = noteColorer.getNoteColorRaw(this.t)
    
    }
    update() {
            
            var percentTravelled = (this.t_onset - this.song.t_min) / (this.song.t_max - this.song.t_min);
            this.y = innerHeight - (percentTravelled * innerHeight);
            this.color = noteColorer.getNoteColorRaw(this.t)

            if (this.orbitParticles.length == 0) {
                this.orbitParticles =Array.from({ length: orbitParticles }, (_, id) => {
                    return new OrbitParticle(10
                        , id * Math.PI * 2 / orbitParticles
                        , this.y, this.x
                        , 3
                        , this.isBuildUp?new rgb(255,0,0):addRandomDeviation(this.color, 100))
        
                })        
            }
            //console.log(this.orbitParticles)

            
            //vy = speed?
            //vy = ds/dt -> innerheight/t_max-t_min
            if (this.state == NoteState.ALIVE) {
                if (Math.random() < 0.25) {
                    this.TrailParticles.push(
                        new TrailParticle(this.x, this.y, innerHeight / (this.song.t_max - this.song.t_min)
                            , addRandomDeviation(this.color, 20).getHTMLValue()))
                }
            }

            this.TrailParticles.forEach(p => {
                if (p.alpha > 0) {
                    p.update(0.016)
                }
            });
            this.draw();
        }

        
    
    draw() {

        let state =this.state
        if (state == NoteState.ALIVE) {
            this.orbitParticles.forEach(x => { x.update(this.x,this.y) })

        }
        else if (state == NoteState.HIT) {
            this.orbitParticles.forEach(x => { x.updateExplode() })
            this.livetimeAfterDead-=1
            if (this.livetimeAfterDead==0) {
                this.state = NoteState.DEAD
            }

        }
        else if (state == NoteState.MISS) {
            ctx.beginPath();
            ctx.fillStyle = "red";
            //ctx.arc(this.x, this.y, 12, 0, Math.PI * 2, false);
            drawCircle(this.x,this.y,12)
            ctx.fill();
            ctx.restore();
            if (this.y < 0) {
                this.state = NoteState.DEAD                
            }


            // lerp to red/orange
            // add orange trial
        }

        //        ctx.globalAlpha = 1

    }
}
