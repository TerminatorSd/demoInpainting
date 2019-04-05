
import numpy as np
import cv2
import copy
import argparse

parser = argparse.ArgumentParser()

parser.add_argument('--time', default='12324234', 
                    help='The filename of image to be completed.')

args = parser.parse_args()
#读取灰度图
img = cv2.imread('./mask/' + args.time + '.jpg', 0)
height = img.shape[0]
width = img.shape[1]

# 制作两种mask
img_white = copy.deepcopy(img)
img_black = copy.deepcopy(img)
for row in range(height):
	for col in range(width):
		if(img[row][col] == 0):
			img_white[row][col] = 0
			img_black[row][col] = 255
		else:
			img_white[row][col] = 255
			img_black[row][col] = 0

cv2.imwrite('./mask/' + args.time + '_white_zero' + '.jpg', img_white)
cv2.imwrite('./mask/' + args.time + '_black_zero' + '.jpg', img_black)

