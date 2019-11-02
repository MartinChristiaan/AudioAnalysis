
import {  keycodes, margin } from "./config";
import { fromEvent, Observable,merge, combineLatest, zip, Operator, ConnectableObservable, Subject, interval } from "rxjs";
import { map, filter, startWith, scan, pairwise, mapTo, switchMap, delay, publish, tap, withLatestFrom, throttle, throttleTime } from "rxjs/operators";
import { Onset } from "./types/types";
import { map2, argWhere } from "./util/funUtil";
import { ControlBus, FeedbackBus, IHits, IMisses } from "./bus";

export enum NoteState {
    UNBORN,
    ALIVE,
    HIT,
    MISS,
    DEAD
}

export enum InstrumentNoteState{
    IDLE,FIRED,FALSEPOSITIVE

}

function getOnsetFrequencyIndex(onset,numNotes)
{
    return Math.round(onset.frequency / 11.0 * (numNotes-1))
}
function isInHittableWindow(time,songtime,margin)
{
    return Math.abs(songtime-time) < margin
}

function isBeyondHittableWindow(time,songtime,margin)
{
    return songtime-time > margin
}



function getHitNotes(onsets:Onset[],noteStates:NoteState[],instrumentNoteStates : InstrumentNoteState[],songTime:number,numNotes : number) : IHits
{
    
    let hitInstrumentNotes = argWhere(instrumentNoteStates,(state) => state == InstrumentNoteState.FIRED) 
    let hitNotes: number[] = []
    let hitFrequencies: number[] = []
    onsets.forEach((onset,noteIdx) => {
        //
         if (noteStates[noteIdx] == NoteState.ALIVE && isInHittableWindow(onset.time,songTime,0.1)) {
            
            let frequencyIdx =getOnsetFrequencyIndex(onset,numNotes)
            if (hitInstrumentNotes.includes(frequencyIdx)){//) {
                hitNotes.push(noteIdx)
                hitFrequencies.push(frequencyIdx)
                console.log("Sending hit message : " + noteIdx )

            }         
        }
    });
    return {kind: "hit",hitNotes : hitNotes,hitFrequencies : hitFrequencies} 
}

function getMissedNotes(onsets:Onset[],noteStates:NoteState[],instrumentNoteStates : InstrumentNoteState[],songTime:number,numNotes : number) : IMisses
{
    
    let hitInstrumentNotes = argWhere(instrumentNoteStates,(state) => state == InstrumentNoteState.FIRED) 
    let missedNotes: number[] = []
    onsets.forEach((onset,noteIdx) => {
        //noteStates[noteIdx] == NoteState.ALIVE &&
         if ( noteStates[noteIdx] == NoteState.ALIVE && isBeyondHittableWindow(onset.time,songTime,0.1)) {
            let frequencyIdx =getOnsetFrequencyIndex(onset,numNotes)
            if (hitInstrumentNotes.includes(frequencyIdx)){//) {
                missedNotes.push(noteIdx)

            }         
        }
    });
    return {kind: "miss",missedNotes : missedNotes} 
}



export function setupHitMissDetection({instrumentNoteStates$,noteStates$,numNotes$,onsets$,songTime$} : ControlBus,{hits$,misses$} : FeedbackBus){
        songTime$.pipe(
        withLatestFrom(instrumentNoteStates$,noteStates$,onsets$,numNotes$),
        map(([t,ins,ns,onsets,numNotes]) => getHitNotes(onsets,ns,ins,t,numNotes)),
        filter((x:IHits) => x.hitNotes.length > 0)
        //tap(() => console.log("Hit at " + new Date().getSeconds()))
    ).subscribe((x) => hits$.next(x))                      

    // songTime$.pipe(
    //     withLatestFrom(instrumentNoteStates$,noteStates$,onsets$,numNotes$),
    //     map(([t,ins,ns,onsets,numNotes]) => getMissedNotes(onsets,ns,ins,t,numNotes)),
    //     filter((x:IMisses) => x.missedNotes.length > 0) ,
    //     //tap(() => console.log("Hit at " + new Date().getSeconds()))
    // ).subscribe((x) => misses$.next(x))                      

    }
