const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function takeScreenshot(driver, name) {
    const dir = path.join(__dirname, 'SimpleRunScreenshots');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${name}.png`);
    const image = await driver.takeScreenshot();
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`Screenshot saved: ${filePath}`);
}

(async function script1() {
    const caps = {
        platformName: 'Android',
        deviceName: 'Samsung Galaxy A12',
        platformVersion: '12',
        browserName: 'Chrome'
    };
    const serverUrl = '';

    let driver = await new Builder().usingServer(serverUrl).withCapabilities(caps).build();
    try {
        await driver.get('https://www.pantaloons.com/');
        await takeScreenshot(driver, '01_HomePage');
        await driver.sleep(3000);

        await driver.findElement(By.css('div.mobilesearchbox')).click();
        await takeScreenshot(driver, '02_After_Click_Search_Icon');
        await driver.sleep(2000);

        const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Search for products,brands and more...']"));
        await searchInput.sendKeys('Shirt');
        await takeScreenshot(driver, '03_After_Entering_Search');
        await driver.sleep(2000);

        await driver.findElement(By.xpath("(//mark[text()='Shirt'])[1]")).click();
        await takeScreenshot(driver, '04_After_Search_Result_Click');
        await driver.sleep(2000);

        await driver.findElement(By.css('span.cartSpriteIcon')).click();
        await takeScreenshot(driver, '05_Cart_Page');
        console.log('Page Title:', await driver.getTitle());

    } catch (err) {
        console.error('Exception occurred:', err);
        await takeScreenshot(driver, '99_Exception_Occurred');
    } finally {
        await driver.quit();
    }
})();
