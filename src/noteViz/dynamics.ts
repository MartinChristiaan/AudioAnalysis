import { Onset } from "../types/types";
import { V2, Particle, IArcDrawable, Circumstances } from "./interfaces";
import { canvas, ctx } from "../main";
import { rgba, getNoteColorRaw } from "../colors";
import { percentInWindow } from "../util/funUtil";
import { LeadParticle } from "./state";

export function calculatePositions(onset: Onset, {margin,currentTime,numNotes} : Circumstances): V2 {
    let percentTravelled = percentInWindow(2, 2 / 2, currentTime, onset.time)
    let y = innerHeight - (percentTravelled * innerHeight);
    let x = (Math.round(onset.frequency / 11.0 * (numNotes-1)) + .5) * canvas.width / numNotes
    return { x: x, y: y }
}


let drag = 0.1
let dt = 0.016 * 4

export function updateExplosionParticle(particle:Particle){
    let newX = particle.position.x + particle.velocity.x * dt
    let newY = particle.position.y + particle.velocity.y * dt
    let newVx = particle.velocity.x - drag * particle.velocity.x * dt
    let newVy = particle.velocity.y - drag * particle.velocity.y * dt + 9.81 * dt // gravity
    let alpha = particle.alpha - drag*dt
    //let fill = getfill(particle,circumstances) 
    return new Particle(newX,newY,newVx,newVy,alpha,particle.size,particle.onset)
}


export function createAliveParticle(onset:Onset,circumstances : Circumstances) : IArcDrawable
{
    let position = calculatePositions(onset, circumstances)
    return {position:position,size:10 + 10 * onset.energy,onset:onset} 
}

export function createMissedParticle(onset:Onset, circumstances : Circumstances) : IArcDrawable
{
    let position = calculatePositions(onset,circumstances)    
    position.y = Math.min(position.y,innerHeight)
    return {position:position,size:10 + 10 * onset.energy,onset:onset} 
}

export function getMissedFill({position,size}:IArcDrawable)
{
    let alpha = 255
    let color : rgba = new rgba(255,0,0,alpha)
    color.a = alpha
    let {x,y} = position

    var gradient = ctx.createRadialGradient(x, y, 0.1, x, y, size);
    gradient.addColorStop(0.1, "rgba(255,255,255,0)");
    gradient.addColorStop(0.8,"rgba(255,0,0,1)");
    gradient.addColorStop(0,"rgba(255,0,0,0.1)");
    return gradient
    
}

export function getTrailFill({position,size,onset}:IArcDrawable,circumstances : Circumstances)
{
    let percent = Math.round(onset.frequency / 11.0 * circumstances.numNotes) / circumstances.numNotes 
    let color = getNoteColorRaw(percent,circumstances.level)
    return color.getHTMLValue()
}

export function getFill({position,size,onset}:IArcDrawable,circumstances : Circumstances,alpha)
{
    let percent = Math.round(onset.frequency / 11.0 * circumstances.numNotes) / circumstances.numNotes 
    let color = getNoteColorRaw(percent,circumstances.level)
    color.a = alpha
    let {x,y} = position

    var gradient = ctx.createRadialGradient(x, y, 0.1, x, y, size);
    gradient.addColorStop(0.1, "rgba(255,255,255," + 0 + ")");
    gradient.addColorStop(0.8,color.getHTMLValue() );

    let lowAlphaColor = new rgba(color.r,color.g,color.b,alpha*0.1).getHTMLValue()
    gradient.addColorStop(1, lowAlphaColor);
    return gradient
}

export function getExplosionFill({position,size,onset}:IArcDrawable,circumstances : Circumstances,alpha)
{
    let percent = Math.round(onset.frequency / 11.0 * circumstances.numNotes) / circumstances.numNotes 
    let color = getNoteColorRaw(percent,circumstances.level)
    color.a = alpha
    let {x,y} = position

    var gradient = ctx.createRadialGradient(x, y, 0.1, x, y, size);
    gradient.addColorStop(0.1, "rgba(255,255,255," + 1+ ")");
    gradient.addColorStop(0.8,color.getHTMLValue() );
    let lowAlphaColor = new rgba(color.r,color.g,color.b,alpha*0.1).getHTMLValue()
    gradient.addColorStop(1, lowAlphaColor);
    return gradient
}
