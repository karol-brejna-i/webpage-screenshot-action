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

    const beforeScript = parameters['beforeScript'];
    const urls = [parameters['url']];

    // XXX
    const launchOptions = {
        executablePath: 'google-chrome-stable',
        args: ['--no-sandbox'],
        headless: true
    }

    const results = await Promise.all(urls.map(
        async (url) => {
            // start the headless browser
            const browser = await puppeteer.launch(launchOptions);
            const page = await browser.newPage();
            // capture browser console, if required
            await catchConsole(page);

            await page.goto(url);

            let result = undefined;
            if (beforeScript) {
                core.info('Using beforeScript parameter.');

                const runMyScript = require('./script.js');
                result = await runMyScript(page, beforeScript);
                core.info(`Result: ${result}`);
            }

            await page.screenshot({path: parameters.output, fullPage: false});
            await browser.close();

            return result;
        }
    ));

    const resultObject = results.map((result, index) => {
        return {url: urls[index], result: result};
    });
    core.debug(`resultObject: ${JSON.stringify(resultObject)}`);
    return resultObject;
};

module.exports = {catchConsole, puppetRun};
