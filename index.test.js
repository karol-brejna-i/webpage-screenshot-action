const process = require('process');
const cp = require('child_process');
const path = require('path');
const tools = require('./tools');

test('default mode', async () => {
    console.log("default mode");
    delete process.env['INPUT_MODE']
    const mode = await tools.getMode();
    console.log("mode: " + mode);
    await expect(mode).toBe('wholePage');
});

test('non-default mode', async () => {
    console.log("non-default mode");
    process.env['INPUT_MODE'] = 'element';
    const mode = await tools.getMode();
    console.log("mode: " + mode);
    await expect(mode).not.toBe('wholePage');
});

test('Fail without URL', async () => {
    console.log("Fail without URL");
    delete process.env['INPUT_MODE'];
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
    console.log("test parameter for element");
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
})

test('test run without beforeScript', async() => {
    console.log("test parameter for element");
    process.env['INPUT_URL'] = 'https://google.com';
    process.env['INPUT_MODE'] = 'element';
    const ip = path.join(__dirname, 'index.js');

    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);
    await expect(result).toEqual(expect.stringContaining('{"url":"https://google.com"}'));
})

test('test run with beforeScript', async() => {
    console.log("test parameter for element");
    process.env['INPUT_URL'] = 'https://google.com';
    process.env['INPUT_MODE'] = 'element';
    process.env['INPUT_BEFORESCRIPT'] = 'result = 42;';
    const ip = path.join(__dirname, 'index.js');

    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);
    await expect(result).toEqual(expect.stringContaining('{"url":"https://google.com","result":42}'));
})

test('test run with faulty beforeScript', async() => {
    console.log("test parameter for element");
    process.env['INPUT_URL'] = 'https://google.com';
    process.env['INPUT_MODE'] = 'element';
    process.env['INPUT_BEFORESCRIPT'] = 'return 42;';
    const ip = path.join(__dirname, 'index.js');

    try {
        const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
        throw new Error('Should have failed');
    } catch (error) {
        console.info("Expected fail.");
        console.log("Error: " + error.message);

        await expect(error.stdout.toString()).toEqual(expect.stringContaining('::error::Error in beforeScript'));
    }
})

