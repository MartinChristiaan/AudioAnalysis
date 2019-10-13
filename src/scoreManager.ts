import { Song } from "./song";
import { ScreenShaker } from "./screenshake";

export class Scoremanager {

    multiplierLevelPercent= 0
    multiplierScore = 0    

    score= 0;
    level= 1
        
    song: Song;
    screenshaker: ScreenShaker;

    levelupsound: Howl;
    errorsound: Howl;
    hitSFX: Howl;
    
    // Remember best distance for song
    constructor(song : Song,screenShaker : ScreenShaker) {
        this.song = song
        this.screenshaker = screenShaker
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
    levelUp()
    {
        this.screenshaker.shakeDuration =40
        this.levelupsound.play()
    }
    update() {
        let newLevel = Math.floor(this.multiplierScore/10)+1
        if (this.level<newLevel) {
            this.levelUp()      
        }
        this.level = Math.max(0,newLevel)
        this.multiplierLevelPercent = this.multiplierScore/10%1        
    }
    applyBooster()
    {
        this.multiplierScore+=30
    }

    hit() {
        this.score += this.level + this.song.e_cur * 4; // accelerate more if energy is high
        this.multiplierScore += 1
        this.hitSFX.play()
    }
    falsePositive() {
        // make instruments red
        console.log("false")
        this.errorsound.play()
        this.multiplierScore -= 10
        this.multiplierScore = Math.max(0,this.multiplierScore)
        // 0.05*(this.score - levelThresholds[this.multiplierLevelIdx]);
    }
    falseNegsative() {

        this.multiplierScore -= 10 // depend on gear 
        this.multiplierScore = Math.max(0,this.multiplierScore)
//      this.score -= 0.05*(this.score - levelThresholds[this.multiplierLevelIdx]);
    }
}
