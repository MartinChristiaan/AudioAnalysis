import { Song } from "./songplayer";
import { levelThresholds } from "./config";
import { Scoremanager } from "./scoreManager";
import { rgb, lerpColors } from "./colors";
export class ScoreDrawer {
    scoreManager: Scoremanager;
    ctx: CanvasRenderingContext2D;
    song: Song;
    constructor(ctx: CanvasRenderingContext2D, scoremanager: Scoremanager, song: Song) {
        this.ctx = ctx;
        this.song = song;
        this.scoreManager = scoremanager;
    }
    frmt(num) {
        return Math.round((num + 0.0001) * 10) / 10;
    }
    drawProgressBar(value:number,low:number,high:number
                    ,xpos:number,ypos
                    ,maxWidth,maxHeight
                    ,fontsize,imsrc : string
                    ,colorLow : rgb
                    ,colorHigh : rgb ){
        this.ctx.font = fontsize.toString() + "px Arial";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
 

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
        } catch (error) {}
        const image = new Image(32, 32); // Using optional size for image
        image.src = imsrc
        this.ctx.drawImage(image,xpos - maxWidth/2 - 40,ypos -3,32,32)
        
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
            ,150,50,200,25,20,'../data/time.png',
            new rgb(218,34,255),new rgb(151,51,238)
            )
        console.log(this.scoreManager.multiplierScore)
        this.drawProgressBar(this.scoreManager.multiplierScore
            ,(this.scoreManager.level-1)*10
            ,this.scoreManager.level*10
            ,150,100,200,25,20,'../data/score.png',
            new rgb(238,9,121),new rgb(255,106,0))

        this.drawProgressBar(this.song.e_cur*2
            ,0
            ,1
            ,150,150,200,25,20,'../data/bolt.png',
            new rgb(241,39,17),new rgb(245,175,25))
        
               
        this.ctx.strokeText(this.scoreManager.level + "x", 100, 200);
//        this.ctx.strokeText("distance : " +  this.scoreManager.distance.toFixed(2), 100, 150);
        //this.ctx.strokeText("energy ; " +  this.song.e_cur.toFixed(2), 100, 200);


    }
}
