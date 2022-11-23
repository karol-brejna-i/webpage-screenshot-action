const core = require('@actions/core');

let runMyScript = async function (page, theScript) {
    core.info('runMyScript');
    core.debug(theScript);

    return await page.evaluate(async (element, script) => {
        return new Promise((resolve, reject) => {
            let result = undefined;

            try {
                eval(script);
            } catch (error) {
                reject(error);
            }
            resolve(result);
        });

    }, page, theScript);
}

module.exports = runMyScript;