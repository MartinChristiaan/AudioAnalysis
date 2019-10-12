import { dt } from "./config"
import { Song } from "./song"
import { SongData } from "./data/lib";


// has gears
// song -> gear -> beats

export class GearBox
{
    private gears : Gear[]
    public curGear: Gear;
    constructor(song:SongData)
    {
        // reward player for using different gears
        const gear1 = {numNotes : 4,downSample : 1,speed : 1} // beginner
        const gear2 = {numNotes : 2,downSample : 1,speed : 2} // fast less complex
        const gear3 = {numNotes : 4,downSample : 2,speed : 2}
        this.gears = [gear1,gear2,gear3].map(x =>{ return new Gear(x,song)})
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
  
    visibleIdx : number[] = []// any

    t_max =  0 //any
    t_min =  0//number

    score_mult : number
    
    constructor({numNotes,downSample,speed},{f_onset,t_onset})
    {
        
        this.numNotes = numNotes    
        this.downSample = downSample
        this.visibleIdx = []
        this.score_mult = numNotes * speed
    }



}

