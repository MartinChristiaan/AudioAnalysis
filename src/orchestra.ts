import { Onset } from "./types/types"
import { map2, argWhere } from "./util/funUtil"
import { IMisses, ControlBus, FeedbackBus, IFalsePositives } from "./bus"
import { Circumstances } from "./noteViz/interfaces"
import { fromEvent, Observable, merge } from "rxjs"
import { map, withLatestFrom, filter, scan } from "rxjs/operators"
import { keycodes } from "./config"

export interface INoteStarted {
    kind: "startPlay"
    noteIndex: number
} 
export interface INoteStopped {
    kind: "stopPlay"
    noteIndex: number
}
export interface ISongtime {
    kind: "timeUpdate"
    circumstances : Circumstances
}
export interface ISongChanged {
    kind: "songChange"
    onsets : Onset[]
}

type InstrumentMessage = ISongtime | INoteStarted | INoteStopped | ISongChanged

export class OrchestraState
{
    onsets : Onset[]
    instrumentNoteStates : InstrumentNoteState[]
    noteStates : NoteState[]
     
    constructor(ins,ns,onsets) {
        this.instrumentNoteStates = ins
        this.noteStates = ns    
        this.onsets = onsets
    }
}

export class InstrumentNoteState
{
    isActive =false
    energy =0
    releasedEnergy = 0   
}

function handleSongChange(state : OrchestraState,msg : ISongChanged)
{
    return new OrchestraState(state.instrumentNoteStates,
        new Array(msg.onsets.length).fill(0).map(x => NoteState.UNBORN),msg.onsets);
}


export function isBorn(note: Onset,noteState:NoteState, currentTime, margin) {
    if (noteState == NoteState.UNBORN) {
        
        let lowerBoundTime = currentTime - margin/2; // speed code
        let upperBoundTime = currentTime + margin; // speed code
        if (note.time > lowerBoundTime && note.time < upperBoundTime) {
            return true

        }
        else {
            return false
        }            
    }
    return false
}

export function getNewNoteState(onset:Onset,state,{circumstances} : ISongtime)
{
    if (circumstances.currentTime - onset.time > 2)
    {
        return NoteState.DEAD
    }
    if(isBorn(onset,state,circumstances.currentTime,2)) 
    {   
        return NoteState.ALIVE
    }
    return state
}
export enum NoteState {
    UNBORN,
    ALIVE,
    HIT,
    MISS,
    DEAD
}


export function getOnsetFrequencyIndex(onset,numNotes)
{
    return Math.round(onset.frequency / 11.0 * (numNotes-1))
}
function isInHittableWindow(time,songtime,hitMargin)
{
    return Math.abs(songtime-time) < hitMargin
}

function isBeyondHittableWindow(time,songtime,hitMargin)
{
    return songtime-time > hitMargin
}

export class Hit
{
    hitNoteIndex:number
    hitFrequencyIdx : number
}

export function getHitNotes(onsets:Onset[],noteStates:NoteState[],instrumentNoteStates : InstrumentNoteState[],songTime:number,numNotes : number) : Hit[]
{   

    let hitInstrumentNotes = argWhere(instrumentNoteStates,(state : InstrumentNoteState) => state.isActive) 
    let hits = []

    onsets.forEach((onset,noteIdx) => {
        //
         if (noteStates[noteIdx] == NoteState.ALIVE && isInHittableWindow(onset.time,songTime,0.1)) {
            let frequencyIdx =getOnsetFrequencyIndex(onset,numNotes)
            if (hitInstrumentNotes.includes(frequencyIdx)){//) {
                hits.push({hitNoteIndex:noteIdx,hitFrequencyIdx:frequencyIdx})
            }         
        }
    });

    return hits
}

function getMissedNotes(onsets:Onset[],noteStates:NoteState[],songTime:number,numNotes : number)
{
    
    let missedNotes: number[] = []
    onsets.forEach((onset,noteIdx) => {
        //noteStates[noteIdx] == NoteState.ALIVE &&
         if ( noteStates[noteIdx] == NoteState.ALIVE && isBeyondHittableWindow(onset.time,songTime,0.1)) {
            missedNotes.push(noteIdx)                     
        }
    });
    return missedNotes
}

function updateInstrumentsForHit(instrumentNoteStates : InstrumentNoteState[],hits : Hit[] )
{
    let hitFreqsIdxs = hits.map(hit=> hit.hitFrequencyIdx) 
    return instrumentNoteStates.map((state,idx) => {
        if(state.isActive && hitFreqsIdxs.includes(idx)){
            state.energy+=10
        }
        return state
               
    })
}

function handleTimeUpdate(state : OrchestraState,msg : ISongtime)
{

    let circumstances = msg.circumstances
    let newNoteStateFun = (onset,state) => getNewNoteState(onset,state,msg)
    let agedNoteStates = map2(state.onsets,state.noteStates,newNoteStateFun)
    let missedNotes = getMissedNotes(state.onsets,agedNoteStates,circumstances.currentTime,circumstances.numNotes) // refactor to state / circ
    let hits = getHitNotes(state.onsets,state.noteStates,state.instrumentNoteStates
        ,circumstances.currentTime,circumstances.numNotes)                

    let hitUpdatedInstrumentStates = updateInstrumentsForHit(state.instrumentNoteStates,hits)
    let hitNotes = hits.map(hit => hit.hitNoteIndex)
    let hitmissUpdatedNoteStates = agedNoteStates.map((notestate,idx) => {
       if (hitNotes.includes(idx)) {
           return NoteState.HIT
       }
       else if(missedNotes.includes(idx))
       {
        
           return NoteState.MISS
       }
       else
       {
           return notestate
       }
    })

    let newInstrumentNoteStates = hitUpdatedInstrumentStates.map((instrumentNote, idx) => {
        if (instrumentNote.isActive) {
            return{energy:instrumentNote.energy-1,isActive:true,releasedEnergy:0}
        }
        return instrumentNote
    })       
    return new OrchestraState(newInstrumentNoteStates,hitmissUpdatedNoteStates,state.onsets)

}



function OrchestraStateChange(state:OrchestraState, msg: InstrumentMessage) {
    if (msg.kind == "songChange") {return handleSongChange(state,msg)}

    else if (msg.kind == "timeUpdate") {return handleTimeUpdate(state,msg)}      
    
    else if (msg.kind == "startPlay")// keyboard hit
    {
        state.instrumentNoteStates[msg.noteIndex].energy += 10
        state.instrumentNoteStates[msg.noteIndex].isActive = true
        return state
    }
    else if (msg.kind == "stopPlay")
    {   
        let releasedEnergy = state.instrumentNoteStates[msg.noteIndex].energy
        state.instrumentNoteStates[msg.noteIndex].releasedEnergy = releasedEnergy
        state.instrumentNoteStates[msg.noteIndex].energy = 0
        state.instrumentNoteStates[msg.noteIndex].isActive = false
        return state
    }
}



export function setupOrchestra(controlbus:ControlBus,{screenShake$} : FeedbackBus)
         {
    let notesStarted$ : Observable<INoteStarted> = fromEvent(document, 'keydown').pipe(        
        map(event => (event as KeyboardEvent).key),
        withLatestFrom(controlbus.numNotes$),
        filter(([key, numNotes]) => keycodes[numNotes].includes(key)),
        map(([key, numNotes]) => keycodes[numNotes].indexOf(key)),
        map(inputIdx => { return { kind: "startPlay", noteIndex: inputIdx } }),
    )
    let notesStopped$ : Observable<INoteStopped> = fromEvent(document, 'keyup').pipe(        
        map(event => (event as KeyboardEvent).key),
        withLatestFrom(controlbus.numNotes$),
        filter(([key, numNotes]) => keycodes[numNotes].includes(key)),
        map(([key, numNotes]) => keycodes[numNotes].indexOf(key)),
        map(inputIdx => { return { kind: "stopPlay", noteIndex: inputIdx } }),
    )

    
    let timePassed$: Observable<ISongtime> = controlbus.circumstances$.pipe(
        map((circumstances) => { return { kind: "timeUpdate",circumstances:circumstances } })
    )
    let songChanged$: Observable<ISongChanged> = controlbus.songAnalysis$.pipe(
        map(analyis => {return{kind: "songChange",onsets:analyis.onsets}})
    )
     
    merge(notesStarted$, timePassed$,songChanged$,notesStopped$).pipe(
        scan((state,msg) => OrchestraStateChange(state,msg),
        new OrchestraState(new Array(12).fill(0).map(x=> new InstrumentNoteState()),[],[]))
    ).subscribe(x => controlbus.orchestraState$.next(x))
}


