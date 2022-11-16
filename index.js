const core = require('@actions/core');

const tools = require('./tools');

async function run() {
    try {
        const parameters = await tools.getParameters();
        core.info("Parameters: " + JSON.stringify(parameters));
        const parametersValid = await tools.validateParameters(parameters);
        core.info("Parameters valid: " + parametersValid);



        // https://www.urlbox.io/website-screenshots-puppeteer#using-puppeteer-to-take-an-element-screenshot

        core.info((new Date()).toTimeString());
        core.setOutput('time', new Date().toTimeString());

        let params = {};
        // check if url field exists in parametersJson
        // if (parameters.url) {


    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
    }
}

run();
