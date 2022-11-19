const core = require('@actions/core');
const tools = require('./tools');
const puppetTools = require("./puppetTools");

async function run() {
    try {
        const parameters = await tools.getParameters();
        core.info("Parameters: " + JSON.stringify(parameters));
        const parametersValid = await tools.validateParameters(parameters);
        core.info("Parameters valid: " + parametersValid);

        puppetTools.puppetRun(parameters);

        core.info((new Date()).toTimeString());
        core.setOutput('time', new Date().toTimeString());


    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
    }
}

run();
