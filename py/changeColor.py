
import numpy as np
import cv2
import copy

#读取灰度图
img = cv2.imread('./inpainting_upload/mask.jpg', 0)
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

cv2.imwrite('./inpainting_upload/white_zero_mask.jpg', img_white)
cv2.imwrite('./inpainting_upload/black_zero_mask.jpg', img_black)

