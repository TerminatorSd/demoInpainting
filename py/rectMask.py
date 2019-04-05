#coding:utf-8
# 产生矩形掩膜
# 分为两种，大面积的和小个多面积的

import cv2
import random
import numpy as np

zero_matrix = np.zeros([256, 256])
one_matrix = np.full([256, 256], 255)

area = 128 * 128

# generate big mask
rand_x = random.randint(0, 127)
rand_y = random.randint(0, 127)

for x in range(rand_x, rand_x + 127):
    for y in range(rand_y, rand_y + 127):
        zero_matrix[x][y] = 255
        one_matrix[x][y] = 0

cv2.imwrite('../rect_mask/' + str(rand_x) + '_' + str(rand_y) + '_zero.jpg', zero_matrix)
cv2.imwrite('../rect_mask/' + str(rand_x) + '_' + str(rand_y) + '_one.jpg', one_matrix)
