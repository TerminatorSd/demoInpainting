
import cv2

ori_mask = cv2.imread('../inpainting_result/object_mask.jpg')
white_zero_mask = cv2.imread('../inpainting_upload/white_zero_mask.jpg')

point_list = []

def doNarrow(ori_mask, name):
    # row shape[0] height
    # col shape[1] width
    print(ori_mask.shape)
    mask_shape = ori_mask.shape
    for row in range(mask_shape[0]):
        for col in range(mask_shape[1]):
            if(ori_mask[row][col][0] > 250):
                point_left = ori_mask[row][col - 1]
                point_right = ori_mask[row][col + 1]
                point_top = ori_mask[row - 1][col]
                point_bottom = ori_mask[row + 1][col]
                if(point_left[0] < 10 or point_right[0] < 10 or point_top[0] < 10 or point_bottom[0] < 10):
                    point_list.append(str(row) + ',' + str(col))

    for index in range(len(point_list)):
        loc = point_list[index]
        row = int(loc.split(',')[0])
        col = int(loc.split(',')[1])
        ori_mask[row][col][0] = 0
        ori_mask[row][col][1] = 0
        ori_mask[row][col][2] = 0

    cv2.imwrite(name + '_narrow.jpg', ori_mask)

doNarrow(ori_mask, '../inpainting_result/object_mask')
doNarrow(white_zero_mask, '../inpainting_upload/white_zero_mask')
# print(len(point_list))
