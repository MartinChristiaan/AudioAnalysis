import { Song } from "./song";
import { levelThresholds } from "./config";
import { DynamicsManager } from "./dynamicsManager";
import { rgb, lerpColors } from "./colors";
export class ScoreDrawer {
    scoreManager: DynamicsManager;
    ctx: CanvasRenderingContext2D;
    song: Song;
    constructor(ctx: CanvasRenderingContext2D, scoremanager: DynamicsManager, song: Song) {
        this.ctx = ctx;
        this.song = song;
        this.scoreManager = scoremanager;
    }
    frmt(num) {
        return Math.round((num + 0.0001) * 10) / 10;
    }
    drawProgressBar(value:number,low:number,high:number,xpos:number,ypos,maxWidth,maxHeight,fontsize){
        this.ctx.font = fontsize.toString() + "px Arial";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        var colorLow = new rgb(0,0,255)
        var colorHigh = new rgb (255,0,0)

        //this.ctx.strokeText(low.toFixed(2), xpos - maxWidth/2, ypos);
        var percent = (value-low)/(high-low)
        if (isNaN(percent)) {
            percent=0.01
        }
        var my_gradient = this.ctx.createLinearGradient(xpos - maxWidth/2, 0, xpos+ maxWidth/2,0);
        
        my_gradient.addColorStop(0, colorLow.getHTMLValue());
        my_gradient.addColorStop(1, colorHigh.getHTMLValue());

        this.ctx.fillStyle= my_gradient//
        this.ctx.fillRect(xpos - maxWidth/2,ypos,maxWidth*percent,maxHeight)
        if (value==undefined) {
            value = low

    
        }
        try {
            this.ctx.strokeText(value.toFixed(2), xpos -maxWidth/2, ypos + maxHeight -4);
            this.ctx.strokeText(high.toFixed(2), xpos + maxWidth/2 + 3, ypos + maxHeight - 4);
        } catch (error) {
            
        }
        
    }

    drawScore() {
        this.ctx.lineWidth = 2;
        this.ctx.font = "20px Arial";
        this.ctx.strokeStyle = "white";
        //console.log(this.scoreManager.speed)
        //console.log(levelThresholds)
//        this.ctx.strokeText(parseFloat(this.song.t_cur).toFixed(2) + " : " + this.song.duration.toString(), 100, 50);


        this.drawProgressBar(this.song.t_cur
            ,0
            ,this.song.duration
            ,150,50,200,25,20)


        this.drawProgressBar(this.scoreManager.score
            ,this.scoreManager.levelThreshold
            ,levelThresholds[this.scoreManager.scoreLevelIdx+1]
            ,150,100,200,25,20)

        this.drawProgressBar(this.song.e_cur
            ,0
            ,1
            ,150,150,200,25,20)
    
            
        //this.ctx.strokeText("speed : "  + this.scoreManager.speed.toFixed(2) + " : " +  levelThresholds[this.scoreManager.speedLevelIdx + 1].toString(), 100, 100);
//        this.ctx.strokeText("distance : " +  this.scoreManager.distance.toFixed(2), 100, 150);
        //this.ctx.strokeText("energy ; " +  this.song.e_cur.toFixed(2), 100, 200);


    }
}
