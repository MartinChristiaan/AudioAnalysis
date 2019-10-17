module InstrumentDrawer
open NoteDrawer
// let mutable ActiveNotes : int array = Array.empty
// setup event to listen to keypressens
 
let getNoteColor percent = 
    


let drawInstruments currentTime numNotes timeMargin (activeNotes:int array) =
        let instrumentHeight =  (1.0 - percentInWindow timeMargin (timeMargin/2.0) currentTime currentTime) * myCanvas.height// (1 - (currentTime - song.t_min) / (song.t_max - song.t_min)) * innerHeight;
        
        let drawInstrumentNote (frequencyIndex:int) =
            let noteWidth = myCanvas.width/numNotes
            let xStart = (float frequencyIndex) *  noteWidth 
            let xStop = xStart + noteWidth 
            ctx.beginPath();
            ctx.lineWidth <- 10.0

            if (activeNotes.[frequencyIndex] > 0) then
                ctx.strokeStyle <- "white"
            else if(activeNotes.[frequencyIndex] < 0) then
                ctx.strokeStyle <- "red"
            else 
                ctx.strokeStyle <- this.noteColoror.getNoteColor((f + 1) / numNotes)
            moveTo(x_start, y_now)
            lineTo(x_stop, y_now)
            ctx.stroke();
            ctx.restore()

        
        

        Array.init numNotes (fun f -> f * noteWidth,(f+1) * noteWidth)
        


    //     for (let f = 0; f < numNotes ; f++) {
    //         var x_start = (f) / 
    //         var x_stop = (f + 1) / (numNotes) * canvas.width
 
    //         //console.log(x_stop)
    //         ctx.beginPath();
    //         //
    //         ctx.lineWidth = 10;
    //         if (ActiveNotes[f] > 0) {
    //             //ctx.filter = 'blur(2px)'
    //             ctx.strokeStyle = "white"
    //         }
    //         else if(ActiveNotes[f] < 0)
    //         {
    //             ctx.strokeStyle = "red"
    //         }
    //         else {
    //             ctx.filter = "none"
    //             ctx.strokeStyle = this.noteColoror.getNoteColor((f + 1) / numNotes)
    //         }
    //         moveTo(x_start, y_now)
    //         lineTo(x_stop, y_now)
    //         ctx.stroke();
    //         ctx.restore()
    //     }
    // }

}


