let script = function () {
    return new Promise((resolve) => {
        let result = "No results";

        result = 'Hello world';

        resolve(result);
    });
};

module.exports = script;