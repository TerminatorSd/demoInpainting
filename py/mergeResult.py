
import cv2
import json

whole_img = '../inpainting_result/para_4_normal_6.jpg'
object_img = '../inpainting_result/object_output.jpg'

def merge(whole_img, object_img):

	locFile = open('loc.txt')
	try:
		object_loc = locFile.read( )
	finally:
		locFile.close( )

	# 字符串转换为对象
	object_loc = eval(object_loc)
	print(object_loc)

	
	wholeImg = cv2.imread(whole_img)
	objectImg = cv2.imread(object_img)

	object_width = objectImg.shape[1]
	object_height = objectImg.shape[0]

	print(object_height, object_width)

	# objectImg = cv2.resize(objectImg, (height, width), interpolation=cv2.INTER_AREA)

	# # cv2.imshow("zero_matrix", objectImg)
	# # cv2.waitKey(0) 
	for row in range(object_height):
		for col in range(object_width):
			if(objectImg[row][col][0] > 0 and objectImg[row][col][1] > 0):
				# print(objectImg[row][col])
				# print(col - object_loc['min_left'])
				# print(col - object_loc['min_left'])
				wholeImg[row + object_loc['min_top']][col + object_loc['min_left']] = objectImg[row][col]
	
	cv2.imwrite('../inpainting_result/optim_result.jpg', wholeImg)

merge(whole_img, object_img)