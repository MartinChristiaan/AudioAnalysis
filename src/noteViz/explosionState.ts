import { argWhere } from "../util/funUtil"
import { NoteState } from "../hitDetection"
import { rgba } from "../colors"
import { explosionParticles } from "./config"
import { Particle, Circumstances } from "./interfaces"
import { updateExplosionParticle, calculatePositions } from "./dynamics"

export function updateExplosionParticles(explodedParticles : Particle[][],params){
    let [songTime,states,onsets,numNotes,multiplier] = params
    let circumstances = {margin:2,numNotes:numNotes,currentTime:songTime,level:multiplier}
    if (states.length != explodedParticles.length) {
        return new Array(states.length).fill(0).map(x => new Array(0))
    }

    argWhere(states,(x => x == NoteState.HIT)).forEach( idx => {
        if (explodedParticles[idx].length == 0) {
           
            explodedParticles[idx] = new Array(explosionParticles).fill(0).map(x => {
                let energy = onsets[idx].energy
                let particle : Particle = 
                    {velocity : {x: (Math.random()-.5)*800*energy ,y:(Math.random()-.5)*800*energy},
                    position : calculatePositions(onsets[idx],circumstances)
                    ,alpha:1
                    ,size:2 + energy*15
                    ,onset:onsets[idx]}  
                return particle
        }
        )}
        explodedParticles[idx] = explodedParticles[idx].map(particle => updateExplosionParticle(particle))
    })

    argWhere(states,(x => x==NoteState.DEAD)).forEach(idx =>{
        explodedParticles[idx] = []
    })
    return explodedParticles
}

           
