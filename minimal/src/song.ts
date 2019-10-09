import {Howl, Howler} from 'howler';
import {SongData} from './data/lib'
import { maxNotes, dt } from './config';
export class Song
{
    t_max:number;
    t_min:number;
    sound: Howl;
    duration: number;
    t_cur: any;
    f_onset: any;
    visibleIdx: number [];
    e: number [];
    t_onset: number [];
    max_freq: number
    e_cur:number;


    constructor(data:SongData)
    {
        this.sound =new Howl({
            src: ['../music/' + data.name]
          });
        //this.sound.volume(0)
        this.sound.play()
        this.duration = this.sound.duration()
        this.t_cur = this.sound.seek()
        
        var max = Math.max(...data.f_onset)
        this.f_onset = data.f_onset.map(x => {return Math.round(x/max * (maxNotes-1))})
        this.t_onset = data.t_onset
        this.e = data.e
        this.e_cur = data.e[0]
        this.visibleIdx  = []
            
    }
    update(speed:any)
    {
        this.duration = this.sound.duration()
        this.t_cur = this.sound.seek()
        var delta = 2/(speed * dt +1)
        console.log(dt)
        this.t_max = this.t_cur +delta // speed code
        this.t_min = this.t_cur - .5*delta // speed code
        this.e_cur = this.e[Math.round(this.t_cur/this.duration * this.e.length)]
        //console.log(this.e_cur)
        this.visibleIdx= []
        //var e_idx =  parseInt(this.t_cur/this.duration * this.e.length)

        for (let i = 0; i < this.t_onset.length; i++) {
        
            const time = this.t_onset[i];
            
            if (time > this.t_min && time < this.t_max) {
                this.visibleIdx.push(i)       
                
            }
        
        }

        // Get visible IDX
        
    }
}