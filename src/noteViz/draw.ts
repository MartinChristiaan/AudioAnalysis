import { IArcDrawable, Particle, Circumstances, V2 } from "./interfaces";
import {ctx}  from "../main"
import { rgba, getNoteColorRaw } from "../colors";

export function drawParticle(particle: IArcDrawable, fill,screenShake:V2) {
    
    let {position,size} = particle
    
    // ctx.beginPath();
    // ctx.moveTo(position.x, position.y);
    // ctx.lineTo(position.x, position.y - 60);
    // ctx.strokeStyle = trailfill
    // ctx.stroke();


    ctx.beginPath();
    ctx.arc(position.x + screenShake.x,position.y + screenShake.y, size, 0, Math.PI * 2, false);
    
   
    ctx.fillStyle = fill
    ctx.fill();
    ctx.restore();


   // console.log(position)
}

// export function getfill(particle : Particle,{numNotes,level} : Circumstances) {

//     let percent = (Math.round(particle.onset.frequency / 11.0 * numNotes) + .5) / numNotes
//     let color : rgba = getNoteColorRaw(percent, level)
//     color.a = particle.alpha 
//     let {x,y} = particle.position
//     let {alpha,size} = particle
//     var gradient = ctx.createRadialGradient(x, y, 0.1, x, y, size);
//     gradient.addColorStop(0.1, "rgba(255,255,255," + alpha + ")");
//     gradient.addColorStop(0.8,color.getHTMLValue() );
//     let lowAlphaColor = new rgba(color.r,color.g,color.b,alpha*0.1).getHTMLValue()
//     gradient.addColorStop(1, lowAlphaColor);
//     return gradient;
// }
