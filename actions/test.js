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
	// {
	// 	desc: 'get img',
	// 	method: 'get',
	// 	routerPath: '/img/*',

	// 	async handler (ctx, next) {
	// 		// await new Promise(function(resolve, reject) {
	// 			let imgName = ctx.request.url.split('/').pop();
	// 			let body = '';
	// 			try {
	// 				body = fs.readFileSync('upload/' + imgName);
	// 			} catch (err) {
	// 				body = fs.readFileSync('upload/default.jpg');
	// 			}

  //     //   var req = request({
  //     //       method: 'GET',
  //     //       encoding: null,
  //     //       uri: '../upload/nai-z_1549538193000.jpeg'
  //     //   }, function(err, response, body) {
  //     //       if (err) {
  //     //           return reject(err);
  //     //       }
  //     //       resolve(body);
  //     //   });
	// 		// }).then((body) => {
	// 				ctx.status = 200;
	// 				ctx.type = 'jpg';
	// 				ctx.length = Buffer.byteLength(body);
	// 				ctx.body = body;
	// 		// }).catch((err) => {
	// 		// 		console.error(err);
	// 		// });
	// 	}
	// },
	{
		desc: 'test',
		method: 'get',
		routerPath: '/test',

		async handler (ctx, next) {
			ctx.status = 200;
			ctx.body = 'asd';
		}
	}
]