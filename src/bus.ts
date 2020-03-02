import { Subject,BehaviorSubject,zip ,combineLatest} from "rxjs";
import { NoteState, InstrumentNoteState } from "./hitDetection";
import { Onset, SongAnalysisData } from "./types/types";
import {map, withLatestFrom, tap} from "rxjs/operators"
import { Circumstances, V2 } from "./noteViz/interfaces";

// export class Feedback
// {
//     hitNotes: number[];
//     misses: number[];
//     falsePositives: number[];
//     playedFrequencies: number[];
//     hitFrequencies: number[];

//     constructor(hits:Hit[],misses:number[],falsePositives:number[],playedFrequencies:number[])
//     {
//         this.hitNotes = hits.map(x => x.hitNote)
//         this.misses=  misses
//         this.falsePositives = falsePositives
//         this.playedFrequencies = playedFrequencies
//         this.hitFrequencies = hits.map(x => x.hitFrequency)
    
//     }
// }

export class ControlBus{
    animation$ =new Subject<number>()

    songTime$= new Subject<number>()
    songPlayer$= new Subject<Howl>()
    songAnalysis$= new Subject<SongAnalysisData>()
    songTitle$ = new Subject<string>()
    onsets$ = new Subject<Onset[]>()
    noteStates$ = new Subject<NoteState[]>();
    instrumentNoteStates$ = new Subject<InstrumentNoteState[]>();
    multiplier$ = new BehaviorSubject<number>(1);
    numNotes$= new BehaviorSubject<number>(4);
    circumstances$  = new BehaviorSubject<Circumstances>({margin:2,numNotes:4,currentTime:0,level:1})
    constructor()
    {

        this.songTime$.pipe(
            withLatestFrom(this.numNotes$,this.multiplier$),
            map(([currenttime,numnotes,multiplier]) => {
                return {margin:0.2,numNotes : numnotes,currentTime : currenttime,level : multiplier}
            })).subscribe(x => this.circumstances$.next(x))
        //this.songTime$.subscribe(x => console.log(x))
        this.onsets$.subscribe(console.log)
    }
}

class Hit {
    hitFrequency : number
    hitNote : number
} 
type noteIndex = number

export interface IHits
{
    kind: "hit"
    hitNotes : number[]
    hitFrequencies : number[]
}
export interface IMisses
{
    kind: "miss"
    missedNotes : number[]
}
export interface IFalsePositives
{
    kind: "falsePositive"
    falseFrequencies : number[]
}


export class FeedbackBus{
    misses$ = new Subject<IMisses>()
    hits$ = new Subject<IHits>()
    falsePositives$ = new Subject<IFalsePositives>()    
    screenShake$ = new BehaviorSubject<V2>({x:0,y:0})
    constructor(){
        
    }   
}