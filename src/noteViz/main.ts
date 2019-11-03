import { Onset } from "../types/types";
import { Observable, merge, Subject, ConnectableObservable, zip, combineLatest } from "rxjs";
import { map, withLatestFrom, scan, publish, tap } from "rxjs/operators";
import { argWhere } from "../util/funUtil";
import { NoteState } from "../hitDetection";
import { INoteMessage, Particle, Circumstances } from "./interfaces";
import { updateNoteState, createNoteMessageBasedOnSongtime, getLeadParticles, LeadParticle } from "./state";
import { updateExplosionParticles } from "./explosionState";
import { drawParticle } from "./draw";
import { createAliveParticle, createMissedParticle, getFill, getMissedFill, getExplosionFill, getTrailFill } from "./dynamics";
import { ControlBus, FeedbackBus } from "../bus";



function bufferPrevious(previousParticles : Particle[][][],particles : Particle[][]){
    let newPP = previousParticles.map(arrarr=> arrarr.map(arr=> arr.map(particle => particle)))
    newPP.push(particles)
    if (newPP.length>5) {
        newPP.shift()
    }
    return newPP
}




export function setupNoteDrawing(bus:ControlBus,feedbackBus : FeedbackBus) {

    let songTimedOnsets$: Observable<INoteMessage> = bus.songTime$.pipe(
        withLatestFrom(bus.onsets$),
        map(createNoteMessageBasedOnSongtime)
    )
    let deaths$ = new Subject<INoteMessage>()
    
    merge(songTimedOnsets$, feedbackBus.hits$,feedbackBus.misses$, deaths$).pipe(
        scan(updateNoteState, new Array(1).fill(0).map(() => NoteState.UNBORN))
    ).subscribe(x => {bus.noteStates$.next(x)
    })

    let explodedParticles$ = bus.songTime$.pipe(
        withLatestFrom(bus.noteStates$, bus.onsets$, bus.numNotes$,bus.multiplier$),
        scan(updateExplosionParticles, []),
        map(x => [x])
        )
        //scan(bufferPrevious,[]))

    // let leadParticles$ = new Subject<LeadParticle[]>()

    // combineLatest(bus.circumstances$,bus.onsets$).pipe(
    //     map(([circ,onsets]) => getLeadParticles(onsets,circ,0.4)
    //     )
    // ).subscribe(x => leadParticles$.next(x))

    let regularParticles$ = bus.circumstances$.pipe(
        
        withLatestFrom(bus.onsets$,  bus.noteStates$),
        map(([circumstances, onsets,  states ]) => {
            let aliveIdx = argWhere(states, (x) => x == NoteState.ALIVE)
            // let aliveLeaders = leaders.filter((leader) => aliveIdx.includes(leader.index))
            return aliveIdx.map((idx) => { return createAliveParticle(onsets[idx],circumstances) })
        }),
    )

    let missedParticles$ = bus.circumstances$.pipe(
        withLatestFrom(bus.onsets$, bus.noteStates$),
        map(([circumstances, onsets,  states]) => {
    
            let missedIdx = argWhere(states, (x) => x == NoteState.MISS)
            // let missedLeaders = leaders.filter((leader) => missedIdx.includes(leader.index))         
            return missedIdx.map((idx) => { return createMissedParticle(onsets[idx], circumstances) })
        })
    )
    explodedParticles$.pipe(withLatestFrom(bus.circumstances$,feedbackBus.screenShake$))
    .subscribe(([arrrarrarr,Circumstances,ss]) => arrrarrarr.forEach(
        arrarr => {
        arrarr.forEach((arr,idx) => { arr.forEach(p => drawParticle(p,getExplosionFill(p,Circumstances,p.alpha),ss))})}))

    merge(regularParticles$).pipe(withLatestFrom(bus.circumstances$,feedbackBus.screenShake$))
    .subscribe(([drawables,Circumstances,ss]) => drawables.forEach( (x) => drawParticle(x,getFill(x,Circumstances,1),ss))
   
    )

    merge(missedParticles$).pipe(withLatestFrom(bus.circumstances$,feedbackBus.screenShake$))
    .subscribe(([drawables,Circumstances,ss]) => drawables.forEach( (x) => drawParticle(x,getMissedFill(x),ss))
   
    )


}
