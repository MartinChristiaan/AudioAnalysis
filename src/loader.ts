import { fromEvent, ConnectableObservable, zip, observable } from "rxjs";
import { map, filter, switchMap, publish, scan, buffer, pairwise, throttleTime, concatMap, observeOn, withLatestFrom, tap } from "rxjs/operators";

import { Howl } from 'howler';
import { SongAnalysisData as SongAnalysis } from "./types/types";
import { ControlBus } from "./bus";
import { animationFrame } from "rxjs/internal/scheduler/animationFrame";
import { createMenu } from "./menu/menu";
import { from } from 'rxjs';
function getRequest(filePath: string): string {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}
function postRequest(filePath: string,args): string {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open("PUT", filePath, false);
    xmlhttp.send(args);
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function asyncGetRequest(url)
{
    let myFirstPromise = new Promise((resolve, reject) =>{
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText);
        }
        xmlHttp.open("GET", url, true); // true for asynchronous 
        xmlHttp.send(null);
    })
    return myFirstPromise
    
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
function loadSongAnalysis (rawdata,song){
    console.log("Loading song analysis")
    console.log(rawdata)
    let data = rawdata.split(':').map(convertToNumberArray)
    console.log(data)
    return new SongAnalysis(data[0],data[1],data[2],data[3],song.duration())    
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
    postRequest("http://127.0.0.1:5000/select_song",source+".mp3")
    var sound = new Howl({
        src: ['/static/music/' + source + ".mp3"]
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
    var availableSongs = getRequest("http://127.0.0.1:5000/songs")
                            .split(/\r?\n/).map(x => x.slice(0,x.length-4));
    
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
    bus.onsets$.subscribe(x => console.log("Onsets changes"))
    
    zip(bus.songTitle$,bus.songPlayer$).subscribe(x => bus.onsets$.next([]))

    // bus.songTime$.pipe(
    //     //maybe insert temporal buffer
    //     //filter(time => time>1),

    // ).subscribe(x => bus.songAnalysis$.next(x))
    
    //from(asyncGetRequest("http://127.0.0.1:5000/update_data")).subscribe(console.log)


    bus.songTime$.pipe(
        withLatestFrom(bus.onsets$,bus.songTitle$,bus.songPlayer$),
        
        tap(([time,onsets]) => console.log(onsets.length)),//onsets[onsets.length-1].time)),
        filter(([time,onsets]) =>  onsets.length == 0 || onsets[onsets.length-1].time - time < 5),
        concatMap(x =>asyncGetRequest("http://127.0.0.1:5000/update_data")),
        withLatestFrom(bus.songPlayer$),
        tap(console.log),
        map(([data,song]) => loadSongAnalysis(data,song))        
    ).subscribe(x => bus.songAnalysis$.next(x))
}

