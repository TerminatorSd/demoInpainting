/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2018-08-19 10:47:29
 * @modify date 2019-02-01 21:32:29
 * @desc js to connect mongodb
*/

'use strict';
const mongoose = require('mongoose');
const config = require('../config');
const chalk = require('chalk');
// import mongoose from 'mongoose';
// import config from '../config';
// import chalk from 'chalk';
mongoose.connect(config.url, {useMongoClient:true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open' ,() => {
	console.log(
    chalk.green('连接数据库成功')
  );
})

db.on('error', function(error) {
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
  console.log(
    chalk.red('数据库断开，重新连接数据库')
  );
  mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

module.exports = db;

// export default db;