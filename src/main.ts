import {fromEvent,interval, merge, Subject} from "rxjs"
import {filter, map, withLatestFrom, tap, startWith, scan, pairwise} from "rxjs/operators"
import { SetupSongLoading } from "./loader";
import {setupNoteDrawing} from "./noteViz/main"
import { setupHitMissDetection} from "./hitDetection";
import { setupInstrumentDrawing } from "./instrumentDrawer";
import { sum } from "./util/funUtil";
import { animationFrame } from "rxjs/internal/scheduler/animationFrame";
import { setupScoreBoard } from "./scoreboard";
import { ControlBus, FeedbackBus } from "./bus";
import { setupScreenshake } from "./screenshake";
import { SetupUpdatingChart } from "./charts/charts";
import { createMenu } from "./menu/menu";
console.log("Starting")
console.time('Initialization');

export var canvas = document.querySelector('canvas')
canvas.height = innerHeight
canvas.width= document.getElementById("canvasdiv").clientWidth
export var ctx = canvas.getContext('2d')
ctx.globalCompositeOperation = "lighten"



let controlBus = new ControlBus()
let feedbackBus = new FeedbackBus()


// controlBus.animation$.subscribe(console.log)
interval(0,animationFrame).subscribe(x => controlBus.animation$.next(x))

// SetupUpdatingChart(controlBus,controlBus.songAnalysis$.pipe(map(x => x.energies)),"EnergyChart")
// SetupUpdatingChart(controlBus,controlBus.songAnalysis$.pipe(map(x => x.similarity)),"SimilarityChart")



SetupSongLoading(controlBus)
controlBus.animation$.pipe(
    tap(() => ctx.clearRect(0,0,canvas.width,canvas.height)), //always perform this first
    withLatestFrom(controlBus.songPlayer$),
    map(([,sound]) => sound.seek() as number)
).subscribe(x => controlBus.songTime$.next(x))


fromEvent(document,'keydown').pipe(
    map(event => (event as KeyboardEvent).key),
    filter(key =>  key == "Shift" || key == "Control"),
    map(key =>{
        if (key == "Shift") {
            return 1
        }
        else{
            return -1
        }
    }),
    scan(sum,4),
    startWith(4)  
).subscribe(x => controlBus.numNotes$.next(x))

setupScoreBoard(controlBus,feedbackBus)

setupInstrumentDrawing(controlBus,feedbackBus) 
setupHitMissDetection(controlBus,feedbackBus)
setupNoteDrawing(controlBus,feedbackBus)
setupScreenshake(controlBus,feedbackBus)


// merge(hideControl$,controlBus.songPlayer$).subscribe(() =>{
//     document.getElementById("control").style.width = "0%" 
//     document.getElementById("control").style.padding = "0px"
    
//     document.getElementById("canvasdiv").style.width = "100%"    
//     canvas.width= document.getElementById("canvasdiv").clientWidth
// })

window.onresize= () =>{
    canvas.width= document.getElementById("canvasdiv").clientWidth
    canvas.height = innerHeight
    console.log("resize")
}



// event with timers






