import { fromEvent, ConnectableObservable, zip } from "rxjs";
import { map, filter, switchMap, publish, scan, buffer, pairwise, throttleTime, concatMap, observeOn } from "rxjs/operators";

import { Howl } from 'howler';
import { SongAnalysisData as SongAnalysis } from "./types/types";
import { ControlBus } from "./bus";
import { animationFrame } from "rxjs/internal/scheduler/animationFrame";
import { createMenu } from "./menu/menu";

function loadFile(filePath: string): string {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function convertToNumberArray(line: string) {
    return line.split(',').map((x) => parseFloat(x))
}

function selectSong(availableSongs,idx=-1)
{
    if (idx===-1) {
        idx = Math.floor(Math.random() * availableSongs.length)
    }
    return availableSongs[idx] // availableSongs[Math.floor(Math.random() * availableSongs.length)]//
   
}
function loadSongAnalysis (chosenSong:string,song:Howl){
    var data = loadFile("../data/songs/" + chosenSong + ".txt").split(/\r?\n/).map(convertToNumberArray)
    return new SongAnalysis(data[0],data[1],data[2],data[3],data[4],data[5],data[6],song.duration())    
}

function waitUntilSongStarts(sound:Howl,resolve) {
    if (sound.duration()>0){
        
        resolve(sound)
    }
    else
    { 
        console.log(sound.duration())
     setTimeout(() => waitUntilSongStarts(sound,resolve),100)
    }
}


function loadSong(source:string)
{
    var sound = new Howl({
        src: ['../music/' + source + ".mp3"]
    });
  
    sound.volume(1)
    sound.play()
    sound.seek()
    return new Promise((resolve,fail) => waitUntilSongStarts(sound,resolve))

}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export function SetupSongLoading(bus:ControlBus)
{
    var availableSongs = loadFile("../data/available.txt")
                            .split(/\r?\n/).map(x => x.slice(0,x.length-4));
    availableSongs.pop()
    availableSongs = shuffle(availableSongs)
    createMenu(availableSongs,bus)
    let digitKeys = availableSongs.map((x,idx) => (idx+1).toString())

    fromEvent(document,'keydown').pipe(
        map(x => (x as KeyboardEvent).key),
        filter(x => digitKeys.includes(x)),
        map(x => digitKeys.indexOf(x)),
        map(x => availableSongs[x])
    ).subscribe(x => bus.songTitle$.next(x))

    bus.songTitle$.pipe(
        concatMap(title => loadSong(title)),
    ).subscribe(x => bus.songPlayer$.next(x as Howl))
    // songPlayer$.subscribe(x => console.log(x.duration()))
    bus.songPlayer$.pipe(
        pairwise()    
    ).subscribe(([previousValue, currentValue]) => previousValue.stop())

    bus.songAnalysis$.pipe(map((x) => x.onsets),observeOn(animationFrame)).subscribe(x => bus.onsets$.next(x))

    zip(bus.songTitle$,bus.songPlayer$).pipe(
        map(([title,player]) => loadSongAnalysis(title,player))
    ).subscribe(x => bus.songAnalysis$.next(x))
    
    
}

