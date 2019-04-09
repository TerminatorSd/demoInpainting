const { runCmd } = require('./cmd')

runCmd('start my para_4_no_pre_car_1 inpainting...',
    'cd ../generative_inpainting/test/para_4_no_pre_car && python test_1.py',
    'para_4_no_pre_car_1 inpainting done!',
    1000)

runCmd('start my para_4_no_pre_car_2 inpainting...',
    'cd ../generative_inpainting/test/para_4_no_pre_car && python test_2.py',
    'para_4_no_pre_car_2 inpainting done!',
    2000)

runCmd('start my para_4_no_pre_car_3 inpainting...',
    'cd ../generative_inpainting/test/para_4_no_pre_car && python test_3.py',
    'para_4_no_pre_car_3 inpainting done!',
    3000)

runCmd('start my para_4_pre_88_car_1 inpainting...',
    'cd ../generative_inpainting/test/para_4_pre_88_car && python test_1.py',
    'para_4_pre_88_car_1 inpainting done!',
    4000)

runCmd('start my para_4_pre_88_car_2 inpainting...',
    'cd ../generative_inpainting/test/para_4_pre_88_car && python test_2.py',
    'para_4_pre_88_car_2 inpainting done!',
    5000)

// runCmd('start my para_4_pre_88_car_3 inpainting...',
//     'cd ../generative_inpainting/test/para_4_pre_88_car && python test_3.py',
//     'para_4_pre_88_car_3 inpainting done!',
//     6000)

