const core = require('@actions/core');

const tools = require('./tools');

// most @actions toolkit packages have async methods
async function run() {
    try {
        // get url input or throw error
        const url = core.getInput('url');
        core.info("url: " + url);
        if (!url) {
            throw Error('Please provide a URL.');
        }

        // get mode or default to 'wholePage'
        const mode = await tools.getMode();
        core.info('Operation mode: ' + mode);

        // xpath or selector should be provided for 'scrollToElement' and 'element' modes
        let xpath, selector;
        if (['scrollToElement', 'element'].indexOf(mode) === 1) {
            xpath = core.getInput('xpath');
            selector = core.getInput('selector');

            if (!xpath && !selector) {
                throw Error(`Please provide xpath or selector for '${mode} mode.`);
            }
            core.info('xpath: ' + xpath);
            core.info('selector: ' + selector);

        } else if (mode === 'script') {
            throw Error(`Script mode is not implemented yet.`);
        }

        // core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
        // core.info((new Date()).toTimeString());
        //
        // core.setOutput('time', new Date().toTimeString());
    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
    }
}

run();
