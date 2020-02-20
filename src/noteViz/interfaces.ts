import { Onset } from "../types/types";
import { IHits, IMisses } from "../bus";
import { LeadParticle } from "./state";


export type INoteMessage = IHits | ISongtime | ISongChange | IDataUpdate | INoteDeaths | IMisses

export interface ISongtime {
    kind: "timeUpdate";
    onsets: Onset[];
    songTime: number;
}

export class Circumstances{
    margin : number
    numNotes : number
    currentTime :number
    level : number
}


export interface ISongChange {
    kind: "songChange"
    numNotes: number
}
export interface IDataUpdate {
    kind: "dataUpdate"
    numNotes: number
}

export interface INoteDeaths {
    kind: "noteDeaths"
    deaths: number[]
}

export class V2 {
    x: number
    y: number
}

export interface IArcDrawable
{
    position : V2
    size : number
    onset : Onset
}

export class Particle 
{
    velocity : V2
    position : V2
    onset:Onset
    alpha = 1
    size = 12
    constructor(x,y,vx,vy,alpha,size,onset)
    {
        this.position = {x:x,y:y}
        this.velocity = {x:vx,y:vy}
        this.alpha = alpha
        this.size = size
        this.onset = onset
    }

}

