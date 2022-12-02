const core = require('@actions/core');
const puppeteer = require('puppeteer');
const os = require("os");
const path = require("path");

const catchConsole = async function (page) {
    page.on("pageerror", function (err) {
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
    switch (type) {
        case 'Windows_NT': {
            const programFiles = process.env.PROGRAMFILES;
            browserPath = path.join(programFiles, 'Google/Chrome/Application/chrome.exe');
            break;
        }
        case 'Darwin': {
            browserPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
            break;
        }
        case 'Linux':
        default: {
            browserPath = '/usr/bin/google-chrome';
            // browserPath = '/usr/bin/chromium-browser';
            break;
        }
    }
    core.debug('Browser path: ' + browserPath);
    return browserPath;
}

const puppetRun = async function (parameters) {
    core.info('Puppet run new.');

    const scriptBefore = parameters['scriptBefore'];
    const urls = [parameters['url']];

    // TODO make it right
    const launchOptions = {
        executablePath: await getBrowserPath(),
        // args: ['--no-sandbox'],
        defaultViewport: { width: 1920, height: 1080 },
        // headless: true
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
            let result = undefined;

            let response;
            try {
                response = await page.goto(url, {waitUntil: "networkidle2"});
                // await page.waitFor(3000);    
            } catch (error) {
                console.log('page.goto() resulted in error: ' + error);
                core.setFailed(error.message)
                result = {"error": error.message};
            }

            if (response) {
                if (scriptBefore) {
                    core.info('Using scriptBefore parameter.');

                    const runMyScript = require('./script.js');
                    try {
                        result = await runMyScript(page, scriptBefore);
                    } catch (error) {
                        core.error(`Error in scriptBefore: ${error.message}`);
                        core.setFailed(error.message); // XXX TODO shouldn't I return a Promise in the first place and then reject it?
                    }
                    core.info(`Result: ${result}`);
                }
                const fullPageRequired = parameters.mode === "wholePage";
                const fullPage = parameters.mode === "wholePage";
                core.debug('fullPageRequired ' + fullPageRequired);
                core.info("fullPage: " + fullPage);
                const screenshotOptions = {path: parameters.output, fullPage}
                core.info("Screenshot options: " + JSON.stringify(screenshotOptions));
                await page.screenshot(screenshotOptions);
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
