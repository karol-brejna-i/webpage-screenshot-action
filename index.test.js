const process = require('process');
const cp = require('child_process');
const path = require('path');
const tools = require('./tools');

test('Fail without URL', async () => {
    delete process.env['INPUT_MODE'];
    const ip = path.join(__dirname, 'index.js');

    try {
        const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
        console.log(result);
        throw new Error('Should have failed');
    } catch (error) {
        console.log("Error: " + error.message);
    }

    // await expect(cp.execSync(`node ${ip}`, {env: process.env})).toThrow('Please provide a URL.');
});

test('test parameter for element', () => {
    process.env['INPUT_URL'] = '----------------------------------https://wp.pl';
    process.env['INPUT_MODE'] = 'element';
    const ip = path.join(__dirname, 'index.js');

    try {
        const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
        console.log(result);
        throw new Error('Should have failed');
    } catch (error) {
        console.info("Expected fail.");
        console.log("Error: " + error.message);
    }
})

test('test parameters for script', () => {
    process.env['INPUT_URL'] = 'https://wp.pl';
    process.env['INPUT_MODE'] = 'script';
    const ip = path.join(__dirname, 'index.js');

    try {
        const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
        console.log(result);
        throw new Error('Should have failed');
    } catch (error) {
        console.info("Expected fail.");
        console.info("Error: " + error.message);
    }
})

test('default mode', async () => {
    delete process.env['INPUT_MODE']
    mode = await tools.getMode();
    await expect(mode).toBe('wholePage');
});

test('non-default mode', async () => {
    process.env['INPUT_MODE'] = 'element';
    mode = await tools.getMode();
    await expect(mode).not.toBe('wholePage');
});

// TODO: test should check if default mode is 'wholePage'
test('test no mode', () => {
    process.env['INPUT_URL'] = 'https://wp.pl';
    delete process.env['INPUT_MODE'];
    const ip = path.join(__dirname, 'index.js');
    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env['INPUT_URL'] = 'https://wp.pl';
    process.env['INPUT_MODE'] = 'page';
    const ip = path.join(__dirname, 'index.js');
    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);
})


// test('wait 500 ms', async () => {
//   const start = new Date();
//   await wait(500);
//   const end = new Date();
//   var delta = Math.abs(end - start);
//   expect(delta).toBeGreaterThanOrEqual(500);
// });