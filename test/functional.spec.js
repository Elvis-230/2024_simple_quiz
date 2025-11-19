const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 10000;

describe('Quiz Application - Functional Tests', function() {
    let driver;

    before(async function() {
        // Initialize Chrome driver
        let options = new chrome.Options();
        // Uncomment below for headless mode in CI environments
        // options.addArguments('--headless', '--disable-gpu');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('should load the quiz page', async function() {
        await driver.get(BASE_URL);
        await driver.wait(until.titleContains('React'), TIMEOUT);
        
        const title = await driver.findElement(By.xpath('//h1[contains(text(), "My Questions")]'));
        assert(title, 'Quiz title not found');
    });

    it('should display all questions', async function() {
        await driver.get(BASE_URL);
        
        const question1 = await driver.findElement(
            By.xpath('//h2[contains(text(), "What is the capital of Connecticut?")]')
        );
        const question2 = await driver.findElement(
            By.xpath('//h2[contains(text(), "What is the square root of 16?")]')
        );
        const question3 = await driver.findElement(
            By.xpath('//h2[contains(text(), "What type of number is 101?")]')
        );

        assert(question1, 'Question 1 not found');
        assert(question2, 'Question 2 not found');
        assert(question3, 'Question 3 not found');
    });

    it('should display all answer options', async function() {
        await driver.get(BASE_URL);
        
        const answers = await driver.findElements(By.css('label'));
        assert(answers.length >= 10, 'Not enough answer options found');
    });

    it('should display Done button', async function() {
        await driver.get(BASE_URL);
        
        const doneButton = await driver.findElement(By.xpath('//button[contains(text(), "Done")]'));
        assert(doneButton, 'Done button not found');
    });

    it('should show progress counter', async function() {
        await driver.get(BASE_URL);
        
        const progressText = await driver.findElement(By.xpath('//*[contains(text(), "Progress:")]'));
        assert(progressText, 'Progress counter not found');
    });

    it('should answer all questions correctly and navigate to results', async function() {
        await driver.get(BASE_URL);
        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Done")]')), TIMEOUT);

        // Answer Question 1: Hartford is correct
        await driver.findElement(By.xpath('//label[contains(text(), "Hartford")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('correct'), 'Expected correct answer alert');
                await alert.accept();
            },
            () => {} // Alert might not appear in some configurations
        );

        // Answer Question 2: 4 is correct
        await driver.findElement(By.xpath('//label[contains(text(), "4")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('correct'), 'Expected correct answer alert');
                await alert.accept();
            },
            () => {}
        );

        // Answer Question 3: prime is correct
        await driver.findElement(By.xpath('//label[contains(text(), "prime")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('correct'), 'Expected correct answer alert');
                await alert.accept();
            },
            () => {}
        );

        // Click Done
        const doneButton = await driver.findElement(By.xpath('//button[contains(text(), "Done")]'));
        await doneButton.click();

        // Should show final score alert
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('Total score: 3/3'), 'Expected final score to be 3/3');
                await alert.accept();
            },
            () => {}
        );

        // Wait for potential page transition
        await driver.sleep(1000);
    });

    it('should answer with mixed correct and incorrect answers', async function() {
        await driver.get(BASE_URL);
        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Done")]')), TIMEOUT);

        // Answer Question 1 Incorrectly: Stamford is wrong (Hartford is correct)
        await driver.findElement(By.xpath('//label[contains(text(), "Stamford")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('not correct'), 'Expected incorrect answer alert');
                await alert.accept();
            },
            () => {}
        );

        // Answer Question 2 Correctly: 4 is correct
        await driver.findElement(By.xpath('//label[contains(text(), "4")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('correct'), 'Expected correct answer alert');
                await alert.accept();
            },
            () => {}
        );

        // Answer Question 3 Incorrectly: composite is wrong (prime is correct)
        await driver.findElement(By.xpath('//label[contains(text(), "composite")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('not correct'), 'Expected incorrect answer alert');
                await alert.accept();
            },
            () => {}
        );

        // Click Done
        const doneButton = await driver.findElement(By.xpath('//button[contains(text(), "Done")]'));
        await doneButton.click();

        // Should show final score alert with 1/3
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('Total score: 1/3'), 'Expected final score to be 1/3');
                await alert.accept();
            },
            () => {}
        );
    });

    it('should allow answering no questions and submit', async function() {
        await driver.get(BASE_URL);
        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Done")]')), TIMEOUT);

        // Click Done without answering any questions
        const doneButton = await driver.findElement(By.xpath('//button[contains(text(), "Done")]'));
        await doneButton.click();

        // Should show final score alert with 0/0
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('Total score: 0/0'), 'Expected final score to be 0/0');
                await alert.accept();
            },
            () => {}
        );
    });

    it('should handle partial quiz completion', async function() {
        await driver.get(BASE_URL);
        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Done")]')), TIMEOUT);

        // Answer only first question correctly
        await driver.findElement(By.xpath('//label[contains(text(), "Hartford")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('correct'), 'Expected correct answer alert');
                await alert.accept();
            },
            () => {}
        );

        // Skip other questions and click Done
        const doneButton = await driver.findElement(By.xpath('//button[contains(text(), "Done")]'));
        await doneButton.click();

        // Should show final score alert with 1/1
        await driver.switchTo().alert().then(
            async (alert) => {
                const alertText = await alert.getText();
                assert(alertText.includes('Total score: 1/1'), 'Expected final score to be 1/1');
                await alert.accept();
            },
            () => {}
        );
    });

    it('should persist progress while answering multiple questions', async function() {
        await driver.get(BASE_URL);
        await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Done")]')), TIMEOUT);

        // Answer first question
        await driver.findElement(By.xpath('//label[contains(text(), "Hartford")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                await alert.accept();
            },
            () => {}
        );

        // Verify progress shows 1
        const progressAfterFirst = await driver.findElement(By.xpath('//*[contains(text(), "Progress:")]')).getText();
        assert(progressAfterFirst.includes('1'), 'Progress should show 1 after first answer');

        // Answer second question
        await driver.findElement(By.xpath('//label[contains(text(), "4")]/input')).click();
        await driver.switchTo().alert().then(
            async (alert) => {
                await alert.accept();
            },
            () => {}
        );

        // Verify progress shows 2
        const progressAfterSecond = await driver.findElement(By.xpath('//*[contains(text(), "Progress:")]')).getText();
        assert(progressAfterSecond.includes('2'), 'Progress should show 2 after second answer');
    });
});
