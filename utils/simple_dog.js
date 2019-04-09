const { runCmd } = require('./cmd')

runCmd('start my simple_dog_1 inpainting...',
    'cd ../generative_inpainting/test/simple_dog && python test_1.py',
    'generative inpainting done!',
    1000)

runCmd('start my simple_dog_2 inpainting...',
    'cd ../generative_inpainting/test/simple_dog && python test_2.py',
    'generative inpainting done!',
    2000)
