const core = require('@actions/core');
const puppeteer = require('puppeteer');

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

const puppetRun = async function (parameters) {
    core.info('Puppet run.');

    const scriptBefore = parameters['scriptBefore'];
    const urls = [parameters['url']];

    // TODO make it right
    const launchOptions = {
        executablePath: 'google-chrome-stable',
        args: ['--no-sandbox'],
        headless: true
    }

    // make promises for all required shots
    const promises = urls.map(
        async (url) => {
            // start the headless browser
            const browser = await puppeteer.launch(launchOptions);
            const page = await browser.newPage();
            // capture browser console, if required
            await catchConsole(page);

            // for result construction
            let result = undefined;

            let response;
            try {
                response = await page.goto(url);
            } catch (error) {
                console.log('page.goto() resulted in error: ' + error);
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
                await page.screenshot({path: parameters.output, fullPage: false});
            }

            await browser.close();

            return result;
        });


    const results = await Promise.all(promises);

    const resultObject = results.map((result, index) => {
        return {url: urls[index], result: result};
    });

    core.debug(`resultObject: ${JSON.stringify(resultObject)}`);
    return resultObject;
};

module.exports = {catchConsole, puppetRun};
