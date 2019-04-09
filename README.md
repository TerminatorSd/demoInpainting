# UI for inpainting

> visit ./fnt/index.html
> npm run dev

#### 1、选择图片

#### 2、涂抹
![image](./img/inpaint.jpg)

#### 3、点击修复
- 20s 左右返回修复结果，可调整

#### 4、mask 绘制上传接口
- 开始绘制之前把fnt/index.js line 221 222 注释取消掉<br>
- 点击mask 按钮绘制<br>
- mask 位置./mask<br>
- mask 命名格式为：1_white_zero.jpg  1_black_zero.jpg

#### 5、批量处理图片与定量评估
- 代码：./utils/oneHundred.js
- 批处理图片位置：可自行指定
- 批处理mask 位置：./mask
- 预设时间为25s 一副，一百张图片大概需要半个多小时