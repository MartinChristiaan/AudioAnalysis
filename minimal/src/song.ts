import {Howl, Howler} from 'howler';
import {SongData} from './data/lib'
export class Song
{
    t_max:number;
    t_min:number;
    sound: Howl;
    duration: any;
    t_cur: any;
    f_onset: any;
    visibleIdx: number [];
    e: number [];
    t_onset: number [];
    max_freq: number ;
    constructor(data:SongData)
    {
        this.sound =new Howl({
            src: ['../music/' + data.name]
          });
        this.sound.play()
        this.duration = this.sound.duration()
        this.t_cur = this.sound.seek()
        
        var max = Math.max(...data.f_onset))
          

        this.f_onset = 
        this.t_onset = data.t_onset
        this.e = data.e
        this.visibleIdx  = []
        this.max_freq = 3
            
    }
    update(speed:any)
    {
        this.t_cur = this.sound.seek()
        var delta = 2/(speed+1)
        this.t_max = this.t_cur +delta // speed code
        this.t_min = this.t_cur - .5*delta // speed code
        
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