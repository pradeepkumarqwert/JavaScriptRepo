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

(async function script2() {
    const caps = {
        platformName: 'iOS',
        deviceName: 'iPhone 14',
        platformVersion: '18.5',
        browserName: 'Safari'
    };

    const serverUrl = 'https://cloud.fireflink.com/backend/fireflinkcloud/wd/hub?accessKey=a31168ce-bf67-4a7a-bfa1-997fca75f65a&licenseId=LIC1026534&projectName=Time+Zone/';

    let driver = await new Builder().usingServer(serverUrl).withCapabilities(caps).build();
    try {
        await driver.get('https://www.wikipedia.org/');
        await driver.sleep(2000);

        const searchInput = await driver.findElement(By.id('searchInput'));
        await searchInput.sendKeys('iPhone');
        await driver.sleep(2000);

        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath('//h1'));

        console.log('Title after search:', await driver.getTitle());

        // Scroll
        await driver.executeScript('window.scrollBy(0, 500)');
        await driver.sleep(1000);
        await driver.executeScript('window.scrollBy(0, 500)');
        await driver.sleep(1000);

        const link = await driver.findElement(By.xpath("(//a[contains(@href,'Apple')])[1]"));
        await link.click();
        await driver.sleep(2000);

        const heading = await driver.findElement(By.tagName('h1'));
        console.log('Opened page:', await heading.getText());

        await driver.navigate().back();
        await driver.sleep(2000);
        console.log('Now on:', await driver.getCurrentUrl());

        await driver.navigate().refresh();
        await driver.sleep(2000);

    } catch (err) {
        console.error('Exception occurred:', err);
        await takeScreenshot(driver, '99_Exception_Occurred');
    } finally {
        await driver.quit();
    }
})();
