import { Song } from './song';
import { Note } from "./noteParticle";
import { NoteColorer } from './colors';
import { Gear } from './gearmanager';
import { NoteState } from './hitDetection';

export class NoteDrawer {
    
    visibleNotes: Note[] = [];
    spawnedIDX : number = -1
    constructor() {
    }
    shiftGear(gear:Gear,song:Song)
    {

        this.visibleNotes.forEach((x,idx,_) => x.changeGear(song,gear))
    }

    update(gear:Gear,song :Song) {
        //console.log("min : " + Math.min(...song.buildupOnsets))
        //console.log(this.spawnedIDX)
        
        song.visibleIdx.forEach( idx=>{
            if (idx > this.spawnedIDX) {
                
                this.spawnedIDX = idx 
                this.visibleNotes.push(new Note(song,gear, idx))   
            }
        })
            
        this.visibleNotes.forEach(note => {note.update()})
        this.visibleNotes = this.visibleNotes.filter(note => note.state != NoteState.DEAD)     
       
    }
}
