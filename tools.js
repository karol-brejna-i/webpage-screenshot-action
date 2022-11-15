const core = require("@actions/core");
module.exports = {
    getMode: async function () {
        return new Promise(
            (resolve => {
                const result = core.getInput('mode') || 'wholePage';
                resolve(result);
            }));
    }

}