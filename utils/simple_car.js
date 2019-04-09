const { runCmd } = require('./cmd')

runCmd('start my simple_car_1 inpainting...',
    'cd ../generative_inpainting/test/simple_car && python test_1.py',
    'generative inpainting done!',
    1000)

runCmd('start my simple_car_2 inpainting...',
    'cd ../generative_inpainting/test/simple_car && python test_2.py',
    'generative inpainting done!',
    2000)

runCmd('start my simple_car_3 inpainting...',
    'cd ../generative_inpainting/test/simple_car && python test_3.py',
    'generative inpainting done!',
    3000)

runCmd('start my simple_car_4 inpainting...',
    'cd ../generative_inpainting/test/simple_car && python test_4.py',
    'generative inpainting done!',
    4000)

runCmd('start my simple_car_5 inpainting...',
    'cd ../generative_inpainting/test/simple_car && python test_5.py',
    'generative inpainting done!',
    5000)