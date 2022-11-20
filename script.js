const core = require('@actions/core');

let runMyScript = async function (page, theScript) {
    core.info('runMyScript');
    core.debug(theScript);

    return await page.evaluate(async (element, script) => {
        return new Promise((resolve, reject) => {
            console.info("script inside Promise: " + script);
            let result = undefined;
            // TODO: if (err) reject(err);
            eval(script);
            resolve(result);
        });

    }, page, theScript);
}

module.exports = runMyScript;