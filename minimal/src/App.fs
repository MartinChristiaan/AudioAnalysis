  
module App

open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Browser
open Fable.Core
open Loader
open NoteDrawer


[<Import("*", "./song.js")>]
let songPlayer : ISongPlayer = jsNative

// Setting up events for communication between components

let onSongLoaded = new MyEvent<Song>("OnSongLoaded")

let mutable timeMargin = 2.0

let startSongLoading source =
    console.log "Started loading"
    songPlayer.LoadSong source onSongLoaded.Trigger 

let loader = Loader.LoaderClass()
onSongLoaded|>loader.SetupLoadSongData

console.log "subscribing to onSongSelected" 
loader.OnSongSelected.Subscribe startSongLoading
loader.OnSongSelected.Subscribe console.log
console.log "subscribEd to onSongSelected" 
loader.OnSongSelected.Trigger "darksied"
//

let onKeyDown (event: KeyboardEvent) =
    let key = event.key
    let songKeys = Array.init 8 (fun i -> string (i+1)) 
    if  Array.contains key songKeys then
        let x = Array.findIndex (fun x -> x = key) songKeys
        console.log x
        loader.SelectSong x

document.addEventListener_keydown onKeyDown

//document.addEventListener "keydown" onKeyDown

// document.addEventListener('keydown', function (event) {
//     var key = event.key;
//     console.log(key)
//     if (event.code == 'Space') {
//     //    console.log("boosting")
//         dynamicsManager.applyBooster()
//     }
//     else if (key == "Shift") {
//         shiftDown = true
//        // console.log("Shifting")
//     }
//     if(shiftDown == false)
//     {
//         hitDetection.updateKey(key,gearbox.curGear)
//     }
//     else
//     {   

//         let shiftKeyCodes = keycodes[4].map(x => x.toUpperCase())
//         if (shiftKeyCodes.includes(key)) {
//            // console.log("Shifting to gear " + shiftKeyCodes.indexOf(key))
//             gearbox.shiftGear(shiftKeyCodes.indexOf(key))
//             noteDrawer.shiftGear(gearbox.curGear,song)
//         }
//     }
// });





// let onSongDataLoaded  (song:Song) (data:SongData)=
    
//     let timeStep = new Event<float>()
//     let timeStepSubscribers = timeStep.Publish

//     let noteDrawerOnTimeStep =  InitializeNotes data timeStepSubscribers
//     let rec main x =         
//         song.seek()|>timeStep.Trigger
//         window.requestAnimationFrame main |> ignore
//     main(0.0)








