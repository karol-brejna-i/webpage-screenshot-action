const core = require('@actions/core');
const os = require("os");
const path = require("path");

module.exports = {
    getMode: function () {
        return core.getInput('mode') || 'wholePage';
    },
    decodeUrls: function (urls) {
        let lines = urls.split(/\r?\n/);
        core.info('---------------------');
        core.info(urls);
        core.info(lines.length);
        for (let i = 0; i < lines.length; i++) {
            core.info(`${i}. '${lines[i]}'`);
        }
        core.info('---------------------');
        if (lines.length > 1) {
            return lines;
        } else {
            return [urls];
        }
    },
    getParameters: async function () {
        return new Promise(
            (resolve => {
                const url = this.decodeUrls(core.getInput('url', {required: true}));
                const mode = this.getMode();
                const xpath = core.getInput('xpath');
                const selector = core.getInput('selector');
                const scriptBefore = core.getInput('scriptBefore');
                const output = core.getInput('output') || 'screenshot.png';

                const debugInfo = core.getInput('debugInfo') || false;

                resolve({
                    url: url,
                    mode: mode,
                    xpath: xpath,
                    selector: selector,
                    scriptBefore: scriptBefore,
                    output: output,
                    debugInfo: debugInfo
                });
            }));
    },
    checkUrl: function (url) {
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

                if (!parametersJson.mode) {
                    throw Error('Please provide mode.');
                }

                // iterate over parametersJson.url and validate url
                for (let i = 0; i < parametersJson.url.length; i++) {
                    if (!this.checkUrl(parametersJson.url)) {
                        core.info('Invalid URL: ' + parametersJson.url);
                        throw Error('Please, provide a valid URLs.')
                    }
                }

                if (['scrollToElement', 'element'].indexOf(parametersJson.mode) === 1) {
                    if (!parametersJson.xpath && !parametersJson.selector) {
                        throw Error(`Please provide xpath or selector for '${parametersJson.mode}' mode.`);
                    }
                }

                resolve(true);
            }));
    },

    giveError: function (message, error = undefined, includeStack = false) {
        let combinedMessage = message;
        if (error) combinedMessage += ` : ${error}`;
        if (includeStack) {
            combinedMessage += `\n${error.stack}`;
        }
        console.error(combinedMessage);
        throw new Error(combinedMessage);
    },

    getBrowserPath: async function () {
        const type = os.type();

        let browserPath;
        if (type === 'Windows_NT') {
            browserPath = path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe');
        } else if (type === 'Darwin') {
            browserPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        } else {
            browserPath = '/usr/bin/google-chrome';
        }
        core.debug('Browser path: ' + browserPath);
        return browserPath;
    }

}
