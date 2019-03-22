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
const nodeCmd = require('node-cmd');
const { log } = require('../utils/framework')
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
				//  + ctx.request.body.name.split('.')[1]; 
			}

			// 保存图片
			fs.writeFile(saveName, dataBuffer, function(err) {
				if(err){
					res.code = -1;
					res.msg = 'error';
				} else {
					// 制作两种mask
					nodeCmd.get(
						'python ./py/changeColor.py',
						function(err, data, stderr) {
							if(err || stderr) {
								console.log(err);
								console.log(stderr);
							} else {
								if(isInput) {
									isInput = false;
									// 制作白色mask 图片
									setTimeout(() => {
										runCmd('start to generate white mask area...', 
											'cd ./py && python whiteMask.py', 
											'white mask area done!');
									}, 8000)

									// // do segmentation inpainted image
									// setTimeout(() => {
									// 	runCmd('segmentation on input_with_mask image...', 
									// 		'cd ./segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
									// 		+ ' && python inference.py && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate'
									// 		+ ' && cd ./util && python colorGrab.py',
									// 		'segmentation done!');
									// }, 9000)

									// // do segmentation inpainted image
									// setTimeout(() => {
									// 	runCmd('segmentation on inpainted image...',
									// 		'cd ./segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
									// 		+ ' && python inference_2.py && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate'
									// 		+ ' && cd ./util && python colorGrab.py',
									// 		'segmentation done!')
									// 	log.res('segmentation on inpainted image...')
									// }, 10000)

									// // segementation origin image
									// setTimeout(() => {
									// 	runCmd('segmentation on original image...',
									// 		'cd ./segmentation && source ~/myGit/ganCode/virtualEnv/envPython2/bin/activate' 
									// 		+ ' && python inference_1.py'
									// 		+ ' && source ~/myGit/ganCode/virtualEnv/tensorEnv/bin/activate'
									// 		+ ' && cd ./util && python colorGrab.py',
									// 		'segmentation done!')
									// }, 12000)

									// do partial inpainting
									// setTimeout(() => {
									// 	runCmd('start to do object inpainting...',
									// 		'cd generative_inpainting && python test.py --image ../inpainting_result/object_input.jpg --mask ../inpainting_result/object_mask.jpg --output ../inpainting_result/object_output.jpg --checkpoint_dir model_logs/release_imagenet_256',
									// 		'object inpainting done!')
									// }, 20000)

									// g and l inpainting 
									runCmd('start g and l inpainting...',
										'cd ./siggraph2017_inpainting && th inpaint.lua',
										'g and l done')

									// partial conv inpainting
									runCmd('start partial conv inpainting...',
										'cd ./partial-conv && python test.py',
										'partiac conv done!')
									
									// generative inpainting with imagenet
									runCmd('start generative inpainting with imagenet...',
										'cd ./generative_inpainting && python test.py --output ../inpainting_result/gi_out_imagenet.jpg --checkpoint_dir model_logs/release_imagenet_256',
										'generative inpainting done!')
									
									// generative inpainting with places2
									runCmd('start generative inpainting with places2...',
										'cd ./generative_inpainting && python test.py --output ../inpainting_result/gi_out_places2.jpg --checkpoint_dir model_logs/release_places2_256',
										'generative inpainting done!')

									// my model start
									// generative inpainting 进行inpainting with my model
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_1.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 500)
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_2.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 1000)
									// setTimeout(() => {	
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_3.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 1500)
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_4.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 2000)
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_5.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 2500)
								
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_6.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 3000)	
									
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_7.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 3500)
									
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_8.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 4000)
									
									// setTimeout(() => {
									// 	nodeCmd.get(
									// 		'cd ./generative_inpainting && python test_9.py',
									// 		function(err, data, stderr) {
									// 			if(err || stderr) {
									// 				console.log(err);
									// 				console.log(stderr);
									// 			} else {
									// 				console.log('haha')
									// 				log.done('generative inpainting done!');
									// 			}
									// 		}
									// 	);
									// }, 4500)
									
									// my model end
								}
							}
						}
					);
				}
			});

			ctx.set("Content-Type", "application/json");
			ctx.body = res;
		}
	},
]