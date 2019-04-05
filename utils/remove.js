const { runCmd } = require('./cmd')

// do dilation
runCmd('start to generate dila mask...', 
'cd ../py && python dilation.py', 
'dila mask area done!',
0);

// do object remove
runCmd('start to remove object...',
'cd ../generative_inpainting && python test.py --mask ../inpainting_result/object_area_mask_dila.jpg'
+ '--output ../inpainting_result/mine_remove.jpg --checkpoint_dir model_logs/release_imagenet_256',
'object inpainting done!',
2000)