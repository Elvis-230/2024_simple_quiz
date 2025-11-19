import ScoreController from './ScoreController';

describe('ScoreController', () => {
    let controller;

    beforeEach(() => {
        controller = new ScoreController();
    });

    describe('initialization', () => {
        test('should initialize with score and count of 0', () => {
            expect(controller.getScore()).toBe(0);
            expect(controller.getCount()).toBe(0);
        });
    });

    describe('incrementScore', () => {
        test('should increment both score and count', () => {
            controller.incrementScore();
            expect(controller.getScore()).toBe(1);
            expect(controller.getCount()).toBe(1);
        });

        test('should increment multiple times correctly', () => {
            controller.incrementScore();
            controller.incrementScore();
            controller.incrementScore();
            expect(controller.getScore()).toBe(3);
            expect(controller.getCount()).toBe(3);
        });
    });

    describe('incrementCount', () => {
        test('should increment only count, not score', () => {
            controller.incrementCount();
            expect(controller.getScore()).toBe(0);
            expect(controller.getCount()).toBe(1);
        });

        test('should increment multiple times correctly', () => {
            controller.incrementCount();
            controller.incrementCount();
            expect(controller.getScore()).toBe(0);
            expect(controller.getCount()).toBe(2);
        });
    });

    describe('mixed operations', () => {
        test('should track correct and incorrect answers properly', () => {
            controller.incrementScore();
            controller.incrementCount();
            controller.incrementScore();
            controller.incrementCount();
            controller.incrementCount();

            expect(controller.getScore()).toBe(2);
            expect(controller.getCount()).toBe(5);
        });
    });

    describe('getFormattedScore', () => {
        test('should return formatted score as "score/count"', () => {
            controller.incrementScore();
            controller.incrementScore();
            controller.incrementCount();
            expect(controller.getFormattedScore()).toBe('2/3');
        });

        test('should handle 0 score', () => {
            expect(controller.getFormattedScore()).toBe('0/0');
        });
    });

    describe('getPercentage', () => {
        test('should return 0 when count is 0', () => {
            expect(controller.getPercentage()).toBe(0);
        });

        test('should calculate percentage correctly', () => {
            controller.incrementScore();
            controller.incrementScore();
            controller.incrementCount();
            // 2/3 = 66.67% rounds to 67%
            expect(controller.getPercentage()).toBe(67);
        });

        test('should return 100 for perfect score', () => {
            controller.incrementScore();
            controller.incrementScore();
            controller.incrementScore();
            expect(controller.getPercentage()).toBe(100);
        });

        test('should return 0 for no correct answers', () => {
            controller.incrementCount();
            controller.incrementCount();
            controller.incrementCount();
            expect(controller.getPercentage()).toBe(0);
        });

        test('should return 50 for half correct', () => {
            controller.incrementScore();
            controller.incrementCount();
            expect(controller.getPercentage()).toBe(50);
        });
    });

    describe('reset', () => {
        test('should reset score and count to 0', () => {
            controller.incrementScore();
            controller.incrementScore();
            controller.incrementCount();

            controller.reset();

            expect(controller.getScore()).toBe(0);
            expect(controller.getCount()).toBe(0);
        });
    });

    describe('getScoreData', () => {
        test('should return object with all score data', () => {
            controller.incrementScore();
            controller.incrementScore();
            controller.incrementCount();

            const data = controller.getScoreData();

            expect(data.score).toBe(2);
            expect(data.count).toBe(3);
            expect(data.percentage).toBe(67);
            expect(data.formatted).toBe('2/3');
        });

        test('should return correct data after reset', () => {
            controller.incrementScore();
            controller.reset();

            const data = controller.getScoreData();

            expect(data.score).toBe(0);
            expect(data.count).toBe(0);
            expect(data.percentage).toBe(0);
            expect(data.formatted).toBe('0/0');
        });
    });
});
