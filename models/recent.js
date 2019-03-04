/**
 * @Author:   shaoDong
 * @Version:  1.0
 * @DateTime: 2019-02-01 21:34:21
 * @Description: Schema 与表结构相对应，Model 为nodeJs 中与表结构相对应的类
 **/
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recentSchema = new Schema({
  title: {type: String, default: ''},
  content: {type: String, default: ''},
  img: {type: String, default: ''},
  time: {type: String, default: ''},
  location: {type: String, default: ''},
  created_at: {type: Number, default: 0},
  updated_at: {type: Number, default: 0},
  likes: {type: String, default: ''},
  comment: {type: String, default: ''},
  tag: {type: String, default: ''},
  mood: {type: String, default: ''},
  with: {type: String, default: ''},
  // 0 未发布， 1 已发布
  status: {type: String, default: ''},
})

recentSchema.index({id: 1});

module.exports = mongoose.model('Recent', recentSchema);