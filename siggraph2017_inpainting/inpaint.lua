--[[
   Copyright (C) <2017> <Satoshi Iizuka, Edgar Simo-Serra, Hiroshi Ishikawa>

   This work is licensed under the Creative Commons
   Attribution-NonCommercial-ShareAlike 4.0 International License. To view a copy
   of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/ or
   send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

   Satoshi Iizuka, Waseda University
   iizuka@aoni.waseda.jp, http://hi.cs.waseda.ac.jp/~iizuka/index_eng.html

  Edgar Simo-Serra, Waseda University
  esimo@aoni.waseda.jp, http://hi.cs.waseda.ac.jp/~esimo/
--]]

require 'nn'
require 'nngraph'
require 'image'
require 'utils'
torch.setdefaulttensortype( 'torch.FloatTensor' )

-- commandline options
cmd = torch.CmdLine()
cmd:addTime()
cmd:text()

-- 输入参数及默认值
cmd:option( '--input',           '../inpainting_upload/input.jpg',        'Input image' )
cmd:option( '--output',          '../inpainting_result/',          'Output location')
cmd:option( '--mask',            '../inpainting_upload/white_zero_mask.jpg',        'Mask image')
cmd:option( '--maxdim',           660,        'Long edge dimension of an input image')
cmd:option( '--gpu',              false,        'Use GPU' )
cmd:option( '--nopostproc',       true,        'Disable post-processing' )

-- 解析参数并输出
local opt = cmd:parse(arg or {})
print(opt)
assert( opt.input ~= 'none' )
print( 'Loding model...' )

-- load Completion Network

-- torch.load 的参数是什么形式？
local data = torch.load( 'completionnet_places2.t7' )
local model    = data.model
local datamean  = data.mean
model:evaluate()

-- 使用gpu
if opt.gpu then
   require 'cunn'
   model:cuda()
end

-- load data，第二个参数解决压缩后的图像出现4 通道的问题
local I = image.load( opt.input, 3 )

local M = torch.Tensor()

-- 加载mask 图并保证其与待处理图片size 相同
if opt.mask~='none' then
   M = load_image_gray( opt.mask )
   assert( I:size(2) == M:size(2) and I:size(3) == M:size(3) )
else
   -- generate random holes
   -- size 2 3 分别对应行、列 => 图像的高、宽
   M = torch.Tensor( 1, I:size(2), I:size(3) ):fill(0)

   -- 产生2-4 之间的随机数
   local nHoles = torch.random( 2, 4 )
	for i=1,nHoles do
		local mask_w = torch.random( 32, 128 )
		local mask_h = torch.random( 32, 128 )

      -- 选择mask 左上角的点并进行空白填充
		local px = torch.random(1, I:size(3)-mask_w-1)
		local py = torch.random(1, I:size(2)-mask_h-1)
		local R = {{},{py,py+mask_h},{px,px+mask_w}}
		M[R]:fill(1)
	end 
end

-- resize img 宽高最大值为660
local hwmax = math.max( I:size(2), I:size(3) )
if hwmax > opt.maxdim then
	I = image.scale( I, string.format('*%d/%d',opt.maxdim,hwmax) )
   M = image.scale( M, string.format('*%d/%d',opt.maxdim,hwmax) )
end

-- Set up input
-- 宽高调整为4 的倍数
I = image.scale( I, torch.round(I:size(3)/4)*4, torch.round(I:size(2)/4)*4 )
-- print(I:size())
M = image.scale( M, torch.round(M:size(3)/4)*4, torch.round(M:size(2)/4)*4 ):ge(0.2):float()
local Ip = I:clone()

-- datamean 0.4560 0.4472 0.4155
for j=1,3 do I[j]:add( -datamean[j] ) end

-- 三通道覆盖原图像
I:maskedFill( torch.repeatTensor(M:byte(),3,1,1), 0 )

-- inpaint target holes
print('Inpainting...')

-- channel 拼接
local input = torch.cat(I, M, 1)

-- size 1 c h w
input = input:reshape( 1, input:size(1), input:size(2), input:size(3) )
if opt.gpu then input = input:cuda() end
local res = model:forward( input ):float()[1]
-- image.save('res.png', res)
-- image.save('ipcmul.png', Ip:cmul(torch.repeatTensor((1-M),3,1,1)))
-- image.save('rescmul.png', res:cmul(torch.repeatTensor(M,3,1,1)))

-- ipcmul 表示除了mask 遮盖以外的图片部分，rescmul 表示生成的遮盖部分图片
local out = Ip:cmul(torch.repeatTensor((1-M),3,1,1)) + res:cmul(torch.repeatTensor(M,3,1,1))

-- perform post-processing
if not opt.nopostproc then
   print('Performing post-processing...')
   local cv = require 'cv'
   require 'cv.photo'   
   local pflag = false
   local minx = 1e5
   local maxx = 1
   local miny = 1e5
   local maxy = 1
   for y=1,M:size(3) do
      for x=1,M:size(2) do
         if M[1][x][y] == 1 then
            minx = math.min(minx,x)
            maxx = math.max(maxx,x)
            miny = math.min(miny,y)
            maxy = math.max(maxy,y)
         end
      end
   end

   local p_i = {torch.floor(miny+(maxy-miny)/2)-1,torch.floor(minx+(maxx-minx)/2)-1}
   local src_i = tensor2cvimg( out )
   local mask_i = M:clone():permute(2,3,1):mul(255):byte()
   local dst_i = cv.inpaint{src_i, mask_i, dst=nil, inpaintRadius=1, flags=cv.INPAINT_TELEA}
   local out_i = dst_i:clone()
   cv.seamlessClone{ src=src_i, dst=dst_i, mask=mask_i, p=p_i, blend=out_i, flags=cv.NORMAL_CLONE }
   out = out_i
   out = cvimg2tensor( out )
end

-- save output
for j=1,3 do I[j]:add( datamean[j] ) end
image.save(opt.output..'gl_input.jpg', I)
image.save(opt.output..'gl_out.jpg', out)

print('Done.')
