  
module App

open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Browser
open Fable.Core
open Loader
open NoteDrawer


[<Import("*", "./song.js")>]
let songPlayer : ISongPlayer = jsNative
let onSongLoaded (song:Song) = console.log (song.duration())
let onSongSelected source callback = 
    songPlayer.LoadSong (source + ".mp3") callback

let onSongDataLoaded  (song:Song) (data:SongData)=
    InitializeNotes data
    let timeStep = new Event<float>()
    let timeStepSubscribers = timeStep.Publish
    timeStepSubscribers.Add NoteDrawer.timeStep

    let rec main x =         
        song.seek()|>timeStep.Trigger
        window.requestAnimationFrame main |> ignore
    main(0.0)

selectSong 3 onSongSelected onSongDataLoaded






