import { levelThresholds } from "./config";
import { Song } from "./song";
import { ScreenShaker } from "./screenshake";

export class DynamicsManager {
    speed: number;
    distance: number;
    speedLevelPercent: number;
    speedLevelIdx: number;

    song: Song;
    topSpeed: number;
    screenshaker: ScreenShaker;
    levelThreshold: number;
    levelupsound: Howl;
    errorsound: Howl;
    hitSFX: Howl;
    // discrete levels for color
    // if level is complete you can no longer fall back return
    // do camera shake on level complete
    // dont lerp to color


    

    // Remember best distance for song
    constructor(song : Song,screenShaker : ScreenShaker) {
        this.speed = 0;
        this.speedLevelIdx = 0
        this.speedLevelPercent = 0
        this.distance = 0;
        this.song = song
        this.topSpeed = 0
        this.screenshaker = screenShaker
        this.levelThreshold = levelThresholds[0]
        this.levelupsound =new Howl({
            src: ['../sfx/impact.wav']
          });
        this.errorsound =new Howl({
            src: ['../sfx/error.wav']
          });
          this.hitSFX =new Howl({
            src: ['../sfx/breaker.wav']
          });
    }

    update() {
        // determine speed from thresholds 
        // at max?
        if (levelThresholds[levelThresholds.length - 1] < this.speed) {
            this.speedLevelIdx = levelThresholds.length - 1
        }
        for (let idx = 0; idx < levelThresholds.length - 1; idx++) {
            if (this.speed > levelThresholds[idx] && this.speed < levelThresholds[idx + 1]) {
                if (this.speedLevelIdx<idx)
                {
                    this.speedLevelIdx = idx
                    this.screenshaker.shakeDuration =40
                    this.levelupsound.play()
                    // level up
                }
                this.speedLevelPercent = (this.speed - levelThresholds[idx]) / (levelThresholds[idx + 1] - levelThresholds[idx]);

            }
        }
        this.distance += this.speed  
        if (this.speed>this.topSpeed) {
            this.topSpeed = this.speed
        }
        this.levelThreshold = levelThresholds[this.speedLevelIdx]
    }
    applyBooster()
    {
        this.speed+=30
    }

    hit() {
        this.speed += 4 * this.song.e_cur; // accelerate more if energy is high
        this.hitSFX.play()
    }
    falsePositive() {
        // make instruments red
        console.log("false")
        this.errorsound.play()
        this.speed -= 0.05*(this.speed - levelThresholds[this.speedLevelIdx]);
    }
    falseNegsative() {

        this.speed -= 0.05*(this.speed - levelThresholds[this.speedLevelIdx]);
    }
}
