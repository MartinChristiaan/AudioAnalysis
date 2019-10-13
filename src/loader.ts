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

export class SongData
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
export function selectSong(idx=-1)
{
    var availableSongs = loadFile("../data/available.txt").split(/\r?\n/);
    availableSongs.pop()
    console.log(availableSongs)
    if (idx===-1) {
        idx = Math.floor(Math.random() * availableSongs.length)
    }
    var chosenSong = availableSongs[idx] // availableSongs[Math.floor(Math.random() * availableSongs.length)]//
    return chosenSong.slice(0, chosenSong.length - 4) + ".mp3"
}

export function loadSongData(chosenSong,duration) {
    var data = loadFile("../data/songs/" + chosenSong.slice(0, chosenSong.length - 4) + ".txt").split(/\r?\n/).map(convertToNumberArray)

    const songdata : SongData = new SongData(data[0],data[1],data[2],data[3],data[4],duration)

    return songdata //random song
}