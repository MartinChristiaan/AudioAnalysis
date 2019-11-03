import { map2, argWhere } from "../util/funUtil";
import { NoteState, getOnsetFrequencyIndex } from "../hitDetection";
import { INoteMessage, Circumstances } from "./interfaces";
import { Onset } from "../types/types";
import { hitMargin } from "./config";

export function updateNoteState(noteStates: NoteState[], msg: INoteMessage) {
    if (msg.kind == "songChange") {
        console.log("Refreshing arary")
        return new Array(msg.numNotes).fill(0).map(x => NoteState.UNBORN);
    }
    else if (msg.kind == "timeUpdate") {
        return map2(noteStates, msg.onsets, (state, onset) => getNewNoteState(onset as Onset, state, msg));
    }
    else if (msg.kind == "hit") {
        msg.hitNotes.forEach(idx => {
          
            noteStates[idx] = NoteState.HIT;
        });
        return noteStates;
    }
    else if (msg.kind == "miss") {
        msg.missedNotes.forEach(idx => {
            noteStates[idx] = NoteState.MISS;
        });
        return noteStates;
    }
    else if (msg.kind == "noteDeaths") {
        msg.deaths.forEach(idx => {
            noteStates[idx] = NoteState.DEAD;
        });
        return noteStates;
    }
}
export function createNoteMessageBasedOnSongtime(songtimeOnsets): INoteMessage {
    let [songTime, onsets] = songtimeOnsets
    if (songTime < 1) {
        return { kind: "songChange", numNotes: onsets.length } // protect state
    }
    return { kind: "timeUpdate", onsets: onsets, songTime: songTime }
}

export function getNewNoteState(onset:Onset,state,msg)
{
    // if (checkIfNoteMissed(onset, state, msg.songTime, hitMargin)) {
    //     return NoteState.MISS
    // }
    if (msg.songTime - onset.time > 2)
    {
        return NoteState.DEAD
    }
    if(isBorn(onset,state,msg.songTime,hitMargin)) 
    {   
        return NoteState.ALIVE
    }
    return state
}

export function checkIfNoteMissed(note: Onset, noteState: NoteState, currentTime, hitMargin) {
    let maximumAllowableTime = note.time + hitMargin
    return noteState == NoteState.ALIVE && currentTime > maximumAllowableTime
}

export function isBorn(note: Onset,noteState:NoteState, currentTime, margin) {
    if (noteState == NoteState.UNBORN) {
        
        let lowerBoundTime = currentTime - 1; // speed code
        let upperBoundTime = currentTime + 2; // speed code
        if (note.time > lowerBoundTime && note.time < upperBoundTime) {
            return true

        }
        else {
            return false
        }            
    }
}

 export class LeadParticle
{
    endTime = 1
    index = 0
    onset:Onset
}

export function getLeadParticles(onsets:Onset[],circumstances:Circumstances,mergeThreshold) : LeadParticle[]
{
    let leaders = argWhere(onsets,((fidx,idx) => {
        if (idx > 0) {
            if(onsets[idx].time-onsets[idx-1].time < mergeThreshold)
            {
                let prevFreq = getOnsetFrequencyIndex(onsets[idx-1],circumstances.numNotes)
                let curFreq =  getOnsetFrequencyIndex(onsets[idx],circumstances.numNotes)
                if(prevFreq == curFreq)
                {
                    return false
                }
            } 
        }
        return true
    }))
    return leaders.map((pidx,idx) => {
        if (idx < leaders.length-1) {
            let endIdx = leaders[idx + 1] - 1
            let endTime = onsets[endIdx].time
            return {endTime:endTime, index:pidx,onset:onsets[pidx]}
        }
        return {endTime:onsets[idx].time,index:pidx,onset:onsets[pidx]}
    })
    
}