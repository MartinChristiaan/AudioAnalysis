import { levelThresholds } from "./config";

export class ScoreManager {
    score: number;
    constructor() {
        this.score = 0;
    }
    getSpeed() {
        for (let idx = 0; idx < levelThresholds.length; idx++) {
            if (this.score > levelThresholds[idx]) {
                if (idx < levelThresholds.length - 1) {
                    return idx + (this.score - levelThresholds[idx]) / (levelThresholds[idx + 1] - levelThresholds[idx]);
                }
                else {
                    return idx;
                }
            }
        }
        return 0;
    }
    hit() {
        this.score += 2;
    }
    falsePositive() {
        this.score -= 0.1 * this.score;
    }
    falseNegsative() {
        this.score -= 0.1 * this.score;
    }
}
