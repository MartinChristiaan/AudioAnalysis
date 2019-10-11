import { dt } from "./config"
import { Song } from "./song"
import { SongData } from "./data/lib";


// has gears
// song -> gear -> beats


class GearData
{
    numNotes : number
    downSample : number
}

export class GearBox
{
    private gears : Gear[]
    public curGear: Gear;
    constructor(song:SongData)
    {
        // reward player for using different gears
        const gear1 = {numNotes : 4,downSample : 1,speed : 1} // beginner
        const gear2 = {numNotes : 2,downSample : 1,speed : 2} // fast less complex
        const gear3 = {numNotes : 4,downSample : 2,speed : 1} // for beats
        const gear4 = {numNotes : 6,downSample : 1,speed : 1} // more notes
        this.gears = [gear1,gear2,gear3,gear4].map(x =>{ return new Gear(x,song)})
        this.curGear = this.gears[0] 
    }
    shiftGear(idx)
    {
        
        this.curGear = this.gears[idx]
    }
}


export class Gear
{
    numNotes : number
    downSample : number
  
    f_onset:number[] = []
    t_onset:number[] =  []
    visibleIdx : number[] = []// any

    t_max =  0 //any
    t_min =  0//number

    score_mult : number
    
    constructor({numNotes,downSample,speed},{f_onset,t_onset})
    {
        
        this.numNotes = numNotes    
        this.downSample = downSample
        let maxFreq = Math.max(f_onset)
        for (let idx = 0; idx < f_onset.length; idx+=downSample) {
            this.t_onset.push(t_onset[idx]);
            this.f_onset.push(f_onset[idx])/maxFreq * numNotes;
        }
        this.visibleIdx = []
        this.score_mult = numNotes * speed
    }
    update({t_cur,delta}:Song)
    {
        this.t_max = t_cur +delta // speed code
        this.t_min = t_cur - .5*delta // speed code
        for (let i = 0; i < this.t_onset.length; i++) {
        
            const time = this.t_onset[i];
            
            if (time > this.t_min && time < this.t_max) {
                this.visibleIdx.push(i)     
                
            }
        
        }

    }
    


}

