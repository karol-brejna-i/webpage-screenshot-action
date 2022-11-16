const core = require("@actions/core");
module.exports = {
    getMode: async function () {
        return new Promise(
            (resolve => {
                const result = core.getInput('mode') || 'wholePage';
                resolve(result);
            }));
    },

    getParameters: async function () {
        return new Promise(
        (async resolve => {
            const url = core.getInput('url', {required: true});
            const mode = await this.getMode();
                const xpath = core.getInput('xpath');
                const selector = core.getInput('selector');
                resolve({
                    url: url,
                    mode: mode,
                    xpath: xpath,
                    selector: selector
                });
            }));
    },

    validateParameters: async function (parametersJson) {
        return new Promise(
            (resolve => {

                if (!parametersJson) {
                    throw Error('Empty parameters object.')
                }


                if (!parametersJson.url) {
                    throw Error('Please provide a URL.');
                }

                if (['scrollToElement', 'element'].indexOf(parametersJson.mode) === 1) {
                    if (!parametersJson.xpath && !parametersJson.selector) {
                        throw Error(`Please provide xpath or selector for '${parametersJson.mode} mode.`);
                    }
                } else if (parametersJson.mode === 'script') {
                    throw Error(`Script mode is not implemented yet.`);
                }

                resolve(true);
            }));
    }

}