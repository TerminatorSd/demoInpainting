
const { runCmd } = require('./cmd')

// do object extracting
// runCmd('strat to find object...',
// 'cd ../py && python findObject.py',
// 'find object!',
// 0)

// // do object oriented inpainting
// runCmd('start to do object inpainting...',
// 'cd ../generative_inpainting/test/no_para_no_pre_dog && python test_1.py'
// + ' --image ../../../inpainting_result/object_input.jpg'
// + ' --mask ../../../inpainting_result/object_mask.jpg'
// + ' --output ../../../inpainting_result/object_output.jpg',
// 'object inpainting done!',
// 2000)

// concat img to generate final result
runCmd('start to do img concating...',
'cd ../py && python mergeResult.py',
'img concating done!',
10000)
