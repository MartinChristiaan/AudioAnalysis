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
    visibleIdx: number [];
    e: number [];
    max_freq: number
    e_cur=0;
    delta = 0

    constructor(data:SongData)
    {
        this.sound =new Howl({
            src: ['../music/' + data.name]
          });
        //this.sound.volume(0)
        this.sound.play()
        this.duration = this.sound.duration()
        


        // var max = Math.max(...data.f_onset)
        // this.f_onset = data.f_onset.map(x => {return Math.round(x/max * (maxNotes-1))})
        // this.t_onset = data.t_onset
        // this.e = data.e
        // this.e_cur = data.e[0]
        // this.visibleIdx  = []
            
    }
    update(speed:any)
    {
        this.duration = this.sound.duration()
        try {this.t_cur = this.sound.seek() as number} catch (error) {}
        this.e_cur = this.e[Math.round(this.t_cur/this.duration * this.e.length)]
        this.delta = 2/(speed * dt +1)

        //console.log(this.e_cur)
        //var e_idx =  parseInt(this.t_cur/this.duration * this.e.length)

       

        // Get visible IDX
        
    }
}