
import os

path = '../paper_site/x1/'

res_dic = {}
file_num = 0

for maindir, subdir, file_name_list in os.walk(path):
	for filename in file_name_list:
		if filename == 'ass.txt':
			file_num += 1
			file_path = os.path.join(maindir, filename)
			try:
				f = open(file_path, 'r')
        # 包含十八条记录的数组
				content = f.readlines()
				length = len(content)
				for index in range(length):
					info = content[index].strip().split(': ')
					name = info[0]
					# 包含三个数字
					score = info[1]
					score_arr = score.split(',')
					if res_dic.get(name + '_mse', 0) != 0:
						res_dic.update({name + '_mse': float(res_dic[name + '_mse']) + float(score_arr[0])})
					else:
						res_dic[name + '_mse'] = float(score_arr[0])

					if res_dic.get(name + '_psnr', 0) != 0:
						res_dic.update({name + '_psnr': float(res_dic[name + '_psnr']) + float(score_arr[1])})
					else:
						res_dic[name + '_psnr'] = float(score_arr[1])

					if res_dic.get(name + '_ssim', 0) != 0:
						# if name == 'gi_my9':
						# 	print(score_arr[2])
						res_dic.update({name + '_ssim': float(res_dic[name + '_ssim']) + float(score_arr[2])})
					else:
						res_dic[name + '_ssim'] = float(score_arr[2])
			finally:
				if f:
					f.close()

for key in res_dic:
	res_dic[key] = res_dic[key] / file_num

print (res_dic)

