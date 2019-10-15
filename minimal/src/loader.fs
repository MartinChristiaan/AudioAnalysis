module Loader
open Fable.PowerPack
open Fable.PowerPack.Fetch
open Fable.Import
open Fable.Import.Browser

let loadfile file callback = 
        fetch file []
        |> Promise.bind (fun res -> res.text())
        |> Promise.map callback

let convertToNumberArray(line: string) =
    line.Split ','|>Array.map(float)   

type Onset = {
    time:float;
    frequency:float;
    IsBuildUp:bool
}
type Energy = {
    time:float;
    energy:float;
}
type SongData= {
    energies: Energy array;
    onsets : Onset array
    maxFrequencies : int
}

let createSongData (t_onset: float array) (f_onset: float array) 
    (e: float array) (buildupOnsets: float array)
    (buildUpEnergies : float array) 
    (duration : float) = 
    let integerBuildupOnsets = buildupOnsets|>Array.map int
    let dt = duration / (float e.Length)
    let onsets = Array.mapi2 (fun i t f  -> 
            {time=t;frequency=f;IsBuildUp = Array.contains i integerBuildupOnsets}) t_onset f_onset
    let energies = Array.mapi (fun i en  -> {time=(float i)*dt;energy =en}) e
    {energies=energies;onsets=onsets;maxFrequencies = 11}


type SelectedSong = {
    source : string
    loadSongData:float -> unit
}

    

let selectSong idx  onSongSelected onSongDataLoaded =
    console.log(availableSongs)

    //if (idx==-1) {
    //    idx = Math.floor(Math.random() * availableSongs.length)
    //}
    let furtherPr
    let chosenSong = availableSongs.[idx] // availableSongs[Math.floor(Math.random() * availableSongs.length)]//
    let loadSongData duration  =
        let data = loadFile("../data/songs/" + chosenSong.slice(0, chosenSong.length - 4) + ".txt")
        
        //.split(/\r?\n/).map(convertToNumberArray)
        let songdata : SongData = new SongData(data.[0],data.[1],data.[2],data.[3],data.[4],duration)
 //       onSongDataLoaded.fire(songdata)
        ()
    loadfile ("../data/available.txt".split '\n') (fun x -> console.log(x))|> ignore
        
    
    ()
//    onSongSelected.fire({source:chosenSong,loadSongData:loadSongData})




// let loadFile src = 
    


// let selectSong ?idx =
//     var availableSongs = loadFile("../data/available.txt").split(/\r?\n/)
//     availableSongs.pop()
//     console.log(availableSongs)
//     if (idx===-1) {
//         idx = Math.floor(Math.random() * availableSongs.length)
//     }
//     var chosenSong = availableSongs[idx] // availableSongs[Math.floor(Math.random() * availableSongs.length)]//
//     return chosenSong.slice(0, chosenSong.length - 4) + ".mp3"

