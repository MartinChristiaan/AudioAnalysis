import { SongData} from './data/lib';
import { Song } from './song';
import { DynamicsManager } from './dynamicsManager';
import { HitDetection } from './hitDetection';
import { NoteDrawer } from './noteDrawer';
import { InstrumentDrawer } from './instrumentDrawer';
import { ScoreDrawer } from './ScoreDrawer';
import { NoteColorer } from './colors';
import { screenShaker } from './postprocessing';
// canvas setup

var canvas = document.querySelector('canvas')
export var ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

// custom setup

function loadFile(filePath : string):string {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function convertToNumberArray(line:string)
{
    return line.split(',').map((x) => parseFloat(x))
}
var availableSongs = loadFile("../data/available.txt").split(/\r?\n/); // splits per line
var chosenSong = availableSongs[1]//Math.floor(Math.random() * availableSongs.length)]
var data = loadFile("../data/songs/" + chosenSong).split(/\r?\n/).map(convertToNumberArray)

const songdata = {
    t_onset : data[0],
    f_onset :data[1],
    e : data[2],
    name : chosenSong.slice(0,chosenSong.length - 4) + ".mp3"
};

var song = new Song(songdata) //random song

// start with song
var dynamicsManager = new DynamicsManager(song,screenShaker)
var noteColorer = new NoteColorer(dynamicsManager)
var hitDetection = new HitDetection(song,dynamicsManager)
var noteDrawer = new NoteDrawer(song,ctx,noteColorer)
var instrumentDrawer = new InstrumentDrawer(song,ctx,noteColorer)
var scoreDrawer = new ScoreDrawer(ctx,dynamicsManager,song)

function main()
{
    ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas
    dynamicsManager.update()
    var speed = dynamicsManager.speed
    song.update(speed)
    hitDetection.detectHits()
    noteDrawer.update(hitDetection.noteStates)
    instrumentDrawer.update(hitDetection.activeNotes)
    scoreDrawer.drawScore()
    screenShaker.update()
    window.requestAnimationFrame(main);
}
document.addEventListener('keydown', function (event) {
    var key = event.key;
    if(key == 'spacebar')
    {
        dynamicsManager.applyBooster()
    }
    hitDetection.updateKey(key)
});

main()


// TODO - 
// Add boosters
// Special notes 


