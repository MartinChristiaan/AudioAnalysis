import { MyEvent } from "./util/MyEvent";
import { fromEvent, ConnectableObservable } from "rxjs";
import { map, filter, switchMap, publish, scan, buffer } from "rxjs/operators";

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


export class Onset implements timedValue
{
    time:number
    frequency:number
    isBuildup:boolean
}
export class Energy implements timedValue
{
    energy:number
    time:number
}

export interface timedValue {
    time: number;
}

export class SongAnalysisData
{
    energies : Energy [];
    onsets : Onset [];    
    buildupOnsets: number[];
    buildupEnergies: number [];
    maxFreq:number = 11

    constructor(t_onset,f_onset,e,buildupOnsets,buildupEnergies,duration)
    {   let dt = duration / e.length
        this.onsets = Array.from({length: f_onset.length}, (_, id) =>  
        {
            let onset = {
                time:t_onset[id],
                frequency:f_onset[id],
                isBuildup :buildupOnsets.includes(id)
                    } 
            return onset
        })

        this.energies = Array.from({length: e.length}, (_, id) =>  
        {
            
            let energy = {
                energy:e[id],
                time:id * dt              
                    } 
            return energy
        })      


    }
        
}


function selectSong(idx=-1)
{
    var availableSongs = loadFile("../data/available.txt").split(/\r?\n/);
    availableSongs.pop()
    console.log(availableSongs)
    if (idx===-1) {
        idx = Math.floor(Math.random() * availableSongs.length)
    }
    return availableSongs[idx].slice(0,availableSongs[idx].length-4) // availableSongs[Math.floor(Math.random() * availableSongs.length)]//
   
}

function loadSongData (chosenSong:string,song:Howl){
    var data = loadFile("../data/songs/" + chosenSong.slice(0, chosenSong.length - 4) + ".txt").split(/\r?\n/).map(convertToNumberArray)
    const songdata : SongAnalysisData = new SongAnalysisData(data[0],data[1],data[2],data[3],data[4],song.duration())    
}

import { Howl, Howler } from 'howler';

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
    sound.seek(0)
    return new Promise((resolve,fail) => waitUntilSongStarts(sound,resolve))

}

let digitKeys = [0,1,2,3,4,5,6,7,8,9].map(x => x.toString())
export let songTitle$ = fromEvent(document,'keydown').pipe(
    map(x => (x as KeyboardEvent).key),
    filter(x => digitKeys.includes(x)),
    map(x => digitKeys.indexOf(x)),
    map(selectSong)
)
export let songPlayer$ = songTitle$.pipe(
    switchMap(title => loadSong(title)),
    
    publish()
) as ConnectableObservable<Howl>

songPlayer$.subscribe(x => console.log(x.duration()))
songPlayer$.pipe(
    buffer(songPlayer$)    
).subscribe((x) => x[0].stop())


songPlayer$.connect()











