const core = require('@actions/core');
const puppeteer = require('puppeteer-core'); // TODO check using puppeteer-core
const os = require('os');
const path = require('path');

const catchConsole = async function (page) {
    page.on('pageerror', function (err) {
        core.info(`Page error: ${err.toString()}`);
    });

    page.on('error', function (err) {
        core.info(`Error: ${err.toString()}`);
    });

    page.on('console', function (message) {
        core.info(`>${message.text()}`);
    });
};


const getBrowserPath = async function () {
    const type = os.type();

    let browserPath;
    if (type === 'Windows_NT') {
        browserPath = path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe');
    } else if (type === 'Darwin') {
        browserPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else {
        browserPath = '/usr/bin/google-chrome';
    }
    core.debug('Browser path: ' + browserPath);
    return browserPath;
}

const takePageScreenshot = async function (page, parameters) {
    core.info(`Take page's screenshot.`);
    const screenshotOptions = {path: parameters.output, fullPage: parameters.mode === 'wholePage'}
    core.info(`Screenshot options: ${JSON.stringify(screenshotOptions)}`);
    await page.screenshot(screenshotOptions);
    return true;
}

const getElement = async function(parameters, page) {
    let element = undefined
    if (parameters.selector) {
        element = await page.$(parameters.selector);
    } else if (parameters.xpath) {
        const elements = await page.$x(parameters.xpath);
        element = elements[0];
    } else {
        core.error('No selector or xpath provided.');
    }
    return element;
}
const scrollToElementScreenshot = async function (page, parameters) {
    core.info(`Scroll to element and screenshot.`);
    let element;
    element = await getElement(parameters, page);
    core.debug(`Element: ${element}`);
    if (!element) {
        core.warning('Element not found.');
        return false;
    } else {
        // scroll to element
        await page.evaluate(el => el.scrollIntoView(), element);
        await takePageScreenshot(page, parameters);
        return true;
    }
}

const takeElementScreenshot = async function (page, parameters) {
    core.info(`Take element's screenshot.`);
    let element;
    element = await getElement(parameters, page);
    core.debug(`Element: ${element}`);
    if (!element) {
        core.warning('Element not found.');
        return false;
    } else {
        await element.screenshot({path: parameters.output});
        return true;
    }
}

const puppetRun = async function (parameters) {
    core.info('Puppet run new.');

    const scriptBefore = parameters['scriptBefore'];
    const urls = [parameters['url']];

    const width = parseInt(core.getInput('width')) | 800;
    const height = parseInt(core.getInput('height')) | 600;
    const launchOptions = {
        executablePath: await getBrowserPath(),
        defaultViewport: {width, height},
        headless: true
    }
    core.info('Launch options: ' + JSON.stringify(launchOptions));

    // start the headless browser
    const browser = await puppeteer.launch(launchOptions);

    // TODO: "Promise me, it will look more like an async javascript" -- Promise
    // make promises for all required shots
    const promises = urls.map(
        async (url) => {
            const page = await browser.newPage();

            // XXX TODO: DEBUG code:
            const version = await page.browser().version();
            core.info('Browser version: ' + version);

            // capture browser console, if required
            await catchConsole(page);

            // for result construction
            let result = {};

            let response;
            try {
                response = await page.goto(url, {waitUntil: 'networkidle2'});
            } catch (error) {
                console.log('page.goto() resulted in error: ' + error);
                core.setFailed(error.message);
                result = {error: error.message};
            }

            if (response) {
                if (scriptBefore) {
                    core.info('Using scriptBefore parameter.');

                    const runMyScript = require('./script.js');
                    try {
                        result = {script: await runMyScript(page, scriptBefore)};
                    } catch (error) {
                        core.error(`Error in scriptBefore: ${error.message}`);
                        core.setFailed(error.message); // XXX TODO shouldn't I return a Promise in the first place and then reject it?
                    }
                    core.info(`Result: ${JSON.stringify(result)}`);
                }

                let success;
                if (parameters.mode === 'page' || parameters.mode === 'wholePage') {
                    success = await takePageScreenshot(page, parameters);
                } else if (parameters.mode === 'element') {
                    success = await takeElementScreenshot(page, parameters);
                } else if (parameters.mode === 'scrollToElement') {
                    success = await scrollToElementScreenshot(page, parameters);
                }
                if (success) {
                    result.screenshot = parameters.output;
                }
            }

            return result;
        });

    const results = await Promise.all(promises);

    const resultObject = results.map((result, index) => {
        return {url: urls[index], result: result};
    });

    await browser.close();

    core.debug(`resultObject: ${JSON.stringify(resultObject)}`);
    return resultObject;
};

module.exports = {catchConsole, puppetRun};
