#coding:utf-8
import numpy as np
import argparse
import cv2
import math
import skimage 

# construct the argument parse and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument("--first_img", default='../inpainting_result/gi_out_ddy_style_5.jpg',
#     help="first input image")
# ap.add_argument("--second_img", default='../inpainting_upload/input.jpg',
#     help="second")
# args = vars(ap.parse_args())

# load the two input images
input_img = cv2.imread('../inpainting_upload/input.jpg')
gl_out_img = cv2.imread('../inpainting_result/gl_out.jpg')
gi_out_pls = cv2.imread('../inpainting_result/gi_out_places2.jpg')
gi_out_int = cv2.imread('../inpainting_result/gi_out_imagenet.jpg')
ir_out = cv2.imread('../inpainting_result/ir_out.jpg')
gi_img_my_1 = cv2.imread('../inpainting_result/gi_out_mine_1.jpg')
gi_img_my_2 = cv2.imread('../inpainting_result/gi_out_mine_2.jpg')
gi_img_my_3 = cv2.imread('../inpainting_result/gi_out_mine_3.jpg')
gi_img_my_4 = cv2.imread('../inpainting_result/gi_out_mine_4.jpg')
gi_img_my_5 = cv2.imread('../inpainting_result/gi_out_mine_5.jpg')
gi_img_my_6 = cv2.imread('../inpainting_result/gi_out_mine_6.jpg')
gi_img_my_7 = cv2.imread('../inpainting_result/gi_out_mine_7.jpg')
gi_img_my_8 = cv2.imread('../inpainting_result/gi_out_mine_8.jpg')
gi_img_my_9 = cv2.imread('../inpainting_result/gi_out_mine_9.jpg')
# imageA = cv2.imread(args["first_img"])
# imageB = cv2.imread(args["second_img"])

if gl_out_img.shape != input_img.shape:
    gl_out_img = cv2.resize(gl_out_img, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_out_pls.shape != input_img.shape:
    gi_out_pls = cv2.resize(gi_out_pls, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_out_int.shape != input_img.shape:
    gi_out_int = cv2.resize(gi_out_int, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if ir_out.shape != input_img.shape:
    ir_out = cv2.resize(ir_out, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_1.shape != input_img.shape:
    gi_img_my_1 = cv2.resize(gi_img_my_1, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_2.shape != input_img.shape:
    gi_img_my_2 = cv2.resize(gi_img_my_2, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_3.shape != input_img.shape:
    gi_img_my_3 = cv2.resize(gi_img_my_3, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_4.shape != input_img.shape:
    gi_img_my_4 = cv2.resize(gi_img_my_4, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_5.shape != input_img.shape:
    gi_img_my_5 = cv2.resize(gi_img_my_5, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_6.shape != input_img.shape:
    gi_img_my_6 = cv2.resize(gi_img_my_6, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_7.shape != input_img.shape:
    gi_img_my_7 = cv2.resize(gi_img_my_7, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_8.shape != input_img.shape:
    gi_img_my_8 = cv2.resize(gi_img_my_8, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

if gi_img_my_9.shape != input_img.shape:
    gi_img_my_9 = cv2.resize(gi_img_my_9, (input_img.shape[1], input_img.shape[0]),interpolation=cv2.INTER_AREA)

# def L1(x, y):
#     loss = np.mean(np.abs(y - x))
#     return loss

mse = skimage.measure.compare_mse 
psnr = skimage.measure.compare_psnr
ssim = skimage.measure.compare_ssim

print('gl_out:', mse(input_img, gl_out_img), psnr(input_img, gl_out_img), ssim(input_img, gl_out_img, multichannel=True))
print('gi_pls:', mse(input_img, gi_out_pls), psnr(input_img, gi_out_pls), ssim(input_img, gi_out_pls, multichannel=True))
print('gi_int:', mse(input_img, gi_out_int), psnr(input_img, gi_out_int), ssim(input_img, gi_out_int, multichannel=True))
print('irregular:', mse(input_img, ir_out), psnr(input_img, ir_out), ssim(input_img, ir_out, multichannel=True))
print('gi_my1:', mse(input_img, gi_img_my_1), psnr(input_img, gi_img_my_1), ssim(input_img, gi_img_my_1, multichannel=True))
print('gi_my2:', mse(input_img, gi_img_my_2), psnr(input_img, gi_img_my_2), ssim(input_img, gi_img_my_2, multichannel=True))
print('gi_my3:', mse(input_img, gi_img_my_3), psnr(input_img, gi_img_my_3), ssim(input_img, gi_img_my_3, multichannel=True))
print('gi_my4:', mse(input_img, gi_img_my_4), psnr(input_img, gi_img_my_4), ssim(input_img, gi_img_my_4, multichannel=True))
print('gi_my5:', mse(input_img, gi_img_my_5), psnr(input_img, gi_img_my_5), ssim(input_img, gi_img_my_5, multichannel=True))
print('gi_my6:', mse(input_img, gi_img_my_6), psnr(input_img, gi_img_my_6), ssim(input_img, gi_img_my_6, multichannel=True))
print('gi_my7:', mse(input_img, gi_img_my_7), psnr(input_img, gi_img_my_7), ssim(input_img, gi_img_my_7, multichannel=True))
print('gi_my8:', mse(input_img, gi_img_my_8), psnr(input_img, gi_img_my_8), ssim(input_img, gi_img_my_8, multichannel=True))
print('gi_my9:', mse(input_img, gi_img_my_9), psnr(input_img, gi_img_my_9), ssim(input_img, gi_img_my_9, multichannel=True))
