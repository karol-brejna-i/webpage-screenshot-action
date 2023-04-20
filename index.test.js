const process = require('process');


const cp = require('child_process');
const path = require('path');
const tools = require('./src/tools');


const TIMEOUT = 10000;

const cleanEnvs = function () {
    delete process.env['INPUT_MODE'];
    delete process.env['INPUT_OUTPUT'];
    delete process.env['INPUT_SCRIPTBEFORE'];
}

const extractOutput = function (result) {
    // from result filter out only lines that start with "::set-output"
    const outputEntries = result.split('\n').filter(line => line.startsWith('::set-output'));
    // there should be only one line with output
    expect(outputEntries.length).toBe(1);

    const output = outputEntries[0];
    const name = output.substring(output.indexOf('name=') + 5, output.indexOf('::', 15));
    const value = output.substring(output.indexOf('::', 15) + 2);

    return {name: name, value: value}

}


test('default mode', async () => {
    console.log("default mode");
    cleanEnvs();
    const mode = await tools.getMode();
    console.log("mode: " + mode);
    await expect(mode).toBe('wholePage');
});

test('non-default mode', async () => {
    console.log('non-default mode');
    cleanEnvs();
    process.env['INPUT_MODE'] = 'page';
    const mode = await tools.getMode();
    console.log("mode: " + mode);
    await expect(mode).not.toBe('wholePage');
});

test('malformed URL input', async () => {
    console.log('malformed URL input');
    cleanEnvs();
    process.env['INPUT_URL'] = 'malformed';
    const parameters = await tools.getParameters()
    await expect(tools.validateParameters(parameters)).rejects.toThrow('Please, provide a valid URL.');
});

test('Fail without URL', async () => {
    console.log("Fail without URL");
    cleanEnvs();
    const ip = path.join(__dirname, 'index.js');

    try {
        const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
        console.log(result);
        throw new Error('Should have failed');
    } catch (error) {
        console.info("Expected fail.");
    }
});

test('test parameter for element', () => {
    console.log('test parameter for element');
    cleanEnvs();
    process.env['INPUT_URL'] = 'https://google.com';
    process.env['INPUT_MODE'] = 'element';
    const ip = path.join(__dirname, 'index.js');

    try {
        const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
        console.log(result);
    } catch (error) {
        console.info("Expected fail.");
        console.log("Error: " + error.message);
    }
});

test('test given output name', async () => {
    console.log('test given output name');
    cleanEnvs();
    const url = 'https://github.com/karol-brejna-i/webpage-screenshot-action/blob/main/README.md';
    const screenshot = 'readme-wholepage-screenshot.png';
    process.env['INPUT_URL'] = url;
    process.env['INPUT_OUTPUT'] = screenshot;

    const ip = path.join(__dirname, 'index.js');

    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);

    // from result filter out only lines that start with "::set-output"
    const output = extractOutput(result);
    console.log("output: " + output);

    const expectedJson = {url: url, screenshot: screenshot};

    await expect(output.value).toEqual(expect.stringContaining(JSON.stringify(expectedJson)));

});

test('test run without scriptBefore', async () => {
    console.log('test run without scriptBefore');
    cleanEnvs();
    const url = 'https://google.com';
    const screenshot = 'screenshot.png';
    process.env['INPUT_URL'] = url;
    const ip = path.join(__dirname, 'index.js');
    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);

    // from result filter out only lines that start with "::set-output"
    const output = extractOutput(result);
    console.log("output: " + output);

    const expectedJson = {url: url, screenshot: screenshot};

    await expect(output.value).toEqual(expect.stringContaining(JSON.stringify(expectedJson)));
});

test('test run with scriptBefore', async () => {
    console.log('test run with scriptBefore');
    cleanEnvs();
    const url = 'https://google.com';
    const screenshot = 'screenshot.png';
    process.env['INPUT_URL'] = url;
    process.env['INPUT_SCRIPTBEFORE'] = 'result = 42;';
    const ip = path.join(__dirname, 'index.js');

    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);

    const expectedJson = {url: url, screenshot: screenshot, scriptResult: 42};

    // from result filter out only lines that start with "::set-output"
    const output = extractOutput(result);
    console.log("output: " + JSON.stringify(output));

    await expect(output.value).toEqual(expect.stringContaining(JSON.stringify(expectedJson)));
});

test('test run with faulty scriptBefore', async () => {
    console.log('test run with faulty scriptBefore');
    cleanEnvs();
    process.env['INPUT_URL'] = 'https://google.com';
    process.env['INPUT_SCRIPTBEFORE'] = 'return 42;';
    delete process.env['INPUT_MODE']
    const ip = path.join(__dirname, 'index.js');

    const options = {
        timeout: TIMEOUT,
        killSignal: 'SIGKILL',
        env: process.env
    }

    cp.exec(`node ${ip}`, options, function (err, stout, stderr) {
        if (err) {
            console.log('Child process exited with error code', err);
            console.log('stderr: ' + stderr);
            console.log('stdout: ' + stout);

            if (err.killed) {
                throw new Error('Command failed. Probably timeouted.');
            }
        } else {
            console.debug('Child process exited with success code!');
            const output = extractOutput(stout);
            expect(output.value).toEqual(expect.stringContaining('Evaluation failed'));
            console.info("Expected fail.");
        }
    });
});


test('test run with faulty url', async () => {
    console.log('test run with faulty url');
    cleanEnvs();

    // the URL is technically valid, but it's not reachable
    process.env['INPUT_URL'] = 'https://ąśćżź.pl';
    const ip = path.join(__dirname, 'index.js');

    const options = {
        timeout: TIMEOUT,
        killSignal: 'SIGKILL',
        env: process.env
    }

    cp.exec(`node ${ip}`, options, function (err, stout, stderr) {
        if (err) {
            console.log('Child process exited with error code', err);
            console.log('stderr: ' + stderr);
            console.log('stdout: ' + stout);

            if (err.killed) {
                throw new Error('Command failed. Probably timeouted.');
            }
        } else {
            console.debug('Child process exited with success code!');
            const output = extractOutput(stout);
            expect(output.value).toEqual(expect.stringContaining('Error navigating to'));
        }
    });
    console.log('waiting for timeout');

    await new Promise(resolve => setTimeout(resolve, TIMEOUT + 500));
}, TIMEOUT + 1000);


test('test multipleUrls', async () => {
    console.log('test run with multiple Urls');
    cleanEnvs();
    const urls = ['https://google.com', 'https://www.onet.pl/'];
    const screenshot = 'screenshot.png';
    // create a string with newlines from urls
    process.env['INPUT_URL'] = urls.join('\n');
    const ip = path.join(__dirname, 'index.js');

    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);

    const output = extractOutput(result);
    console.log("output: " + JSON.stringify(output));

    // convert output.value to JSON
    const outputJson = JSON.parse(output.value);
    console.log("outputJson: " + JSON.stringify(outputJson));

    // expect that output.value doesn't contain "Error"
    await expect(output.value).not.toEqual(expect.stringContaining('Error'));
    await expect(output.value).toEqual(expect.stringContaining('screenshot_1.png'));
    await expect(output.value).toEqual(expect.stringContaining('screenshot_2.png'));
    // expect that outputJson is an array of two elements
    await expect(outputJson).toHaveLength(2);
});