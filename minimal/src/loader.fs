module Loader

type Time = float
type Frequency = float
type Intensity = float
type IsBuildUp = bool


type Onset = Time*Frequency*IsBuildUp
type Energy = Time*Frequency


let loadFile src = 
    


let selectSong ?idx =
    var availableSongs = loadFile("../data/available.txt").split(/\r?\n/)
    availableSongs.pop()
    console.log(availableSongs)
    if (idx===-1) {
        idx = Math.floor(Math.random() * availableSongs.length)
    }
    var chosenSong = availableSongs[idx] // availableSongs[Math.floor(Math.random() * availableSongs.length)]//
    return chosenSong.slice(0, chosenSong.length - 4) + ".mp3"

