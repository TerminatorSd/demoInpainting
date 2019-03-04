#coding:utf-8
import numpy as np

def psnr(im1,im2):
    diff = np.abs(im1 - im2)
    rmse = np.sqrt(diff).sum()
    psnr = 20*np.log10(255/rmse)
    return psnr

x = np.array([[1,2],[3,4]])
print (x)
y = np.array([[5,6],[7,8]])
print (y)

psnr = psnr(x,y)
print (psnr)

def mse(imageA, imageB):
    # the 'Mean Squared Error' between the two images is the
    # sum of the squared difference between the two images;
    # NOTE: the two images must have the same dimension
    err = np.sum((imageA.astype("float") - imageB.astype("float")) ** 2)
    err /= float(imageA.shape[0] * imageA.shape[1])

    # return the MSE, the lower the error, the more "similar"
    # the two images are
    return err

from skimage.measure import compare_ssim
#~ import skimage  as ssim
import argparse
import imutils
import cv2

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-f", "--first", required=True,
    help="first input image")
ap.add_argument("-s", "--second", required=True,
    help="second")
args = vars(ap.parse_args())
# load the two input images
imageA = cv2.imread(args["first"])
imageB = cv2.imread(args["second"])
'''
imageA = cv2.imread("E:\\1.png")
imageB = cv2.imread("E:\\2.png")
'''
# convert the images to grayscale
grayA = cv2.cvtColor(imageA, cv2.COLOR_BGR2GRAY)
grayB = cv2.cvtColor(imageB, cv2.COLOR_BGR2GRAY)

# compute the Structural Similarity Index (SSIM) between the two
# images, ensuring that the difference image is returned
#​structural similarity index measurement (SSIM) system一种衡量两幅图像结构相似度的新指标，其值越大越好，最大为1。

(score, diff) = compare_ssim(grayA, grayB, full=True)
diff = (diff * 255).astype("uint8")
print("SSIM: {}".format(score))

# threshold the difference image, followed by finding contours to
# obtain the regions of the two input images that differ
thresh = cv2.threshold(diff, 0, 255,
    cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if imutils.is_cv2() else cnts[1]

# loop over the contours
for c in cnts:
    # compute the bounding box of the contour and then draw the
    # bounding box on both input images to represent where the two
    # images differ
    (x, y, w, h) = cv2.boundingRect(c)
    cv2.rectangle(imageA, (x, y), (x + w, y + h), (0, 0, 255), 2)
    cv2.rectangle(imageB, (x, y), (x + w, y + h), (0, 0, 255), 2)

# show the output images
cv2.imshow("Original", imageA)
cv2.imshow("Modified", imageB)
cv2.imshow("Diff", diff)
cv2.imshow("Thresh", thresh)
cv2.waitKey(0)