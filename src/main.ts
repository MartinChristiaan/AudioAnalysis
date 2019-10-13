import { SongPlayer } from './song';
import { Scoremanager } from './scoreManager';
import { HitDetection } from './hitDetection';
import { NoteDrawer } from './noteDrawer';
import { InstrumentDrawer } from './instrumentDrawer';
import { ScoreDrawer } from './ScoreDrawer';
import { NoteColorer } from './colors';
import { screenShaker } from './postprocessing';
import { loadSongData, selectSong } from './loader';
import { GearBox } from './gearmanager';
import { load } from './inputHandler';
import {UpdatingChart} from './charts/charts'

// canvas setup
console.log("Starting")
console.time('Initialization');

var song = selectSong(3)
var player = new SongPlayer(song,30)

export var canvas = document.querySelector('canvas')
canvas.height = innerHeight
canvas.width= document.getElementById("canvasdiv").clientWidth
export var ctx = canvas.getContext('2d')
// custom setup
let songdata = loadSongData(song,player.duration)


export var dynamicsManager = new Scoremanager(song, screenShaker)
export var noteColorer = new NoteColorer(dynamicsManager)
export var hitDetection = new HitDetection(dynamicsManager)
export var gearbox = new GearBox(songdata)

export var noteDrawer = new NoteDrawer()
export var instrumentDrawer = new InstrumentDrawer(song, ctx, noteColorer)
export var scoreDrawer = new ScoreDrawer(ctx, dynamicsManager, song)

let energyChart = new UpdatingChart(song.e,songdata.buildupEnergies)

console.timeEnd('Initialization');

function main() {
    ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas
    dynamicsManager.update()
    
    song.update()
    noteDrawer.update(gearbox.curGear,song)
    hitDetection.detectHits(noteDrawer.visibleNotes,song)
    instrumentDrawer.update(hitDetection.activeNotes,gearbox.curGear)
    scoreDrawer.drawScore()
    screenShaker.update()
    energyChart.UpdateData(Math.round(song.t_cur/song.duration * song.e.length))
    window.requestAnimationFrame(main);
}





main()
console.log(load)

// TODO - 
// Add boosters
// Special notes 


