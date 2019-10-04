import Howl from './howler.js'

class Song
{
    t_max
    t_min
    sound: any;
    duration: any;
    t_cur: any;
    f_onset: any;
    visibleIdx: [];
    e: any;
    t_onset: any;
    max_freq: number;
    constructor(src,t_onset,f_onset,e)
    {
        this.sound = new Howl({src: [src]});
        this.duration = this.sound.duration()
        this.t_cur = this.sound.seek()
        this.f_onset = f_onset
        this.t_onset = t_onset
        this.e = e
        this.visibleIdx : Array = []
        this.max_freq = 3
            
    }
    update(speed)
    {
        this.t_cur = this.sound.seek()
        var delta = 2/(speed+1)
        this.t_max = this.t_cur +delta // speed code
        this.t_min = this.t_cur - .5*delta // speed code
        
        this.visibleIdx= []
        var e_idx =  parseInt(this.t_cur/this.duration * this.e.length)

        for (let i = 0; i < this.t_onset.length; i++) {
        
            const time = this.t_onset[i];
            
            if (time > this.t_min && time < this.t_max) {
                this.visibleIdx.push(i)       
              
            }
        
        }

        // Get visible IDX
        
    }
}