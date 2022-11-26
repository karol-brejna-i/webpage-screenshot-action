const core = require('@actions/core');

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
            (resolve => {
                const url = core.getInput('url', {required: true});
                const mode = this.getMode();
                const xpath = core.getInput('xpath');
                const selector = core.getInput('selector');
                const scriptBefore = core.getInput('scriptBefore');
                const output = core.getInput('output') || 'screenshot.png';
                resolve({
                    url: url,
                    mode: mode,
                    xpath: xpath,
                    selector: selector,
                    scriptBefore: scriptBefore,
                    output: output
                });
            }));
    },
    checkUrl: function(url) {
        console.log('checkUrl: ' + url);

        try {
            const result = new URL(url)
            return Boolean(result);
        } catch (error) {
            return false;
        }
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

                if (!this.checkUrl(parametersJson.url)) {
                    core.info('Invalid URL: ' + parametersJson.url);
                    throw Error('Please, provide a valid URL.')
                }

                if (['scrollToElement', 'element'].indexOf(parametersJson.mode) === 1) {
                    if (!parametersJson.xpath && !parametersJson.selector) {
                        throw Error(`Please provide xpath or selector for '${parametersJson.mode} mode.`);
                    }
                }

                resolve(true);
            }));
    }
}
