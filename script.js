const core = require('@actions/core');

let runMyScript = async function (page, theScript) {
    core.info('Running a script.');
    core.debug(theScript);
    const bodyHandle = await page.$('body');

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

    }, bodyHandle, theScript);
}

module.exports = runMyScript;
