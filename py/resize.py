# -*- coding: UTF-8 -*- 

import cv2
img = cv2.imread("./input.jpeg")
# r = 200.0 / img.shape[1]

# dim = (200, int(img.shape[0] * r))
resized = cv2.resize(img, (256, 256), interpolation=cv2.INTER_AREA)
cv2.imwrite("out.jpg", resized)
