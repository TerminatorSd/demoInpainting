
import cv2

def doDilation(ori_mask, name):
    point_list = []
    # row shape[0] height
    # col shape[1] width
    print(ori_mask.shape)
    mask_shape = ori_mask.shape
    for row in range(mask_shape[0]):
        for col in range(mask_shape[1]):
            if(ori_mask[row][col][0] > 200):
                point_left = str(row) + ',' + str(col - 1)
                point_right = str(row) + ',' + str(col + 1)
                point_top = str(row - 1) + ',' + str(col)
                point_bottom = str(row + 1) + ',' + str(col)
                point_list.append(point_left)
                point_list.append(point_right)
                point_list.append(point_top)
                point_list.append(point_bottom)

    for index in range(len(point_list)):
        loc = point_list[index]
        row = int(loc.split(',')[0])
        col = int(loc.split(',')[1])
        ori_mask[row][col][0] = 255
        ori_mask[row][col][1] = 255
        ori_mask[row][col][2] = 255

    cv2.imwrite(name + '_dila.jpg', ori_mask)

ori_mask = cv2.imread('../inpainting_result/object_area_mask.jpg')
doDilation(ori_mask, '../inpainting_result/object_area_mask')
ori_mask = cv2.imread('../inpainting_result/object_area_mask_dila.jpg')
doDilation(ori_mask, '../inpainting_result/object_area_mask')

# doDilation(white_zero_mask, '../inpainting_upload/white_zero_mask')
# print(len(point_list))
