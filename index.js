const core = require('@actions/core');
const tools = require('./tools');

function catchConsole(page) {
    page.on("pageerror", function (err) {
        console.log(`Page error: ${err.toString()}`);
    });

    page.on('error', function (err) {
        console.log('error happen at the page: ', err);
    });
    page.on('console', message => console.log(`${message.text()}`));
}

async function run() {
    try {
        const parameters = await tools.getParameters();
        core.info("Parameters: " + JSON.stringify(parameters));
        const parametersValid = await tools.validateParameters(parameters);
        core.info("Parameters valid: " + parametersValid);

        core.info((new Date()).toTimeString());
        core.setOutput('time', new Date().toTimeString());

        const beforeScript = core.getInput('beforeScript');
        core.info("Before script: " + beforeScript);
        if (parameters['beforeScript']) {
            core.info("Using beforeScript parameter.");
            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            catchConsole(page);
            const url = 'https://github.com/karol-brejna-i/test-actions/blob/test-pr-inject/README.md'
            await page.goto(url);

            const runMyScript = require('./script.js');
            let result = await runMyScript(page, beforeScript);
            core.info("Result: " + result);

            await page.screenshot({path: 'e-1.png', fullPage: false});
            await browser.close();
        }

    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
    }
}

run();
