const core = require('@actions/core');
const puppeteer = require('puppeteer-core');
const {getBrowserPath, giveError} = require("./tools");

const turnOnConsoleCatching = async function (page) {
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

async function launchBrowser(){
    const width = parseInt(core.getInput('width')) | 800;
    const height = parseInt(core.getInput('height')) | 600;
    const launchOptions = {
        executablePath: await getBrowserPath(),
        defaultViewport: {width, height},
        headless: true
    }
    core.info('Launch options: ' + JSON.stringify(launchOptions));
    return puppeteer.launch(launchOptions);
}

async function getElement(page, parameters) {
    let result = undefined;
    if (parameters.selector) {
        core.debug(`Getting element by selector ${parameters.selector}`);
        result = page.$(parameters.selector)
            .then(async (element) => element)
            .catch((error) => giveError(`Error finding element by selector '${parameters.selector}'`, error));
    } else if (parameters.xpath) {
        core.debug(`Getting element by xpath ${parameters.xpath}`);
        result = page.$x(parameters.xpath)
            .then(async (elements) => elements[0])
            .catch((error) => giveError(`Error finding element by xpath '${parameters.xpath}`, error));
    } else {
        giveError('No selector or xpath provided.');
    }
    return result;
}

async function getScreenshotOperation(page, screenshotOptions, parameters) {
    let result = undefined;

    if (parameters.mode === 'page' || parameters.mode === 'wholePage') {
        core.info(`Taking screenshot of page with options ${JSON.stringify(screenshotOptions)}.`);
        result = page.screenshot(screenshotOptions);
    } else if (parameters.mode === 'element') {
        core.info(`Taking screenshot of an element with options ${JSON.stringify(screenshotOptions)}.`);
        result = getElement(page, parameters)
            .then((element) => element.screenshot(screenshotOptions))
            .catch((error) => giveError(`Error finding element by selector ${parameters.selector}`, error));
    } else if (parameters.mode === 'scrollToElement') {
        core.info(`Scrolling to element with options ${JSON.stringify(screenshotOptions)}.`);
        result = getElement(page, parameters).then((element) => {
            return page.evaluate(el => el.scrollIntoView(), element)
                .then(() => page.screenshot(screenshotOptions))
                .catch((error) => giveError(`Error scrolling to element`, error));
        }).catch((error) => {
            giveError(`Error finding element`, error);
        });

    } else {
        giveError(`Unknown mode ${parameters.mode}`, undefined, false);
    }
    return result;
}

function getPath(parameters, noOfUrls, i) {
    if (noOfUrls > 1) {
        // strip the extension
        const extension = parameters.output.split('.').pop();
        const name = parameters.output.substring(0, parameters.output.length - extension.length - 1);
        // lpad the index to much the length of the number of urls
        const index = i.toString().padStart(noOfUrls.toString().length, '0');
        return `${name}_${index}.${extension}`;

    } else {
        return parameters.output;
    }
}

const puppetRun = async function (parameters) {
    core.info('Puppet new run.');

    const urls = parameters['url']


    // start the headless browser
    const browser = launchBrowser();
    return browser.then(async (browser) => {
            let i = 1;
            // iterate over urls and get pages
            const results = urls.map(async (url) => {

                return browser.newPage().then(async (page) => {
                    // turn on console logs catching
                    await turnOnConsoleCatching(page);

                    core.info(`Navigating to ${url}`);
                    return page.goto(url).then(async () => {
                        const path = getPath(parameters, urls.length, i++);

                        let responseObject = {url: url, screenshot: path};
                        const scriptBefore = parameters['scriptBefore'];
                        if (scriptBefore) {
                            core.info('Using scriptBefore parameter.');

                            const runMyScript = require('./script.js');

                            responseObject = {
                                ...responseObject,
                                scriptResult: await runMyScript(page, scriptBefore),
                            };
                            core.info(`Result: ${JSON.stringify(responseObject)}`);
                        }

                        core.info(`Taking screenshot of ${url}`);
                        const screenshotOptions = {path: path, fullPage: parameters.mode === 'wholePage'};
                        let waiter = getScreenshotOperation(page, screenshotOptions, parameters);
                        core.debug("waiter: " + waiter);
                        return waiter
                            .then(async () => {
                                core.info(`Screenshot saved to ${path}`);
                                await page.close();

                                if (parameters.debugInfo) {
                                    responseObject = {screenshotOptions: screenshotOptions, ...responseObject};
                                }

                                return responseObject;
                            })
                            .catch((error) => giveError(`Error taking a screenshot of ${url}`, error));

                    }).catch((error) => {
                        giveError(`Error navigating to ${url}`, error);
                    });

                }).catch((error) => {
                    core.error(`Error opening page for ${url}: ${error}`);
                    return {url: url, error: error.message};
                });

            });

            return Promise.all(results).then((results) => {
                const stringifiedResults = JSON.stringify(results);
                core.warning("awaited results: " + stringifiedResults);

                browser.close();

                return results;
            });

        }
    ).catch((error) => {
        console.error(`Error launching browser: ${error}`);
    });
}


module.exports = {turnOnConsoleCatching, puppetRun};
