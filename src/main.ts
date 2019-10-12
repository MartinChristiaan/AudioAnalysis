import { SongData } from './data/lib';
import { Song } from './song';
import { DynamicsManager } from './dynamicsManager';
import { HitDetection } from './hitDetection';
import { NoteDrawer } from './noteDrawer';
import { InstrumentDrawer } from './instrumentDrawer';
import { ScoreDrawer } from './ScoreDrawer';
import { NoteColorer } from './colors';
import { screenShaker } from './postprocessing';
import { loadSongData } from './loader';
import { GearBox } from './gearmanager';
import { load } from './inputHandler';
import { loadEnergyChart } from './charts/charts';

// canvas setup
console.log("Starting")
console.time('Initialization');
export var canvas = document.querySelector('canvas')
canvas.height = innerHeight
canvas.width= document.getElementById("canvasdiv").clientWidth
export var ctx = canvas.getContext('2d')

// custom setup

let songdata = loadSongData()
export var song = new Song(songdata)

export var dynamicsManager = new DynamicsManager(song, screenShaker)
export var noteColorer = new NoteColorer(dynamicsManager)
export var hitDetection = new HitDetection(dynamicsManager)
export var gearbox = new GearBox(songdata)

export var noteDrawer = new NoteDrawer()
export var instrumentDrawer = new InstrumentDrawer(song, ctx, noteColorer)
export var scoreDrawer = new ScoreDrawer(ctx, dynamicsManager, song)

loadEnergyChart(song.e)

console.timeEnd('Initialization');

function main() {
    ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas
    dynamicsManager.update()
    var speed = dynamicsManager.speed
    song.update(speed)
    noteDrawer.update(gearbox.curGear,song)
    hitDetection.detectHits(noteDrawer.visibleNotes,song)
    instrumentDrawer.update(hitDetection.activeNotes,gearbox.curGear)
    scoreDrawer.drawScore()
    screenShaker.update()
    window.requestAnimationFrame(main);
}





main()
console.log(load)

// TODO - 
// Add boosters
// Special notes 


