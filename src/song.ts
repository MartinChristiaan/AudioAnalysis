import {Howl, Howler} from 'howler';
import {SongData} from './data/lib'
import { dt } from './config';
export class Song
{
    t_max:number;
    t_min:number;
    sound: Howl;
    duration: number = 300;
    t_cur: number = 0;
    visibleIdx: number [] = [];
    e: number [];
    max_freq: number
    e_cur=0;
    delta = 0
    f_onset:number[] = []
    t_onset:number[] =  []
    maxFreq:number = 11
    buildupOnsets : number[]

    constructor(data:SongData)
    {
        this.sound =new Howl({
            src: ['../music/' + data.name]
          });
        //this.sound.volume(0)
        this.sound.play()
        this.duration = this.sound.duration()
        this.buildupOnsets = data.buildupOnsets


        // var max = Math.max(...data.f_onset)
        this.f_onset = data.f_onset//.map(x => {return Math.round(x/max * (maxNotes-1))})
        this.t_onset = data.t_onset
        this.e = data.e
        // this.e_cur = data.e[0]
        // this.visibleIdx  = []
            
    }
    update(speed:any)
    {
        this.duration = this.sound.duration()
        try {this.t_cur = this.sound.seek() as number} catch (error) {}
        this.e_cur = this.e[Math.round(this.t_cur/this.duration * this.e.length)]
        this.delta = 2/(speed * dt +1)

        this.t_max = this.t_cur +this.delta // speed code
        this.t_min = this.t_cur - .5*this.delta // speed code
        this.visibleIdx = []
        for (let i = 0; i < this.t_onset.length; i++) {
            const time = this.t_onset[i];
            if (time > this.t_min && time < this.t_max) {
                this.visibleIdx.push(i)     
            }
        }
        
        //console.log(this.e_cur)
        //var e_idx =  parseInt(this.t_cur/this.duration * this.e.length)

       

        // Get visible IDX
        
    }
}