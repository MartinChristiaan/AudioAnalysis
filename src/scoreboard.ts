import { Observable, merge } from "rxjs"

import { scan, filter, pairwise, map, startWith, withLatestFrom, throttleTime } from "rxjs/operators"
import { percentInWindow } from "./util/funUtil"
import { ctx } from "./main"
import { rgba } from "./colors"
import { ControlBus, FeedbackBus, IHits, IMisses, IFalsePositives } from "./bus"
import { NoteState } from "./hitDetection"
import { elementAt } from "rxjs/operators"

class ScoreBoard {
    consecutiveHits: number
    multiplier: number
    score: number
    rating: number
}

type IScoreBoardMessage = IHits | IMisses | IFalsePositives

function frmt(num) {
    return Math.round((num + 0.0001) * 10) / 10;
}

function svgel(elementname, attributes, parent) {
    let element:SVGElement = document.createElementNS("http://www.w3.org/2000/svg", elementname)

    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key])
    });
    parent.appendChild(element)
    return element
}

function drawProgressBar(defs,x,y,
                        color1,color2,
                        id,imsource,svg,
                        maxval){
    let grad = svgel("linearGradient",{"id":id},defs)
    svgel("stop",{"offset":"0%","stop-color":color1},grad)
    svgel("stop",{"offset":"100%","stop-color":color2},grad)
  
    let iconsize = 30
    let iconattr = {
        "x": x,
        "y": y,
        "width": iconsize,
        "height": iconsize,
        "href": imsource//'../data/images/optimization-clock.svg'
    }
    svgel("image", iconattr, svg)
    let pbar = svgel("rect",{"x":x + iconsize + 15,"y":y + 5,
        "width":200,"height":20,
        "fill":`url(#${id})`,
        "rx":"5"},svg)
    let value = svgel("text",{"x":x+180 + iconsize ,"y" : y+20,"fill":"white"},svg)
    value.textContent = maxval.toFixed(2)
    let value2 = svgel("text",{"x":x+20 + iconsize ,"y" : y+20,"fill":"white"},svg)
    value2.textContent = 0.3.toFixed(2)

    function updateProgressBar(curval,maxval){
        value.textContent = maxval.toFixed(2)
        value2.textContent = curval.toFixed(2)
        pbar.setAttribute("width",(curval/maxval * 200).toFixed(0)) 
    }
    return updateProgressBar

}

let svg = document.getElementById("scoreboard")

let defs = svgel("defs", {}, svg)
let updateTime = drawProgressBar(defs,20,20,"rgb(218, 34, 255)","rgb(151, 51, 238)","time"
,'../data/images/optimization-clock.svg',svg,2)
let updateConsequtiveHits = drawProgressBar(defs,20,60,"rgb(238, 9, 121)","rgb(255, 106, 0)","hits"
,'../data/images/icons/mult.svg',svg,10)
let multiplierText = svgel("text",{"x":70 ,"y" : 120,"fill":"white"},svg)
multiplierText.textContent = "1X"

let ratingmask = svgel("mask",{"id":"ratingmask"},svg)
let ratingmaskrect = svgel("rect",{"x" : 80,"y":103,"width":90,"height":25,"fill":"white"},ratingmask)
svgel("image",{"href":'../data/images/icons/stars.png'
                ,"x" : 80,"y":103,"width":180,"height":25,
                "mask":"url(#ratingmask)"},svg)

function updateScoreBoard(scoreboard : ScoreBoard, currentTime, deltaTime,duration){
    updateTime(currentTime,duration)
    updateConsequtiveHits(scoreboard.consecutiveHits%10,10)
    ratingmaskrect.setAttribute("width",(180/5*scoreboard.rating).toFixed(1))

}


function getPassedNotes(noteStates: NoteState[]) {
    return noteStates.reduce((acc, val) => {
        if (val == NoteState.DEAD || val == NoteState.HIT || val == NoteState.MISS) {
            return acc + 1
        }
        else {
            return acc
        }
    })
}

export function setupScoreBoard(bus: ControlBus, feedbackBus: FeedbackBus) {

    let deltaTime$ = bus.songTime$.pipe(pairwise(), map(([prevtime, time]) => time - prevtime), filter(dt => dt > 0), throttleTime(100))
    let scoreBoard$ = merge(feedbackBus.hits$, feedbackBus.misses$, feedbackBus.falsePositives$).pipe(
        withLatestFrom(bus.noteStates$),
        scan((previousScoreBoard: ScoreBoard, [msg, noteStates]) => {
            if (msg.kind == "hit") {
                var consecutiveHits = previousScoreBoard.consecutiveHits + msg.hitNotes.length
                let multiplier = Math.floor(consecutiveHits / 10) + 1
                var score = previousScoreBoard.score + msg.hitNotes.length * multiplier
                let rating = score / getPassedNotes(noteStates)
                return { consecutiveHits: consecutiveHits, score: score, multiplier: multiplier, rating: rating }

            }
            else {
                console.log(msg.kind)
                return { consecutiveHits: 0, score: previousScoreBoard.score, multiplier: 1, rating: previousScoreBoard.score / getPassedNotes(noteStates) }

            }
        }, { consecutiveHits: 0, score: 0, multiplier: 1, rating: 0.5 }),
        startWith({ consecutiveHits: 0, score: 0, multiplier: 1, rating: 0.5 })
    )
    scoreBoard$.pipe(
        pairwise(),
        map(([previousBoard, currentBoard]) => currentBoard.multiplier - previousBoard.multiplier),
        filter(delta => Math.abs(delta) > 0),
        scan((previous, delta) => previous + delta, 1),
        startWith(1)
    ).subscribe(x => bus.multiplier$.next(x))
    // drawscoreboard -> update scoreboard
    bus.songTime$.pipe(
        withLatestFrom(scoreBoard$, bus.songPlayer$,deltaTime$)
    ).subscribe(([songTime, scoreBoard, songplayer,deltaTime]) => updateScoreBoard(scoreBoard, songTime,deltaTime, songplayer.duration()))

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

    ).subscribe(([previous, updated]) => {
        if (previous < updated) {
            levelup.play()
        } else {
            reset.play()
        }
    })


}