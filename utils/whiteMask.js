
// do segmentation on inpainted img
const { runCmd } = require('./cmd')
                            
// narrow mask
// runCmd('start to generate narrow mask...', 
// 'cd ../py && python narrowMask.py', 
// 'narrow mask area done!',
// 0);;						

// 制作白色mask 图片
runCmd('start to generate white mask area...', 
'cd ../py && python whiteMask.py', 
'white mask area done!',
10000)