/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2019-02-07 16:55:51
 * @modify date 2019-02-07 16:55:51
 * @desc [description]
 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const { runCmd } = require('../utils/cmd')

module.exports = [
	{
		desc: 'mask and input upload',
		method: 'post',
		routerPath: '/img/upload',

		async handler (ctx, next) {
			// 获得图片base64
			const imgData = ctx.request.body.base64;
			const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
			const dataBuffer = new Buffer(base64Data, 'base64');

			let res = {
				code: 0,
				msg: 'ok'
			}

			// 图片名 mask or input
			let saveName = 'inpainting_upload/mask.jpg';
			let isInput = false;
			if(ctx.request.body.type == 'input') {
				isInput = true;
				saveName = 'inpainting_upload/input.jpg'; 
				// + ctx.request.body.name.split('.')[1];;
			}

			// 保存图片
			fs.writeFile(saveName, dataBuffer, function(err) {
				if(err){
					res.code = -1;
					res.msg = 'error';
				} else {
					// 根据上传掩膜制作两种mask
					if(!isInput) {
						runCmd('start to generate two kinds of mask', 'python ./py/changeColor.py', 'generating mask done')
					}
					else {
						isInput = false;
						// segmentation => find object => object inpainting
						// g and l inpainting 
						runCmd('start g and l inpainting...',
							'cd siggraph2017_inpainting && th inpaint.lua',
							'g and l done',
							800)

						// // partial conv inpainting
						runCmd('start partial conv inpainting...',
							'cd ./partial-conv && python test.py',
							'partial conv done!',
							900)

						// generative inpainting with places2
						runCmd('start generative inpainting with places2...',
							'cd generative_inpainting && python test.py --output ../inpainting_result/gi_out_places2.jpg --checkpoint_dir model_logs/release_places2_256',
							'generative inpainting done!',
							1000)

						// generative inpainting with imagenet
						runCmd('start generative inpainting with imagenet...',
							'cd generative_inpainting && python test.py --output ../inpainting_result/gi_out_imagenet.jpg --checkpoint_dir model_logs/release_imagenet_256',
							'generative inpainting done!',
							1200)

						// // do segmentation inpainted image
						// setTimeout(() => {
						// 	runCmd('segmentation on input_with_mask image...', 
						// 		'cd ./segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
						// 		+ ' && python inference.py && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate',
						// 		'segmentation done!');
						// }, 9000)

						// // segementation origin image
						// runCmd('segmentation on original image...',
						// 	'cd ./segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
						// 	+ ' && python inference_1.py'
						// 	+ ' && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate',
						// 	'segmentation done!',
						// 	14000)
					}
				}
			});

			ctx.set("Content-Type", "application/json");
			ctx.body = res;
		}
	},
]