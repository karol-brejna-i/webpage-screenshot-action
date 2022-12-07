const core = require('@actions/core');
const tools = require('./tools');
const {puppetRun} = require('./puppets');

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

        core.info('Webpage Screenshot Action finished.');
    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
        core.info('Webpage Screenshot Action failed.');
    }
}

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here   process.exit(1); });
});

run();
