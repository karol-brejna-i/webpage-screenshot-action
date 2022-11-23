const core = require('@actions/core');
const tools = require('./tools');
const {puppetRun} = require('./puppets');

async function run() {
    try {
        const parameters = await tools.getParameters();
        core.info(`Parameters: ${JSON.stringify(parameters)}`);
        const parametersValid = await tools.validateParameters(parameters);
        core.info(`Parameters valid: ${parametersValid}`);

        const scriptResult = await puppetRun(parameters);
        core.setOutput('scriptResult', scriptResult);
    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
    }
}

run();
