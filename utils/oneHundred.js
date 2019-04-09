
const fs = require('fs')
const walk = require('walk')
const { runCmd } = require('./cmd')

var imgDir = '/Users/shaodong/myGit/img/pls100';
var maskDir = '/Users/shaodong/myGit/demoInpainting/mask';
var dirPre = '/Users/shaodong/myGit/demoInpainting/paper_site/oneHundred/'
var MASK_MAX = 24;
var nowIndex = 1;

walkImgDir(imgDir)

// 遍历img 目录
function walkImgDir(imgDir) {
  var walker  = walk.walk(imgDir, { followLinks: false });
 
  walker.on('file', function(roots, stat, next) {

    console.log('开始处理第' + nowIndex + '张图片...');
    var imgLoc = roots + '/' + stat.name;

    // 随机选择一个mask
    var ran = Math.ceil(Math.random() * MASK_MAX);
    // /Users/shaodong/myGit/demoInpainting/mask/58
    var maskLoc = maskDir + '/' + ran;
    
    // 调用各种算法进行计算，获得结果并存储
    var saveDir = dirPre + nowIndex;
    fs.exists(saveDir, function(exsits) {
      if (!exsits) {
        fs.mkdirSync(saveDir);
      }
      nowIndex++;
    })

    // g and l
    runCmd('start g and l inpainting...',
      'cd ../siggraph2017_inpainting && th inpaint.lua'
      + ' --input ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/',
      'g and l done',
      0)

    // partail conv
    runCmd('start partial conv inpainting...',
      'cd ../partial-conv && python test_100.py'
      + ' --root ' + imgLoc
      + ' --mask_root ' + maskLoc + '_black_zero.jpg'
      + ' --output ' + saveDir + '/ir_out.jpg',
      'partial conv done!',
      1000)

    // generative
    runCmd('start my generative places2 inpainting...',
      'cd ../generative_inpainting && python test.py' 
      + ' --image ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/places2.jpg'
      + ' --checkpoint_dir model_logs/release_places2_256',
      'generative places2 done!',
      2000);

    runCmd('start my generative imagenet inpainting...',
      'cd ../generative_inpainting && python test.py' 
      + ' --image ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/imagenet.jpg'
      + ' --checkpoint_dir model_logs/release_imagenet_256',
      'generative imagenet done!',
      3000);
    
    // mine model
    runCmd('start my para_4_normal_6 inpainting...',
      'cd ../generative_inpainting/test && python para_4_normal_6.py' 
      + ' --image ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/para_4_normal_6.jpg',
      'para_4_normal_6 done!',
      4000);

    runCmd('start my para_4_normal_7 inpainting...',
      'cd ../generative_inpainting/test && python para_4_normal_7.py' 
      + ' --image ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/para_4_normal_7.jpg',
      'para_4_normal_7 done!',
      5000);

    runCmd('start my para_4_normal_8 inpainting...',
      'cd ../generative_inpainting/test && python para_4_normal_8.py' 
      + ' --image ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/para_4_normal_8.jpg',
      'para_4_normal_8 done!',
      6000);

    runCmd('start my para_4_normal_9 inpainting...',
      'cd ../generative_inpainting/test && python para_4_normal_9.py' 
      + ' --image ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/para_4_normal_9.jpg',
      'para_4_normal_9 done!',
      7000);
    
    runCmd('start my para_4_normal_10 inpainting...',
      'cd ../generative_inpainting/test && python para_4_normal_10.py' 
      + ' --image ' + imgLoc
      + ' --mask ' + maskLoc + '_white_zero.jpg'
      + ' --output ' + saveDir + '/para_4_normal_10.jpg',
      'para_4_normal_10 done!',
      8000);
		
		// 制作白色mask 图片
		runCmd('start to generate white mask area...', 
			'cd ../py && python whiteMask.py'
			+ ' --img ' + imgLoc
			+ ' --mask ' + maskLoc + '_black_zero.jpg'
			+ ' --output ' + saveDir + '/gl_input_white.jpg', 
			'white mask area done!',
			20000)

    // 计算定量指标
    runCmd('start calculating assessment...',
      'cd ../py && python assessment.py' 
      + ' --path ' + saveDir
      + ' --input_img ' + imgLoc,
      'calculating assessment done!',
      23000);

    setTimeout(() => {
			console.log('第' + (nowIndex - 1) + '张图片处理完成...');
			console.log('**********************************************');
      next();
    }, 25000)

  });
 
  // walker.on('directory', function(roots, stat, next) {
  //     dirs.push(roots + '/' + stat.name);
  //     next();
  // });

  walker.on('end', function() {
    console.log('end, haha...')
    // console.log("files "+files);
    // console.log("dirs "+dirs);
  });
}