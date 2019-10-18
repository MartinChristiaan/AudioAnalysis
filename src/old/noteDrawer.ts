//import { Song } from './song';
import { NoteColorer, rgb, addRandomDeviation } from '../colors';
import { Gear } from './gearmanager';
import { NoteState } from './hitDetection';
import { GetItemsInTimeWindow, percentInWindow } from "./TimeWindow";
import { Onset, SongData } from "../loader";
import { MyEvent } from "../util/MyEvent";
import { orbitParticles } from "../config";

export class Note
{
    color: rgb;
    onsetTime: number;
    state: NoteState;
    y: number;
    x: number;
    constructor(onset : Onset)
    {
        this.onsetTime = onset.time;   
        this.state= NoteState.ALIVE
        this.y = innerHeight;
        this.x = 1   
        this.color = new rgb(255,255,255) // noteColorer.getNoteColorRaw(this.t)
    }
}

export class NoteDrawer {

    // notes are immutable
    notes: Note[] = []; // mutable
    futureTimeMargin = 2
    pastTimeMargin = 1


    constructor(onLoadSongData: MyEvent<SongData>, onTimeStep: MyEvent<Number>, onChangeGear: MyEvent<Gear>, onChangeColor) {
        onLoadSongData.subscribe(this.loadSong)
        onTimeStep.subscribe(this.timeStep)
        onChangeGear.subscribe(this.shiftGear)
        //        onChangeColor.subscribe(this.changeColor)
    }
    loadSong(songData: SongData) {
        this.notes = songData.onsets.map(onset =>
            new Note(onset)
        )
    }
    shiftGear(gear: Gear) {
        // shift note Position
        //this.visibleNotes.forEach((note,idx,_) => note.changeGear(gear))
    }
    updateNoteVerticalPosition(note: Note, currentTime) {
        var percentTravelled = percentInWindow(this.futureTimeMargin, this.pastTimeMargin, currentTime, note.onsetTime)
        note.y = innerHeight - (percentTravelled * innerHeight);
    }

    createOrbitalParticles(note: Note) {

        note.orbitParticles = Array.from({ length: orbitParticles }, (_, id) => {
            return new OrbitParticle(10
                , id * Math.PI * 2 / orbitParticles
                , note.y, note.x
                , 3
                , note.isBuildUp ? new rgb(255, 0, 0) : addRandomDeviation(note.color, 100))

        })

    }
    

    timeStep(currentTime: number) {

        let visibleNotes : Note [] = GetItemsInTimeWindow(this.futureTimeMargin
            , this.pastTimeMargin
            , currentTime, this.notes.filter(x => x.state != NoteState.DEAD))
    //    visibleNotes.filter(x => x.orbitParticles.length == 0).forEach(this.createOrbitalParticles)
        visibleNotes.forEach(x => this.updateNoteVerticalPosition(x, currentTime))
      //  visibleNotes.forEach()



    }


}
