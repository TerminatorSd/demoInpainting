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
const walk = require('walk')

module.exports = [
	{
		desc: 'mask upload and save',
		method: 'post',
		routerPath: '/mask/save',

		async handler (ctx, next) {
			// 获得图片base64
			const imgData = ctx.request.body.base64;
			const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
			const dataBuffer = new Buffer(base64Data, 'base64');

			let res = {
				code: 0,
				msg: 'ok'
			}
			
			let now = Date.now()
			let imgDir = '/Users/shaodong/myGit/demoInpainting/mask'

			// 图片名 mask or input
			// mask 命名格式为 num_white_zero.jpg  num_black_zero.jpg
			let startNum = 0;
			var walker  = walk.walk(imgDir, { followLinks: false });

			walker.on('file', function(roots, stat, next) {
				// console.log(roots)
				// console.log(stat.name)
				startNum += 1;
				next();
			});

			walker.on('end', function() {
			// 	console.log('end, haha...')
				let nextNum = startNum / 3 + 1;
				let saveName = 'mask/' + nextNum + '.jpg';

				// 保存图片
				fs.writeFile(saveName, dataBuffer, function(err) {
					if(err){
						res.code = -1;
						res.msg = 'error';
					} else {
						// 根据上传掩膜制作两种mask
						runCmd('start to generate two kinds of mask', 
							'python ./py/generateMask.py --time ' + nextNum, 
							'generating mask done')
					}
				});

				ctx.set("Content-Type", "application/json");
				ctx.body = res;
			});
		}
	},
]