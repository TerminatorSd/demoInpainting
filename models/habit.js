/**
 * @Author:   shaoDong
 * @Version:  1.0
 * @DateTime: 2019-02-01 21:34:21
 * @Description: Schema 与表结构相对应，Model 为nodeJs 中与表结构相对应的类
 **/
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSchema = new Schema({
  title: {type: String, default: ''}
})

habitSchema.index({id: 1});

module.exports = mongoose.model('Habit', habitSchema);