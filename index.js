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
        core.setOutput('scriptResult', scriptResult);
        // XXX TODO: there are some problem reading action output in when run in a workflow (not as local unit test)
        // this is a workaround for the test to be able to run both locally and on GitHub runner
        core.info('--action-result::' + JSON.stringify(scriptResult));
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
