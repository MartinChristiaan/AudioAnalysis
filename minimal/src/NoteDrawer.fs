module NoteDrawer
open Fable.Import.Browser
open Loader
open Fable.Core
open Fable.Import

let myCanvas : HTMLCanvasElement = unbox document.getElementById "myCanvas"  // myCanvas is defined in public/index.html
myCanvas.height <- innerHeight
myCanvas.width <- innerWidth

let ctx = myCanvas.getContext_2d() 



let GetItemsInTimeWindow<'T> futureTimeMargin pastTimeMargin currentTime getTimeFromItem (items: 'T array) =
        let lowerBoundTime = currentTime - pastTimeMargin ; // speed code
        let upperBoundTime = currentTime + futureTimeMargin; // speed code
        
        items|>Array.filter(fun item -> (getTimeFromItem item) >  lowerBoundTime && (getTimeFromItem item) < upperBoundTime)

let inverseLerp min max value =
    (value-min) /(max - min) 


let percentInWindow futureTimeMargin pastTimeMargin currentTime time =
    inverseLerp (currentTime - pastTimeMargin)(currentTime + futureTimeMargin) time 


let mutable futureTimeMargin = 2.0
let mutable pastTimeMargin = 1.0


type NoteState = Dead | Alive | Hit | Missed
type Note={
    onsetTime: float;
    state: NoteState;
    y: float;
    x: float;
}

let mutable notes = Array.empty 


let InitializeNotes (songData:SongData) =
    notes <- songData.onsets|>Array.map(fun onset -> 
        {onsetTime = onset.time;state = NoteState.Alive;y = innerHeight;x = onset.frequency /11.0 * innerWidth})

let getVerrticalPosition  (currentTime) (note: Note) =
        let percentTravelled = percentInWindow futureTimeMargin pastTimeMargin currentTime note.onsetTime
        {note with y = innerHeight - (percentTravelled * innerHeight);
    }

let drawNote (note:Note) =
    console.log("x : " + note.x.ToString()  + "y" + note.y.ToString())
    ctx.beginPath();
    ctx.arc(note.x, note.y, 12.0, 0.0, 6.29, false);
    ctx.fillStyle <- U3.Case1 "red"
    ctx.fill()
    ctx.restore()


let timeStep currentTime = 
    ctx.clearRect (0.0,0.0,innerWidth,innerHeight);
    let visibleNotes = notes|>GetItemsInTimeWindow futureTimeMargin pastTimeMargin currentTime (fun x -> x.onsetTime)
    //console.log(notes|>Array.map(fun x-> x.onsetTime))

    visibleNotes|>Array.iter (getVerrticalPosition currentTime>>drawNote)
    
    




