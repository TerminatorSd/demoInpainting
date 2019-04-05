# -*- coding: UTF-8 -*-
# 根据用户绘制mask 获得种子点，由种子点获取到mask 所覆盖的目标外围矩形框

import cv2
import numpy as np

# 设定colour_scheme_gray
colour_scheme = {
  0: 'bg',
  38: 'planet',
  75: 'bike',
  113: 'bird',
  15: 'boat',
  53: 'bottle',
  90: 'bus',
  72: 'horse',
  34: 'dog',
  133: 'dining-table',
  94: 'cow',
  57: 'chair',
  19: 'cat',
  128: 'car',
  109: 'motro-bike',
  147: 'person',
  76: 'sheep',
  113: 'sofa',
  151: 'train',
  52: 'tv',
}


# 读取mask 和seg_res
mask = cv2.imread('../inpainting_upload/white_zero_mask.jpg')
# 修复后图像的语义分割结果
seg_res = cv2.imread('../inpainting_result/in_seg_res.jpg')
input_img = cv2.imread('../inpainting_upload/input.jpg')
mask_gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
seg_res_gray = cv2.cvtColor(seg_res, cv2.COLOR_BGR2GRAY)

# cv2.imshow("seg_res_gray", seg_res_gray)
# cv2.waitKey(0) 

# 设置跟图片大小相同的二维0矩阵
mask_shape = mask_gray.shape
zero_matrix = np.zeros(list(mask_shape[:2]))

# 遍历mask
mask_width = mask_shape[1]
mask_height = mask_shape[0]

# 找到一个矩形方块的位置，把掩膜区域框出来
rec_loc = {
  'min_left': mask_width,
  'max_right': 0,
  'min_top': mask_height,
  'max_bottom': 0
}

# 掩膜位置像素统计，结果字典包含像素值，及该像素值的数量
res_dic = {}

# 开始遍历mask
for row in range(mask_height):
  for col in range(mask_width):
    pv = mask_gray[row, col]
    if(pv > 246):

      # 找到最小的包裹方块
      if(row > rec_loc['max_bottom']):
        rec_loc['max_bottom'] = row
      if(row < rec_loc['min_top']):
        rec_loc['min_top'] = row
      if(col > rec_loc['max_right']):
        rec_loc['max_right'] = col
      if(col < rec_loc['min_left']):
        rec_loc['min_left'] = col

      # 寻找分割结果中的对应元素的值
      # print(seg_res_gray[row, col])
      # print(colour_scheme[seg_res_gray[row, col]], pv)

      # 所有不存在color_scheme中的元素都作为背景
      now_item = colour_scheme.get(seg_res_gray[row, col], 'bg')

      # print(now_item)
      if(res_dic.get(now_item, 0) != 0):
        res_dic[now_item] += 1
      else:
        res_dic[now_item] = 1

# 找到的涂抹区域中存在的对象及像素数目，还有外围的矩形方块
print('\n ** pixel type and ratio ** \n', res_dic)
print('\n ** mask box loc ** \n', rec_loc)

# 根据涂抹区域中最多的元素和其对应的物体，计算找到比重最大的数值
max_ele = {
  'num': 0,
  'item': 'bg'
}

# 涂抹区域中所有像素数目
all_ele = 0
for key in res_dic:
  all_ele += res_dic[key]
  # print(key)
  if(res_dic[key] > max_ele['num'] and key != 'bg'):
    max_ele['num'] = res_dic[key]
    max_ele['item'] = key

print('\n ** all_ele num ** \n', all_ele)
print('\n ** max_ele type and num ** \n', max_ele)

# 找到种子点灰度值，主要对象需要占比60% 
# 这里的策略是个问题，暂时先不设定任何策略
target_ele = 0
for key in colour_scheme:
  if(colour_scheme[key] == max_ele['item']):
    target_ele = key

print ('\n ** target_ele gray value ** \n', target_ele)

def findObjectBoundry(row, col, target_ele, seg_res_gray, zero_matrix):
  # seg_res_gray
  object_loc = {
    'min_left': mask_width,
    'max_right': 0,
    'min_top': mask_height,
    'max_bottom': 0
  }

  row_bk = row
  col_bk = col

  # y = row, x = col
  # pv = seg_res_gray[row][col]
  # print(seg_res_gray)
  # print(target_ele)

  # find min_top
  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    col += 1
    if col >= seg_res_gray.shape[1]:
      break

    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      row -= 1
      if object_loc['min_top'] > row:
        object_loc['min_top'] = row
    row = row_bk

  row = row_bk
  col = col_bk
  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    col -= 1
    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      row -= 1
      if object_loc['min_top'] > row:
        object_loc['min_top'] = row
    row = row_bk

  row = row_bk
  col = col_bk
  # find max_bottom
  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    col += 1
    if col >= seg_res_gray.shape[1]:
      break

    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      row += 1
      if object_loc['max_bottom'] < row:
        object_loc['max_bottom'] = row
    row = row_bk

  row = row_bk
  col = col_bk
  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    col -= 1
    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      row += 1
      if object_loc['max_bottom'] < row:
        object_loc['max_bottom'] = row
    row = row_bk

  row = row_bk
  col = col_bk
  
  # find min_left
  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    row += 1
    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      col -= 1
      if object_loc['min_left'] > col:
        object_loc['min_left'] = col
    col = col_bk
  row = row_bk
  col = col_bk

  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    row -= 1
    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      col -= 1
      if object_loc['min_left'] > col:
        object_loc['min_left'] = col
    col = col_bk

  row = row_bk
  col = col_bk

  # find max_right
  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    row += 1
    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      print(col)
      col += 1
      if col >= seg_res_gray.shape[1]:
        break

      if object_loc['max_right'] < col:
        object_loc['max_right'] = col
    col = col_bk

  row = row_bk
  col = col_bk
  while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
    row -= 1
    while(seg_res_gray[row][col] >= target_ele - 6 and seg_res_gray[row][col] <= target_ele + 6):
      col += 1
      if col >= seg_res_gray.shape[1]:
        break
        
      if object_loc['max_right'] < col:
        object_loc['max_right'] = col
    col = col_bk

  return object_loc

# 遍历seg_res_gray，其宽高与mask 一致
def findObjectBox(rec_loc, target_ele, seg_res_gray, zero_matrix):
  # 寻找种子点，从矩形框中部开始，向右下方向找
  height = rec_loc['max_bottom'] - rec_loc['min_top']
  width = rec_loc['max_right'] - rec_loc['min_left']
  for row in range(rec_loc['min_top'] + round(height / 2), rec_loc['max_bottom'] + 1):
    for col in range(rec_loc['min_left'] + round(width / 2), rec_loc['max_right'] + 1):
      pv = seg_res_gray[row][col]

      # 找到了种子点，以当前点为基础，向四周扩散
      if(pv >= target_ele - 6 and pv <= target_ele + 6):
        print('\n ** seed pos ** \n', col, row)
        return findObjectBoundry(row, col, target_ele, seg_res_gray, zero_matrix)

  # 向左上方向找
  for row in reversed(range(rec_loc['min_top'] + round(height / 2), rec_loc['max_bottom'] + 1)):
    for col in reversed(range(rec_loc['min_left'] + round(width / 2), rec_loc['max_right'] + 1)):
      pv = seg_res_gray[row][col]

      # 找到了种子点，以当前点为基础，向四周扩散
      if(pv >= target_ele - 6 and pv <= target_ele + 6):
        print(row, col)
        findObjectBoundry(row, col, target_ele, seg_res_gray, zero_matrix)
        return

# 获取目标边界框
object_loc = findObjectBox(rec_loc, target_ele, seg_res_gray, zero_matrix)
object_loc['min_top'] -= 10
object_loc['max_bottom'] += 10
object_loc['min_left'] -= 10
object_loc['max_right'] += 10
print('\n ** object_loc ** \n', object_loc)

# 在目标边界框内处理二维零矩阵，获取目标完整掩膜
for row in range(object_loc['min_top'], object_loc['max_bottom'] + 1):
  for col in range(object_loc['min_left'], object_loc['max_right'] + 1):
    pv = seg_res_gray[row][col]
    if pv >= target_ele - 6 and pv <= target_ele + 6:
      zero_matrix[row][col] = 255

# 按object loc 截取输入缺失图片
input_img_shape = input_img.shape
width = object_loc['max_right'] - object_loc['min_left'] + 1
height = object_loc['max_bottom'] - object_loc['min_top'] + 1
channel = input_img_shape[2]

# shape[0] 行 height
# shape[1] 列 width
target_obj = np.zeros((height, width, channel))
target_mask = np.zeros((height, width, channel))

for row in range(input_img_shape[0]):
  for col in range(input_img_shape[1]):
    if (row >= object_loc['min_top'] and row < object_loc['max_bottom']) and (col >= object_loc['min_left'] and col < object_loc['max_right']):
      # print('haha')
      # if zero_matrix[row][col] != 0:
      target_mask[row - object_loc['min_top']][col - object_loc['min_left']] = mask[row][col]
      for c in range(channel):
        target_obj[row - object_loc['min_top']][col - object_loc['min_left']][c] = input_img[row][col][c]

# 输出目标优化对象object_input
cv2.imwrite('../inpainting_result/object_input.jpg', target_obj)

# 输出目标区域的掩膜
cv2.imwrite('../inpainting_result/object_mask.jpg', target_mask)

# 输出目标完整区域
cv2.imwrite('../inpainting_result/object_area_mask.jpg', zero_matrix)

print('segmentation done.')

fp = open('loc.txt', 'w')
fp.write(str(object_loc))

# cv2.imshow("zero_matrix", seg_res_gray)
# cv2.waitKey(0) 



