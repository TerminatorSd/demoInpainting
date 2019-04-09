const { runCmd } = require('./cmd')

runCmd('start my para_4_small_1 inpainting...',
    'cd ../generative_inpainting/test/para_4_small && python test_1.py',
    'inpainting done!',
    1000)

runCmd('start my para_4_small_2 inpainting...',
    'cd ../generative_inpainting/test/para_4_small && python test_2.py',
    'inpainting done!',
    2000)

runCmd('start my para_4_small_3 inpainting...',
    'cd ../generative_inpainting/test/para_4_small && python test_3.py',
    'inpainting done!',
    3000)

runCmd('start my para_4_small_4 inpainting...',
    'cd ../generative_inpainting/test/para_4_small && python test_4.py',
    'inpainting done!',
    4000)

runCmd('start my para_4_small_5 inpainting...',
    'cd ../generative_inpainting/test/para_4_small && python test_5.py',
    'inpainting done!',
    5000)
