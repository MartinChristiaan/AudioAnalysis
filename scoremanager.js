


class ScoreManager {
    score;
    constructor() {
        this.score = 0

    }

    getSpeed()// continous
    {
        for (let idx = 0; idx < level_thresholds.length; idx++) {
            if (this.score > level_thresholds[idx]) {
                if (idx < level_thresholds.length - 1) {
                    return idx + (this.score - level_thresholds[idx]) / (level_thresholds[idx + 1] - level_thresholds[idx])
                }
                else {
                    return idx
                }
            }
        }
        return 0
    }
    hit() {
        this.score += 2
    }
    falsePositive() {
        this.score -= 0.1 * this.score
    }
    falseNegsative() {
        this.score -= 0.1 * this.score
    }
}



