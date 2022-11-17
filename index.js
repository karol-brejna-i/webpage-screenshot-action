const core = require('@actions/core');
const tools = require('./tools');
const fs = require("fs");

// function that reads a file and replaces the placeholder with the actual script and saves the file.
async function replaceScript(srcFile, dstFile, newScript, pattern = "/*~~REPLACE~~*/") {
    // read the file
    fs.readFile(srcFile, "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        // replace the text
        var result = data.replace(pattern, newScript);

        // write the file
        fs.writeFile(dstFile, result, "utf8", function (err) {
            if (err) return console.log(err);
        });
    });
}

async function run() {
    try {
        const parameters = await tools.getParameters();
        core.info("Parameters: " + JSON.stringify(parameters));
        const parametersValid = await tools.validateParameters(parameters);
        core.info("Parameters valid: " + parametersValid);

        await replaceScript("script.js.template", "script.js", "result = 'Hello world';");
        const script = require("./script");
        // const {script} = await import("./script.js");
        let scriptResult = await script();
        core.info("Script result: " + scriptResult);

        // https://github.com/lannonbr/puppeteer-screenshot-action/blob/master/index.js -- works even on windows; test yours
        // https://www.urlbox.io/website-screenshots-puppeteer#using-puppeteer-to-take-an-element-screenshot

        core.info((new Date()).toTimeString());
        core.setOutput('time', new Date().toTimeString());


        const beforeScript = core.getInput('beforeScript');
        if (parameters['beforeScript']) {
            core.info("Using beforeScript parameter.");
            // let scriptResult = await script();
        }

    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
    }
}

run();
