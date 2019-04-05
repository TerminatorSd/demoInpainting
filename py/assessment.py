#coding:utf-8
import os
import numpy as np
import argparse
import cv2
import math
import skimage 

parser = argparse.ArgumentParser()
parser.add_argument('--path', default='../inpainting_result/', type=str,
                    help='The filename of image to be completed.')
parser.add_argument('--input_img', default='../inpainting_upload/input.jpg', type=str,
                    help='The filename of image to be completed.')

mse = skimage.measure.compare_mse 
psnr = skimage.measure.compare_psnr
ssim = skimage.measure.compare_ssim

args = parser.parse_args()
input_img = cv2.imread(args.input_img)
path = args.path

res = ''
# bianli result and load images
for maindir, subdir, file_name_list in os.walk(path):
	for file_item in file_name_list:
		if file_item.split('.')[1] == 'jpg':
			file_dir = os.path.join(maindir, file_item)
			now_img = cv2.imread(file_dir)
			print(file_dir)
			if now_img.shape != input_img.shape:
				now_img = cv2.resize(now_img, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)
			
			file_name = file_item.split('.')[0]
			while len(file_name) < 15:
				file_name = ' ' + file_name

			temp_str = file_name + ': '
			temp_str += str(mse(now_img, input_img)) + ','
			temp_str += str(psnr(now_img, input_img)) + ','
			temp_str += str(ssim(now_img, input_img, multichannel=True)) + ',\n'
			res += temp_str

# print(res)
with open(path + '/ass.txt', 'w') as f:
    f.write(res)
          

# load the two input images
# input_img = cv2.imread('../inpainting_upload/input.jpg')

# if gl_out_img.shape != input_img.shape:
#     gl_out_img = cv2.resize(gl_out_img, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

# print('gl_out:', mse(input_img, gl_out_img), psnr(input_img, gl_out_img), ssim(input_img, gl_out_img, multichannel=True))

# construct the argument parse and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument("--first_img", default='../inpainting_result/gi_out_ddy_style_5.jpg',
#     help="first input image")
# ap.add_argument("--second_img", default='../inpainting_upload/input.jpg',
#     help="second")
# args = vars(ap.parse_args())