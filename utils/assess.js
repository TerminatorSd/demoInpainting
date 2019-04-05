
const { runCmd } = require('./cmd')

// do object extracting
runCmd('strat to calculate assessment...',
    'cd ../py && python assessment.py',
    'calculation done!',
    0)
