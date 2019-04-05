
const { runCmd } = require('./cmd')

// do object extracting
runCmd('strat to find object...',
'cd ../py && python findObject.py',
'find object!',
0)

// do object oriented inpainting
runCmd('start to do object inpainting...',
'cd ../generative_inpainting && python test_obj.py --mask ../inpainting_result/object_mask.jpg'
+ ' --checkpoint_dir model_logs/para_4_normal/mine_5',
'object inpainting done!',
2000)

// concat img to generate final result
runCmd('start to do img concating...',
'cd ../py && python mergeResult.py',
'img concating done!',
10000)
