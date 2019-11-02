import { canvas, ctx } from "./main";
import { getNoteColor } from "./colors";
import { combineLatest, Observable, fromEvent, zip, merge, Subject, timer, ConnectableObservable } from "rxjs";
import { map, filter, scan, tap, withLatestFrom, publish, observeOn, delay } from "rxjs/operators";
import { InstrumentNoteState } from "./hitDetection";
import { keycodes } from "./config";
import { isNoSubstitutionTemplateLiteral } from "typescript";
import { argWhere } from "./util/funUtil";
import { FeedbackBus, ControlBus, IFalsePositives, IHits } from "./bus";
import { animationFrame } from "rxjs/internal/scheduler/animationFrame";
import { V2 } from "./noteViz/interfaces";
let y = (2 / 3) * innerHeight

function drawInstrumentNote(noteIndex, numNotes, instrumentNoteState: InstrumentNoteState, level,screenShake:V2) {
    var x_start = (noteIndex) / (numNotes) * canvas.width
    var x_stop = (noteIndex + 1) / (numNotes) * canvas.width
 
    //console.log(x_stop)
    ctx.beginPath();
    //
    ctx.lineWidth = 10;
    if (instrumentNoteState == InstrumentNoteState.FIRED) {
        //ctx.filter = 'blur(2px)'
        ctx.strokeStyle = "white"
    }
    else if (instrumentNoteState == InstrumentNoteState.FALSEPOSITIVE) {
        ctx.strokeStyle = "red"
    }
    else {
        ctx.filter = "none"
        ctx.strokeStyle = getNoteColor((noteIndex + 1) / numNotes, level)
    }
    ctx.moveTo(x_start + screenShake.x, y + screenShake.y)
    ctx.lineTo(x_stop + screenShake.x, y + screenShake.y)
    ctx.stroke();
    ctx.restore()

}

class InstrumentTimerState
{
    hitTimer : number 
    hitsInWindow : boolean
    constructor(hitTimer,hitsInWindow){
         this.hitTimer = hitTimer
         this.hitsInWindow = hitsInWindow
    }     
}


function updateInstrumentNoteState(timers:InstrumentTimerState[], msg: InstrumentMessage) {
   
    if (msg.kind == "timeUpdate") { // simple time update
        return timers.map((x, idx) => {
            if (x.hitTimer > 0) {
                // did my time expire
                if (x.hitTimer == 1) {
                    return {hitsInWindow:false,hitTimer:x.hitsInWindow?0:-5}
                   
                }
                return{hitsInWindow:x.hitsInWindow,hitTimer:x.hitTimer-1}
            }

            else if (x.hitTimer < 0) {
                if (x.hitTimer ==  -1) {
                    // report false positive
                    
                }
                return {hitTimer: x.hitTimer + 1,hitsInWindow:x.hitsInWindow}
            }
            else {
                return x
            }
        })
        

    }
    else if (msg.kind == "played")// keyboard hit
    {
        timers[msg.notePlayed].hitTimer = 5
        timers[msg.notePlayed].hitsInWindow = false
        
        return timers
    }
    else if (msg.kind = "hit") {
        msg.hitFrequencies.forEach(idx => {
            timers[idx].hitsInWindow = true
        })
        return timers

    }
}


interface INotePlayed {
    kind: "played"
    notePlayed: number
}
interface ISongtime {
    kind: "timeUpdate"

}

type InstrumentMessage = IHits | ISongtime | INotePlayed


export function setupInstrumentDrawing(controlbus:ControlBus,{falsePositives$,hits$,screenShake$} : FeedbackBus)
         {
    let notesPlayed$ = fromEvent(document, 'keydown').pipe(
        
        map(event => (event as KeyboardEvent).key),
        withLatestFrom(controlbus.numNotes$),
        filter(([key, numNotes]) => keycodes[numNotes].includes(key)),
        map(([key, numNotes]) => keycodes[numNotes].indexOf(key)),
        map(inputIdx => { return { kind: "played", notePlayed: inputIdx } }),
        
        
    )

    let timePassed$: Observable<ISongtime> = controlbus.songTime$.pipe(
        map(() => { return { kind: "timeUpdate" } })
    )


    
        merge(notesPlayed$, timePassed$, hits$).pipe(
            scan(updateInstrumentNoteState, new Array(12).fill(0).map(x => {return{hitTimer:0,hitsInWindow:false}})), // starting all notes of instrument at idle
            map(states => states.map(timer => {
                let state = timer.hitTimer
                if (state == 0) { return InstrumentNoteState.IDLE }
                else if (state > 0) { return InstrumentNoteState.FIRED }
                else if (state < 0) { return InstrumentNoteState.FALSEPOSITIVE }
            }))
            
        ).subscribe(x => controlbus.instrumentNoteStates$.next(x))
    
        controlbus.instrumentNoteStates$.pipe(
            map(x => argWhere(x,y => y==InstrumentNoteState.FALSEPOSITIVE)),
            filter(x => x.length > 0),
            map(x => {return{kind:"falsePositive",falseFrequencies:x} as IFalsePositives})
        ).subscribe( x=>falsePositives$.next(x))

        controlbus.instrumentNoteStates$.pipe(
            
            withLatestFrom(controlbus.numNotes$,controlbus.multiplier$,screenShake$)).
            subscribe(([notePlayedState, numNotes,multiplier,screenShake]) =>{
               
                new Array(numNotes).fill(0).map((x,idx) => drawInstrumentNote(idx, numNotes, notePlayedState[idx], multiplier,screenShake))})

}





