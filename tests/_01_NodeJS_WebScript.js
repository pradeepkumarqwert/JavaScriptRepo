const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function takeScreenshot(driver, fileName) {
    try {
        const image = await driver.takeScreenshot();
        const dir = path.join(__dirname, 'SimpleRunScreenshots');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = path.join(dir, `${fileName}.png`);
        fs.writeFileSync(filePath, image, 'base64');
        console.log(`Screenshot saved: ${filePath}`);
    } catch (err) {
        console.log(`Screenshot failed: ${err.message}`);
    }
}

(async function groundedScript() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // --------------------------
        // 1. Navigate to Google
        // --------------------------
        await driver.get('https://www.google.com');
        await takeScreenshot(driver, '01_Google_Page');

        // --------------------------
        // 2. Navigate to Pantaloons Landing Page
        // --------------------------
        await driver.get('https://www.pantaloons.com');
        await takeScreenshot(driver, '02_Pantaloons_Landing');

        await driver.sleep(2000);

        // --------------------------
        // 3. Validate Pantaloons Logo
        // --------------------------
        const logo = await driver.findElement(By.xpath("//div[@class='nav-header-container']//img[@class='svgIconImg' and @alt='logoIcon']"));
        const isDisplayed = await logo.isDisplayed();
        console.log(isDisplayed ? 'Pantaloons logo is displayed' : 'Pantaloons logo is not displayed');
        await takeScreenshot(driver, '03_Logo_Visible');

        // --------------------------
        // 4. Search for Shirts
        // --------------------------
        const searchBar = await driver.findElement(By.xpath("//div[@class='nav-links']//input[@placeholder='Search']"));
        await searchBar.click();
        await searchBar.sendKeys('Shirts');
        await takeScreenshot(driver, '04_Typed_Search');

        await driver.sleep(2000);
        await searchBar.sendKeys(Key.ENTER);
        await takeScreenshot(driver, '05_Search_Results');

        await driver.sleep(4000);

        // --------------------------
        // 5. Apply Gender Filter → Boys
        // --------------------------
        const filterGender = await driver.findElement(By.xpath("//p[text()='Gender']"));
        await filterGender.click();
        await takeScreenshot(driver, '06_Gender_Filter_Clicked');

        const boysCheckbox = await driver.findElement(By.xpath("//p[text()='Boys']//ancestor::div[contains(@class,'PlpWeb_filter-values')]//input"));
        await boysCheckbox.click();
        await takeScreenshot(driver, '07_Boys_Filter_Clicked');

        await driver.sleep(3000);

        // --------------------------
        // 6. Clear / Select filters
        // --------------------------
        const clearBtn = await driver.findElement(By.xpath("//button[@id=':r6:']"));
        await clearBtn.click();
        await takeScreenshot(driver, '08_Filter_Clear');

        console.log('Test execution completed successfully.');

    } catch (err) {
        console.error(err);
    } finally {
        // --------------------------
        // 7. Quit Browser
        // --------------------------
        await driver.quit();
    }
})();
