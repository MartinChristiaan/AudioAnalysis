import { ctx } from "./main"


export class ScreenShaker {
    shakeDuration: number
    isShaking: boolean
    prevx: number
    amplitude: number
    prevy: number
    x: number
    y: number
    constructor() {
        this.shakeDuration = 0
        this.amplitude = 10
        this.prevx = 0
        this.prevy = 0
        this.x = 0
        this.y = 0

    }
    update() {
        if (this.shakeDuration >0) {
            if (this.shakeDuration == 1) {
                this.x = 0
                this.y = 0
            }
            else {

                var dx = Math.random() * this.amplitude
                var dy = Math.random() * this.amplitude
                this.x = dx - this.prevx
                this.y = dy - this.prevy
//                ctx.translate(dx - this.prevx, dy - this.prevy)
                this.prevx = dx - this.prevx
                this.prevy = dy - this.prevy
            }
            this.shakeDuration--
        }
    }
}


// export function screenshake(intensity : number,frequency:number,duration:number)
// {

// }