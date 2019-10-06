import { Song } from "./song";
import { levelThresholds } from "./config";
import { ScoreManager } from "./scoreManager";
export class ScoreDrawer {
    scoreManager: ScoreManager;
    ctx: CanvasRenderingContext2D;
    song: Song;
    constructor(ctx: CanvasRenderingContext2D, scoremanager: ScoreManager, song: Song) {
        this.ctx = ctx;
        this.song = song;
        this.scoreManager = scoremanager;
    }
    frmt(num) {
        return Math.round((num + 0.0001) * 10) / 10;
    }
    drawScore(speed) {
        this.ctx.lineWidth = 2;
        this.ctx.font = "30px Arial";
        this.ctx.strokeStyle = "white";
        console.log(this.scoreManager.score)
        console.log(speed)
        console.log(levelThresholds)
        this.ctx.strokeText(parseFloat(this.song.t_cur).toFixed(2) + " : " + this.song.duration.toString(), 100, 100);
        this.ctx.strokeText(this.scoreManager.score.toFixed(2) + " : " +  levelThresholds[Math.floor(speed+1)].toString(), 100, 200);
    }
}
