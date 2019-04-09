
// do segmentation on inpainted img
const { runCmd } = require('./cmd')

// do segmentation on inpainted image
runCmd('segmentation on inpainted image...',
'cd ../segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
+ ' && python inference_2.py --img_path ../inpainting_result/gi_out_imagenet.jpg'
+ ' && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate',
'segmentation done!',
1000)

// do segmentation on input image
// runCmd('segmentation on original image...',
// 'cd ../segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
// + ' && python inference_2.py --img_path ../inpainting_upload/input.jpg'
// + ' --save_dir ../inpainting_result/or_seg_res.jpg'
// + ' && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate',
// 'ori segmentation done!',
// 2000)

// do segmentation on gl white image
// runCmd('segmentation on original image...',
// 'cd ../segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
// + ' && python inference_2.py --img_path ../inpainting_result/gl_input_white.jpg'
// + ' --save_dir ../inpainting_result/gl_seg_res.jpg'
// + ' && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate',
// 'ori segmentation done!',
// 2000)