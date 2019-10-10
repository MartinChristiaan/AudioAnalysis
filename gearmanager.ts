import { dt } from "./config"
import { Song } from "./song"


// has gears
// song -> gear -> beats


class GearData
{
    numNotes : number
    downSample : number
    speed : number
}

export class GearBox
{
    gears : GearData[]
    curIdx: number
    constructor(song:Song)
    {
        // reward player for using different gears
        const gear1 = {numNotes : 4,downSample : 1,speed : 1} // beginner
        const gear2 = {numNotes : 2,downSample : 1,speed : 2} // fast less complex
        const gear3 = {numNotes : 4,downSample : 2,speed : 1} // for beats
        const gear4 = {numNotes : 6,downSample : 1,speed : 1} // more notes

        this.gears = [gear1,gear2,gear3,gear4].map(x =>{ return new Gear(x,song)})
        this.curIdx = 0 
    }
    shiftGear(gearIdx)
    {
        // smoothly transition to new speed somehow? might look weird

    }
    getGear()
    {
        return this.gears[this.curIdx]
    }
}


export class Gear
{
    numNotes : number
    downSample : number
    speed : number    
    gearData : GearData
    f_onset = []
    t_onset =  []
    delta: number
    visibleIdx: []// any
    t_max =  0 //any
    t_min =  0//number
    score_mult : number
    
    constructor({numNotes,downSample,speed},{f_onset,t_onset})
    {
        this.gearData = {numNotes : numNotes,downSample : downSample,speed : speed}    
        
        let maxFreq = Math.max(f_onset)
        for (let idx = 0; idx < f_onset.length; idx+=downSample) {
            this.t_onset.push(t_onset[idx]);
            this.f_onset.push(f_onset[idx])/maxFreq * numNotes;
        }
        this.delta = 2/(speed * dt +1)
        this.visibleIdx = []
        this.score_mult = numNotes * speed
    }
    update({t_cur}:Song)
    {
        this.t_max = t_cur +this.delta // speed code
        this.t_min = t_cur - .5*this.delta // speed code
        for (let i = 0; i < this.t_onset.length; i++) {
        
            const time = this.t_onset[i];
            
            if (time > this.t_min && time < this.t_max) {
                this.visibleIdx.push(i)       
                
            }
        
        }

    }
    


}

