const core = require('@actions/core');
const tools = require('./src/tools');
const {puppetRun} = require('./src/puppets');

async function run() {
    try {
        // obtain and validate parameters
        const parameters = await tools.getParameters();
        core.debug(`Parameters: ${JSON.stringify(parameters)}`);
        const parametersValid = await tools.validateParameters(parameters);
        core.debug(`Parameters valid: ${parametersValid}`);

        // run the action logic and return the results
        const scriptResult = await puppetRun(parameters);
        core.warning(`Script result: ${JSON.stringify(scriptResult)}`)
        core.warning('before set output');
        core.setOutput('scriptResult', scriptResult);
        core.setOutput('scriptResult2', JSON.stringify(scriptResult));
        core.warning('after set output');
        core.info('Webpage Screenshot Action finished.');

    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
        core.info('Webpage Screenshot Action failed.');
        // exit
        process.exit(1);
    }
}

run();
