/**
 * @author shaoDong
 * @email scut_sd@163.com
 * @create date 2018-08-19 11:01:33
 * @modify date 2010-02-01 11:01:33
 * @desc config file
*/

'use strict';

const config = {
  port: 3000,
  url: 'mongodb://39.108.163.91:27017/habit',
  session: {
    name: 'SID',
    secret: 'SID',
    cookie: {
      httpOnly: true,
      secure: false,
      // 一年过期时间
      maxAge: 365 * 24 * 60 * 60 * 1000,
    }
  }
}

module.exports = config;
// export default config;