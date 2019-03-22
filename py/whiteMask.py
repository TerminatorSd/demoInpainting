#coding:utf-8
# 把缺失区域的灰色均值变为白色
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