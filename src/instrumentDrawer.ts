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

function roundRect(ctx, x, y, width, height, radius) {
   
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();

    ctx.fill();
    // if (stroke) {
    //   ctx.stroke();
    // }
  
  }


function drawInstrumentNote(noteIndex, numNotes, instrumentNoteState: InstrumentNoteState, level,screenShake:V2) {
    var x_start = (noteIndex) / (numNotes) * canvas.width
    var x_stop = (noteIndex + 1) / (numNotes) * canvas.width
 
    //console.log(x_stop)
    ctx.beginPath();
    //
    ctx.lineWidth = 10;
    let notecolor = ""
    if (instrumentNoteState == InstrumentNoteState.FIRED) {
        //ctx.filter = 'blur(2px)'
        notecolor = "white"
  //      ctx.strokeStyle = "white"
    }
    else if (instrumentNoteState == InstrumentNoteState.FALSEPOSITIVE) {
        notecolor = "red"
//        ctx.strokeStyle = "red"
    }
    else {
        ctx.filter = "none"
        notecolor = getNoteColor((noteIndex + 1) / numNotes, level)
    }
    ctx.strokeStyle = notecolor
    ctx.moveTo(x_start + screenShake.x, y + screenShake.y)
    ctx.lineTo(x_stop + screenShake.x, y + screenShake.y)
    ctx.stroke();
    ctx.restore()

    let tootlipsize = 50
    ctx.fillStyle = notecolor
    roundRect(ctx,x_start - tootlipsize/2 + 0.5 / numNotes * canvas.width, y + 50,tootlipsize,tootlipsize,5)
    ctx.restore()
    ctx.fillStyle = "white"
    ctx.font = '20px Arial';//
    ctx.fillText(keycodes[numNotes][noteIndex],x_start  + 0.5 / numNotes * canvas.width - 5,y+81)
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





