  
module App

open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Browser

open Fable.Core
open Fable.PowerPack.Fetch
open Fable.PowerPack
//let mutable myCanvas : Browser.HTMLCanvasElement = unbox document.getElementById "myCanvas"  // myCanvas is defined in public/index.html

// type Song =
//     abstract GetCurrentTime : unit -> float
//     abstract Duration : unit -> float
// type ISongPlayer = 
//     abstract PlaySong : string -> int -> int -> Song
document.write("Print")
console.log("yo")
// let onSongSelected = new Event<string>()|> fun x -> x.Publish
// onSongSelected.Add(console.log)


let x = fetch "http://fable.io" []
        |> Promise.bind (fun res -> res.text())
        |> Promise.map (console.log)


// [<Import("*", "./song.js")>]
// let songPlayer : ISongPlayer = jsNative

// let song = songPlayer.PlaySong "../music/lessons.mp3" 0 1
// let rec main(x) =
//     console.log(song.GetCurrentTime())
//     window.requestAnimationFrame main |> ignore

// main(0.0)




