#coding:utf-8
# 产生矩形掩膜
# 分为两种，大面积的和小个多面积的

import cv2
import random
import numpy as np

zero_matrix = np.zeros([256, 256])
one_matrix = np.full([256, 256], 255)

SIDEX = 64
SIDEY = 32

startNum = 97

area = SIDEX * SIDEY

def generateRect(startNum):
	# generate big mask
	rand_x = random.randint(0, 256 - SIDEX - 1)
	rand_y = random.randint(0, 256 - SIDEY - 1)

	for x in range(rand_x, rand_x + SIDEX - 1):
			for y in range(rand_y, rand_y + SIDEY - 1):
					zero_matrix[x][y] = 255
					one_matrix[x][y] = 0

	cv2.imwrite('../mask/' + str(startNum) + '_white_zero.jpg', zero_matrix)
	cv2.imwrite('../mask/' + str(startNum) + '_black_zero.jpg', one_matrix)

def main():
	for i in range(startNum, startNum + 4):
		generateRect(i)

main()
