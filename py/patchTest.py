#coding:utf-8
# generative inpainting 修复过的图像会小4个像素
# 我需要找到小的4个像素的规则或者说resize 是否可以消除这4个像素的影响
import cv2

img = cv2.imread('../inpainting_result/gl_input.jpg')
mask = cv2.imread('../inpainting_upload/black_zero_mask.jpg')

width = mask.shape[0]
height = mask.shape[1]
channel = mask.shape[2]

print(mask.shape)

for row in range(height):
  for col in range(width):
    if mask[col][row][0] < 10:
      for c in range(channel):
        img[col][row][c] = 255

cv2.imwrite('../inpainting_result/gl_input_white.jpg', img)