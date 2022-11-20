const core = require('@actions/core');
const puppeteer = require('puppeteer');

module.exports = {
    catchConsole: async function (page) {
        page.on("pageerror", function (err) {
            console.log(`Page error: ${err.toString()}`);
        });

        page.on('error', function (err) {
            console.log('error happen at the page: ', err);
        });
        page.on('console', message => console.log(`${message.text()}`));
    },

    puppetRun: async function (parameters) {
        core.info("Puppet run.");

        // start the headless browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // capture browser console, if required
        await this.catchConsole(page);

        await page.goto(parameters['url']);

        let result = undefined;
        const beforeScript = core.getInput('beforeScript');
        if (beforeScript) {
            core.info("Using beforeScript parameter.");

            const runMyScript = require('./script.js');
            result = await runMyScript(page, beforeScript);
            core.info("Result: " + result);
        }

        await page.screenshot({path: parameters.output, fullPage: false});
        await browser.close();
    }

}