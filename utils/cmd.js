
// execute cmd
const nodeCmd = require('node-cmd');
const { log } = require('./framework');

module.exports = {
    runCmd(headStr, cmdStr, doneStr, delay) {
        if(!delay) {
            delay = 0;
        }
        setTimeout(() => {
            log.res(headStr);
            nodeCmd.get(
                cmdStr,
                function(err, data, stderr) {
                    if(err || stderr) {
                        console.log(err);
                        console.log(stderr);
                    } else {
                        log.done(doneStr);
                    }
                }
            );
        }, delay)
    }
}