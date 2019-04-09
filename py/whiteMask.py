#coding:utf-8
# 把缺失区域的灰色均值变为白色
import argparse
import cv2

parser = argparse.ArgumentParser()

parser.add_argument('--img', default='../inpainting_result/gl_input.jpg', 
                    help='The filename of image to be completed.')

parser.add_argument('--mask', default='../inpainting_upload/black_zero_mask.jpg', 
                    help='The filename of image to be completed.')

parser.add_argument('--output', default='../inpainting_result/gl_input_white.jpg', 
                    help='The filename of image to be completed.')

args = parser.parse_args()

img = cv2.imread(args.img)
mask = cv2.imread(args.mask)

width = 0
height = 0

if mask.shape[0] > img.shape[0]: 
  width = img.shape[0]
else:
  width = mask.shape[0]

if mask.shape[1] > img.shape[1]:
  height = img.shape[1]
else:
  height = mask.shape[1]
channel = mask.shape[2]

print(mask.shape)

for row in range(height):
  for col in range(width):
    if mask[col][row][0] < 10:
      for c in range(channel):
        img[col][row][c] = 255

cv2.imwrite(args.output, img)