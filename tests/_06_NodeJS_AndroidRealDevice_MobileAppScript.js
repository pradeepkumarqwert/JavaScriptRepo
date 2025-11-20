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

(async function script3() {
    const caps = {
        platformName: 'Android',
        deviceName: 'Vivo V40 Pro',
        platformVersion: '14',
        app: 'General-Store-final (1).apk'
    };

    const serverUrl = 'https://cloud.fireflink.com/backend/fireflinkcloud/wd/hub?accessKey=aeedf5e8-d698-4876-9ab0-aeab6a084b86&licenseId=LIC1026493&projectName=Project+for+Demo/';

    let driver = await new Builder().usingServer(serverUrl).withCapabilities(caps).build();

    try {
        // Select country
        const countryDropdown = await driver.findElement(By.xpath("//android.widget.Spinner[@resource-id='com.androidsample.generalstore:id/spinnerCountry']"));
        await countryDropdown.click();
        await takeScreenshot(driver, '01_CountryDropdown_Click');
        await driver.sleep(1000);

        const countryOption = await driver.findElement(By.xpath("//android.widget.TextView[@resource-id='android:id/text1' and @text='Afghanistan']"));
        await countryOption.click();
        await takeScreenshot(driver, '02_Country_Selected');

        // Enter name
        const nameField = await driver.findElement(By.xpath("//android.widget.EditText[@resource-id='com.androidsample.generalstore:id/nameField']"));
        await nameField.sendKeys('Tester1');
        await takeScreenshot(driver, '03_Name_Entered');
        await driver.hideKeyboard();

        // Select gender
        await driver.findElement(By.xpath("//android.widget.RadioButton[@resource-id='com.androidsample.generalstore:id/radioMale']")).click();
        await takeScreenshot(driver, '04_Gender_Selected');

        // Click Lets Shop
        await driver.findElement(By.xpath("//android.widget.Button[@resource-id='com.androidsample.generalstore:id/btnLetsShop']")).click();
        await takeScreenshot(driver, '05_LetsShop_Clicked');
        await driver.sleep(2000);

        // Add product to cart
        await driver.findElement(By.xpath("//android.widget.TextView[@text='Air Jordan 4 Retro']/following-sibling::android.widget.LinearLayout//android.widget.TextView[@resource-id='com.androidsample.generalstore:id/productAddCart']")).click();
        await takeScreenshot(driver, '06_Product_Added');
        await driver.sleep(1000);

        // Open Cart
        await driver.findElement(By.xpath("//android.widget.ImageButton[@resource-id='com.androidsample.generalstore:id/appbar_btn_cart']")).click();
        await takeScreenshot(driver, '07_Cart_Page');

        console.log('Test execution completed successfully.');

    } catch (err) {
        console.error('Exception occurred:', err);
        await takeScreenshot(driver, '99_Exception');
    } finally {
        await driver.quit();
    }
})();
