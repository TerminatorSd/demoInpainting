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
				saveName = 'inpainting_upload/input.' + ctx.request.body.name.split('.')[1]; 
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
									console.log('hello')
									// 进行inpainting
									nodeCmd.get(
										'th ./siggraph2017_inpainting/inpaint.lua --input ./inpainting_upload/input.jpg --mask ./inpainting_upload/white_zero_mask.jpg --output ./inpainting_result/',
										function(err, data, stderr) {
											if(err || stderr) {
												console.log(err);
												console.log(stderr);
											} else {
												console.log('global and local done!')
											}
										}
									);
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