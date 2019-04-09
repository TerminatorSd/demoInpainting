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
		desc: 'get ass res',
		method: 'get',
		routerPath: '/res/ass',

		async handler (ctx, next) {

			// 读取文件ass.txt

			let res = fs.readFileSync('./inpainting_result/ass.txt', 'utf8');
			let resArr = res.trim().split('\n');
			let resObj = {};

			for(let i = 0, len = resArr.length; i < len; i++) {
				let itemArr = resArr[i].split(':');
				let numArr = itemArr[1].trim().split(',');
				// 移除最后一个空白
				numArr.pop();
				resObj[itemArr[0].trim()] = numArr;
			}

			ctx.status = 200;
			ctx.body = {
				code: 0,
				data: resObj
			};
		}
	}
]