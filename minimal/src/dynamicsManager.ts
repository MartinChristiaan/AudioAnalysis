import { levelThresholds } from "./config";
import { Song } from "./song";
import { ScreenShaker } from "./screenshake";

export class DynamicsManager {
    speed: number;
    distance: number;
    speedLevelPercent: number;
    scoreLevelIdx: number;

    song: Song;
    topSpeed: number;
    screenshaker: ScreenShaker;
    levelThreshold: number;
    levelupsound: Howl;
    errorsound: Howl;
    hitSFX: Howl;
    score: number;
    // discrete levels for color
    // if level is complete you can no longer fall back return
    // do camera shake on level complete
    // dont lerp to color


    

    // Remember best distance for song
    constructor(song : Song,screenShaker : ScreenShaker) {
        this.speed = 0;
        this.score = 0;
        this.scoreLevelIdx = 0
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
        if (levelThresholds[levelThresholds.length - 1] < this.score) {
            this.scoreLevelIdx = levelThresholds.length - 1
        }
        for (let idx = 0; idx < levelThresholds.length - 1; idx++) {
            if (this.score > levelThresholds[idx] && this.score < levelThresholds[idx + 1]) {
                if (this.scoreLevelIdx<idx)
                {
                    this.scoreLevelIdx = idx
                    this.screenshaker.shakeDuration =40
                    this.levelupsound.play()
                    // level up
                }
                this.speedLevelPercent = (this.score - levelThresholds[idx]) / (levelThresholds[idx + 1] - levelThresholds[idx]);

            }
        }
        //this.distance += this.speed  
        // if (this.speed>this.topSpeed) {
        //     this.topSpeed = this.speed
        // }
        this.levelThreshold = levelThresholds[this.scoreLevelIdx]
    }
    applyBooster()
    {
        this.score+=30
    }

    hit() {
        this.score += 4 * this.song.e_cur; // accelerate more if energy is high
        this.hitSFX.play()
    }
    falsePositive() {
        // make instruments red
        console.log("false")
        this.errorsound.play()
        this.score -= 0.05*(this.score - levelThresholds[this.scoreLevelIdx]);
    }
    falseNegsative() {

        this.score -= 0.05*(this.score - levelThresholds[this.scoreLevelIdx]);
    }
}
