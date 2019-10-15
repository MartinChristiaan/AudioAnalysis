import { MyEvent } from "./util/MyEvent";

import { loadSong } from "./songplayer";
import { SelectedSong, selectSong, SongData } from "./loader";

//import { SongPlayer } from './songplayer';
//import { Scoremanager } from './scoreManager';
// import { HitDetection } from './hitDetection';
// import { NoteDrawer } from './noteDrawer';
// import { InstrumentDrawer } from './instrumentDrawer';
// import { ScoreDrawer } from './ScoreDrawer';
// import { NoteColorer } from './colors';
// import { screenShaker } from './postprocessing';
// import { loadSongData, selectSong } from './loader';
// import { GearBox } from './gearmanager';
// import { load } from './inputHandler';
// import {UpdatingChart} from './charts/charts'

// canvas setup
console.log("Starting")
console.time('Initialization');

export var canvas = document.querySelector('canvas')
canvas.height = innerHeight
canvas.width= document.getElementById("canvasdiv").clientWidth
export var ctx = canvas.getContext('2d')

let onSongSelected = new MyEvent<SelectedSong>()
let onSongStarted = new MyEvent<Howl>();
let onSongDataLoaded = new MyEvent<SongData>();

onSongStarted.subscribe((x) => console.log("Started"))
onSongDataLoaded.subscribe((x) => console.log(x.onsets))

onSongSelected.subscribe((x:SelectedSong)=>{  
        onSongStarted.subscribe((sound:Howl) => x.loadSongData(sound));
        loadSong(x.source,onSongStarted)}
    );

selectSong(1,onSongSelected,onSongDataLoaded)



function main() {

    ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas
//    player.updateTime()
    
    // // song.update()
    // noteDrawer.update(gearbox.curGear,song)
    
    // hitDetection.detectHits(noteDrawer.visibleNotes,song) should be effentDriven



    // instrumentDrawer.update(hitDetection.activeNotes,gearbox.curGear)
    // scoreDrawer.drawScore()
    // screenShaker.update()
    // energyChart.UpdateData(Math.round(song.t_cur/song.duration * song.e.length))
    window.requestAnimationFrame(main);
}





main()



// export var dynamicsManager = new Scoremanager(song, screenShaker)
// export var noteColorer = new NoteColorer(dynamicsManager)
// export var hitDetection = new HitDetection(dynamicsManager)
// export var gearbox = new GearBox(songdata)

// export var noteDrawer = new NoteDrawer()
// export var instrumentDrawer = new InstrumentDrawer(song, ctx, noteColorer)
// export var scoreDrawer = new ScoreDrawer(ctx, dynamicsManager, song)

//let energyChart = new UpdatingChart(song.e,songdata.buildupEnergies)

console.timeEnd('Initialization');




//console.log(load)

// TODO - 
// Add boosters
// Special notes 


