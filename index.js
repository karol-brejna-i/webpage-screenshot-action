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

        core.info('Webpage Screenshot Action finished successfully.');
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
