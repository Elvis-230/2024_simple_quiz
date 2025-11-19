/**
 * ScoreController handles all quiz scoring logic
 * Manages score tracking, incrementing, and calculation
 */
class ScoreController {
    constructor() {
        this.score = 0;
        this.count = 0;
    }

    /**
     * Increment both score and count (for correct answers)
     */
    incrementScore() {
        this.score += 1;
        this.count += 1;
    }

    /**
     * Increment only count (for incorrect answers)
     */
    incrementCount() {
        this.count += 1;
    }

    /**
     * Get current score
     */
    getScore() {
        return this.score;
    }

    /**
     * Get total count of questions answered
     */
    getCount() {
        return this.count;
    }

    /**
     * Get score as a formatted string
     */
    getFormattedScore() {
        return `${this.score}/${this.count}`;
    }

    /**
     * Calculate percentage score
     */
    getPercentage() {
        if (this.count === 0) {
            return 0;
        }
        return Math.round((this.score / this.count) * 100);
    }

    /**
     * Reset score and count
     */
    reset() {
        this.score = 0;
        this.count = 0;
    }

    /**
     * Get all score data as an object
     */
    getScoreData() {
        return {
            score: this.score,
            count: this.count,
            percentage: this.getPercentage(),
            formatted: this.getFormattedScore()
        };
    }
}

export default ScoreController;
