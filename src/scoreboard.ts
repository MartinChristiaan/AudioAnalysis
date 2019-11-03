import { Observable, merge } from "rxjs"

import { scan, filter, pairwise, map, startWith, withLatestFrom, throttleTime } from "rxjs/operators"
import { percentInWindow } from "./util/funUtil"
import { ctx } from "./main"
import { rgba } from "./colors"
import { ControlBus, FeedbackBus, IHits, IMisses, IFalsePositives } from "./bus"
import { NoteState } from "./hitDetection"

class ScoreBoard {
    consecutiveHits: number
    multiplier: number
    score: number
    rating : number
}

type IScoreBoardMessage = IHits | IMisses | IFalsePositives

function frmt(num) {
    return Math.round((num + 0.0001) * 10) / 10;
}
function drawProgressBar(value: number, low: number, high: number
    , xpos: number, ypos
    , maxWidth, maxHeight
    , fontsize, imsrc: string
    , colorLow: rgba
    , colorHigh: rgba) {
    ctx.font = fontsize.toString() + "px Arial";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;


    //ctx.strokeText(low.toFixed(2), xpos - maxWidth/2, ypos);
    var percent = (value - low) / (high - low)
    if (isNaN(percent)) {
        percent = 0.01
    }
    var my_gradient = ctx.createLinearGradient(xpos - maxWidth / 2, 0, xpos + maxWidth / 2, 0);

    my_gradient.addColorStop(0, colorLow.getHTMLValue());
    my_gradient.addColorStop(1, colorHigh.getHTMLValue());

    ctx.fillStyle = my_gradient//
    ctx.fillRect(xpos - maxWidth / 2, ypos, maxWidth * percent, maxHeight)
    if (value == undefined) {
        value = low
    }
    try {
        ctx.strokeText(value.toFixed(2), xpos - maxWidth / 2, ypos + maxHeight - 4);
        ctx.strokeText(high.toFixed(2), xpos + maxWidth / 2 + 3, ypos + maxHeight - 4);
    } catch (error) { }
    const image = new Image(32, 32); // Using optional size for image
    image.src = imsrc
    ctx.drawImage(image, xpos - maxWidth / 2 - 40, ypos - 3, 32, 32)

}

function drawScoreBoard(scoreBoard: ScoreBoard, currentTime, deltaTime,duration) {


    ctx.lineWidth = 2;
    ctx.font = "20px Arial";
    ctx.strokeStyle = "white";

    drawProgressBar(currentTime
        , 0
        , duration
        , 150, 50, 200, 25, 20, '../data/images/optimization-clock.svg',
        new rgba(218, 34, 255), new rgba(151, 51, 238)
    )
   
    drawProgressBar(scoreBoard.consecutiveHits
        , (scoreBoard.multiplier - 1) * 10
        , scoreBoard.multiplier * 10
        , 150, 100, 200, 25, 20, '../data/images/icons/mult.svg',
        new rgba(238, 9, 121), new rgba(255, 106, 0))
    let {rating} = scoreBoard
    ctx.strokeText(scoreBoard.multiplier + "x", 100, 200);
    ctx.strokeText((1/deltaTime).toFixed(0) + "fps", 100, 250);
    ctx.strokeText(scoreBoard.rating.toFixed(1) + " rating", 100, 300);
    const image = new Image(32,32); // Using optional size for image
    image.src = '../data/images/icons/stars.png'
    ctx.drawImage(image,0,0,1201*rating/5,241,100, 350, 32*rating, 32)

 

    



}
function getPassedNotes(noteStates : NoteState[])
{
   return noteStates.reduce((acc,val) => {
       if(val == NoteState.DEAD || val == NoteState.HIT || val == NoteState.MISS)
       {
           return acc + 1
       }
       else
       {
           return acc
       }
   })    
}

export function setupScoreBoard(bus: ControlBus,feedbackBus : FeedbackBus) {

    let deltaTime$ = bus.songTime$.pipe(pairwise(),map(([prevtime,time]) => time-prevtime),filter(dt => dt>0),throttleTime(100))
    let scoreBoard$ = merge(feedbackBus.hits$, feedbackBus.misses$, feedbackBus.falsePositives$).pipe(
        withLatestFrom(bus.noteStates$),
        scan((previousScoreBoard: ScoreBoard, [msg,noteStates]) => {
            if (msg.kind == "hit") {
                var consecutiveHits = previousScoreBoard.consecutiveHits + msg.hitNotes.length
                let multiplier = Math.floor(consecutiveHits / 10) + 1
                var score = previousScoreBoard.score+msg.hitNotes.length * multiplier
                let rating = score/getPassedNotes(noteStates)
                return { consecutiveHits: consecutiveHits, score: score, multiplier: multiplier,rating:rating }
                  
            }
            else {
                console.log(msg.kind)
                return { consecutiveHits: 0, score: previousScoreBoard.score, multiplier: 1,rating:previousScoreBoard.score/getPassedNotes(noteStates)}

            }
        },{consecutiveHits:0,score:0,multiplier:1,rating:0.5}),
        startWith({consecutiveHits:0,score:0,multiplier:1,rating:0.5})
    )
    scoreBoard$.pipe(
        pairwise(),
        map(([previousBoard, currentBoard]) => currentBoard.multiplier - previousBoard.multiplier),
        filter(delta => Math.abs(delta) > 0),
        scan((previous, delta) => previous + delta, 1),
        startWith(1)
    ).subscribe(x => bus.multiplier$.next(x))
    
    bus.songTime$.pipe(
        withLatestFrom(scoreBoard$, bus.songPlayer$,deltaTime$)
    ).subscribe(([songTime, scoreBoard, songplayer,deltaTime]) => drawScoreBoard(scoreBoard, songTime,deltaTime, songplayer.duration()))

    var levelup = new Howl({
        src: ['../sfx/levelup.wav']
      });
    levelup.volume(0.3)
    var reset = new Howl({
        src: ['../sfx/reset.wav']
      });
    reset.volume(0.3)
    bus.multiplier$.pipe(
        pairwise(),
        
    ).subscribe(([previous,updated]) =>{
        if (previous < updated) {
            levelup.play()
        }else
        {
            reset.play()
        }            
    })
    
      
}