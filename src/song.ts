import {Howl, Howler} from 'howler';
import {SongData} from './loader'
import { dt, windowTimes } from './config';

class Onset
{
    onsetTime:number
    onsetFrequency:number
    isBuildup:boolean
}

class TimeWindow // can also be used for charts
{
    t_max:number;
    t_min:number;
    t_cur: number = 0;
    delta_low : 0
    deltta_high : 0
    constructor()
    {
        
    }

    UpdateWindow()
    {

    }   

    GetItemsInWindow()
    {

    }
}


export class Song
{
    tw : TimeWindow    
    sound: Howl;
    duration: number = 300;
    visibleNotes: Onset [] = [];
    e: number [];
    max_freq: number
    e_cur=0;
    delta = 0
    onsets : Onset[]
    maxFreq:number = 11
    e_idx = 0;
    buildupEnergies: number[];

    constructor(data:SongData)
    {
        this.sound =new Howl({
            src: ['../music/' + data.name]
          });
        //this.sound.volume(0)
        this.sound.play()
        this.sound.seek(30)
        this.duration = this.sound.duration()
        this.buildupEnergies = data.buildupEnergies
        this.onsets = Array.from({length: 10}, (_, id) =>  
            {
                let onset = {
                    onsetTime:data.t_onset[id],
                    onsetFrequency:data.f_onset[id],
                    isBuildup : data.buildupOnsets.includes(id)
                        } 
                return onset
            })
        this.e = data.e
        this.tw = {t_max:2,t_min:0,t_cur:0}
            
    }
    update()
    {
        this.duration = this.sound.duration()
        let t_cur = 0
        try {t_cur = this.sound.seek() as number} catch (error) {}

        this.e_idx = Math.round(t_cur/this.duration * this.e.length)
        this.e_cur = this.e[this.e_idx]

        let t_max = t_cur + windowTimes // speed code
        let t_min = t_cur - windowTimes  // speed code

        this.tw = {t_max:t_max,t_min:t_min,t_cur:t_cur}


        this.visibleNotes = []

        for (let i = 0; i < this.onsets.length; i++) {
            const time = this.onsets[i].onsetTime;
            if (time > t_min && time < t_max) {
                this.visibleNotes.push(this.onsets[i])     
            }
        }
        
        //console.log(this.e_cur)
        //var e_idx =  parseInt(this.t_cur/this.duration * this.e.length)

       

        // Get visible IDX
        
    }
}