// var DOMAIN = 'http://inpainting.shaodongweb.top:6600';
var DOMAIN = 'http://localhost:8300';

// 用户选择图片，判断图片是否超过规定大小，如果超过，需要使用canvas resize，否则直接显示
// 设置mask canvas 的大小与图片一致
// 上传的时候先上传mask，图片需要根据是否有调整过大小使用不同的代码上传
// 很麻烦！

var inpaint_num = 0;

$(document).ready(function() {

  // setCanvasSizeAndListener();

  // 图片选择预览
  $('#img_upload').change(function(){  
    var file = this.files[0];
    var objUrl = getObjectURL(file);

    //获取文件信息  
    // console.log('objUrl = '+ objUrl);  
    if (objUrl) {  
      $('#img_show').attr('src', objUrl);  
      setTimeout(function() {
        // 传入图片名
        setCanvasSizeAndListener(file);
      }, 0);
    }   
  }); 

});
 
function getObjectURL(file) {  
  console.log(file);
  var url = null;   
  if(window.createObjectURL != undefined) {  
    url = window.createObjectURL(file) ;  
  } else if (window.URL != undefined) { 
    // mozilla(firefox)  
    url = window.URL.createObjectURL(file) ;  
  } else if (window.webkitURL != undefined) { 
    // webkit or chrome  
    url = window.webkitURL.createObjectURL(file) ;  
  }  
  return url;  
}  

function setCanvasSizeAndListener(file) {
  // 获取图片name
  var name = file.name ? file.name : 'default.jpg';

  // 获取canvas 对象，这个canvas 用来绘制mask
  var canvas_dom = document.getElementById('canvas_draw');
  var ctx = canvas_dom.getContext('2d');  

  // 获取选中图片宽高
  var img = new Image();
  // img.crossOrigin = 'Anonymous';
  var imgDom = document.getElementById('img_show');
  img.src = imgDom.src;

  // 压缩后的图片属性
  var resImg = {};
  img.onload = function () {
    // 把图片转换为base64，如果图片太大，需要压缩
    var compressedImg = compressImg(img, resImg);
    imgDom.src = resImg.src;

    // 设置mask canvas 宽高
    canvas_dom.width = resImg.width;
    canvas_dom.height = resImg.height;
  }

  // 添加清除功能
  $('#clear_all').click(function(){
      canvas_dom.height = canvas_dom.height;
  });

  // 上传掩膜
  $('#mask').click(function() {
    // 产生遮罩
    var image = canvas_dom.toDataURL("image/jpg"); 

    // 上传遮罩
    $.ajax({
      type: 'post',
      url: DOMAIN + '/mask/save' ,
      data: {
        name: name,
        base64: image,
        type: 'mask'
      },
      success: function(res) {
        if(res.code == 0) {
          console.log('ha')
        }
      },
      dataType: 'json'
    });
  }) 

  // inpaint 功能
  $('#inpaint').off('click').click(function() {
    // 产生遮罩
    var image = canvas_dom.toDataURL("image/jpg"); 
    inpaint_num++;

    // 上传遮罩
    $.ajax({
      type: 'post',
      url: DOMAIN + '/img/upload' ,
      data: {
        name: name,
        base64: image,
        type: 'mask'
      },
      success: function(res) {
        if(res.code == 0) {
          if(resImg.resize) {
            console.log('resize');
            // 上传图片，第一种情况，resize 过的
            $.ajax({
              type: 'post',
              url: DOMAIN + '/img/upload' ,
              data: {
                name: file.name,
                base64: imgDom.src,
                type: 'input'
              },
              success: function(res) {
                if(res.code == 0) {
                  // 上传图片

                }
              },
              dataType: 'json'
            });
          } else {
            console.log('no resize');
            var a = new FileReader();
            a.onload = (e) => {
              // 获取base64
              var base64 = e.target.result;
              // 上传图片
              $.ajax({
                type: 'post',
                url: DOMAIN + '/img/upload' ,
                data: {
                  name: 'input' + file.name.split('.')[1],
                  base64: base64,
                  type: 'input'
                },
                success: function(res) {
                  if(res.code == 0) {
                    // 上传图片

                  }
                },
                dataType: 'json'
              });
            };
            a.readAsDataURL(file);
          }
         
        }
      },
      dataType: 'json'
    });
    
    // 设定定时器，获取结果
    var countNum = 20;
    var resDom = document.getElementsByClassName('res')[0];
    resDom.style.display = 'none';
    var maskDom = document.getElementsByClassName('mask')[0];
    maskDom.style.display = 'none';
    var ajaxDom = document.getElementsByClassName('ajax')[0];
    ajaxDom.style.display = 'block';

    var intId = setInterval(function () {
      countNum--;
      ajaxDom.innerText = '将于' + countNum + 's后请求服务器端修复结果...';
      if (countNum === 0) {
        clearInterval(intId)
        ajaxDom.style.display = 'none'
      }
    }, 1000)

    // var prefix = '/Users/shaodong/myGit/demoInpainting/inpainting_result/';
    var prefix = 'http://inpainting.shaodongweb.top/res_img';
    // var maskPrefix = '/Users/shaodong/myGit/demoInpainting/inpainting_upload/';
    var maskPrefix = 'http://inpainting.shaodongweb.top/res_img';
    setTimeout(function() {

      // 发送请求获取ass.txt 内容
      $.ajax({
        type: 'get',
        url: DOMAIN + '/res/ass' ,
        data: {
          name: file.name,
          base64: imgDom.src,
          type: 'input'
        },
        success: function(res) {
          // 显示修复结果及定量分析结果
          if(res.code == 0) {
            data = res.data;
            console.log(res.data)
            var blackZeroDom = document.getElementsByClassName('black_zero')[0];
            var whiteZeroDom = document.getElementsByClassName('white_zero')[0];
            var glDom = document.getElementsByClassName('g_l')[0];
            var irDom = document.getElementsByClassName('ir')[0];
            var geImgDom = document.getElementsByClassName('generative_imagenet')[0];
            var gePlsDom = document.getElementsByClassName('generative_places2')[0];
            var mineDom = document.getElementsByClassName('mine')[0];

            resDom.style.display = 'block';
            maskDom.style.display = 'block';
            blackZeroDom.src = maskPrefix + 'black_zero_mask.jpg?v=' + inpaint_num;
            whiteZeroDom.src = maskPrefix + 'white_zero_mask.jpg?v=' + inpaint_num;
            glDom.src = prefix + 'gl_out.jpg?v=' + inpaint_num;
            irDom.src = prefix + 'ir_out.jpg?v=' + inpaint_num;
            geImgDom.src = prefix + 'gi_out_imagenet.jpg?v=' + inpaint_num;
            gePlsDom.src = prefix + 'gi_out_places2.jpg?v=' + inpaint_num;
            mineDom.src = prefix + 'para_4_normal_9.jpg?v=' + inpaint_num;

            // mse、psnr、ssim
            var glMse = document.getElementsByClassName('gl_mse')[0];
            var glPsnr = document.getElementsByClassName('gl_psnr')[0];
            var glSsim = document.getElementsByClassName('gl_ssim')[0];
            var irMse = document.getElementsByClassName('ir_mse')[0];
            var irPsnr = document.getElementsByClassName('ir_psnr')[0];
            var irSsim = document.getElementsByClassName('ir_ssim')[0]; 
            var gi_img_Mse = document.getElementsByClassName('gi_img_mse')[0];
            var gi_img_Psnr = document.getElementsByClassName('gi_img_psnr')[0];
            var gi_img_Ssim = document.getElementsByClassName('gi_img_ssim')[0];
            var gi_pls_Mse = document.getElementsByClassName('gi_pls_mse')[0];
            var gi_pls_Psnr = document.getElementsByClassName('gi_pls_psnr')[0];
            var gi_pls_Ssim = document.getElementsByClassName('gi_pls_ssim')[0];
            var mineMse = document.getElementsByClassName('mine_mse')[0];
            var minePsnr = document.getElementsByClassName('mine_psnr')[0];
            var mineSsim = document.getElementsByClassName('mine_ssim')[0];

            glMse.innerText = 'MSE: ' + parseFloat(data['gl_out'][0]).toFixed(3);
            glPsnr.innerText = 'PSNR: ' + parseFloat(data['gl_out'][1]).toFixed(3);
            glSsim.innerText = 'SSIM: ' + parseFloat(data['gl_out'][2]).toFixed(3);
            irMse.innerText = 'MSE: ' + parseFloat(data['ir_out'][0]).toFixed(3);
            irPsnr.innerText = 'PSNR: ' + parseFloat(data['ir_out'][1]).toFixed(3);
            irSsim.innerText = 'SSIM: ' + parseFloat(data['ir_out'][2]).toFixed(3);
            gi_img_Mse.innerText = 'MSE: ' + parseFloat(data['gi_out_imagenet'][0]).toFixed(3);
            gi_img_Psnr.innerText = 'PSNR: ' + parseFloat(data['gi_out_imagenet'][1]).toFixed(3);
            gi_img_Ssim.innerText = 'SSIM: ' + parseFloat(data['gi_out_imagenet'][2]).toFixed(3);
            gi_pls_Mse.innerText = 'MSE: ' + parseFloat(data['gi_out_places2'][0]).toFixed(3);
            gi_pls_Psnr.innerText = 'PSNR: ' + parseFloat(data['gi_out_places2'][1]).toFixed(3);
            gi_pls_Ssim.innerText = 'SSIM: ' + parseFloat(data['gi_out_places2'][2]).toFixed(3);
            mineMse.innerText = 'MSE: ' + parseFloat(data['para_4_normal_9'][0]).toFixed(3);
            minePsnr.innerText = 'PSNR: ' + parseFloat(data['para_4_normal_9'][1]).toFixed(3);
            mineSsim.innerText = 'SSIM: ' + parseFloat(data['para_4_normal_9'][2]).toFixed(3);
          }
        },
        dataType: 'json'
      });
      
    }, countNum * 1000)
  })

  //用来判断鼠标是否还在按下
  var down_flag = false;

  //监听事件
  $('canvas').mousedown(function(e){
    //鼠标按下时的事件
    down_flag = true;
    var ev = ev || window.event;
    ctx.moveTo(ev.clientX - canvas_dom.offsetLeft, ev.clientY - canvas_dom.offsetTop);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 10;
  }).mouseup(function(e){
    //鼠标抬起事件
    down_flag = false;
  }).mousemove(function(e){
    //鼠标移动事件
    if(down_flag) {
      var ev = ev || window.event;
      ctx.lineTo(ev.clientX - canvas_dom.offsetLeft, ev.clientY - canvas_dom.offsetTop);
      ctx.stroke();
    }
  })
}

function compressImg(img, res) {
  // 缩放图片需要的canvas
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var maxSize = 660,
      oriWidth = img.width,
      oriHeight = img.height,
      tarWidth = img.width,
      tarHeight = img.height;
  var max = oriWidth > oriHeight ? oriWidth : oriHeight;

  if(max > maxSize) {
    // 宽度压缩到800，高度相应压缩
    if(oriWidth > oriHeight) {
      tarWidth = maxSize;
      tarHeight = Math.round(oriHeight * (maxSize / oriWidth));
    } else {
      tarHeight = maxSize;
      tarWidth = Math.round(oriWidth * (maxSize / oriHeight));
    }
  } 
  else {
    res.width = tarWidth;
    res.height = tarHeight;
    res.src = img.src;
    return;
  }

  // tarWidth = 256;
  // tarHeight = 256;
  // canvas对图片进行缩放
  res.width = tarWidth;
  res.height = tarHeight;

  canvas.width = tarWidth;
  canvas.height = tarHeight;
  // 清除画布
  context.clearRect(0, 0, tarWidth, tarHeight);
  // 图片压缩
  context.drawImage(img, 0, 0, tarWidth, tarHeight);
  res.resize = true;
  res.src = canvas.toDataURL("image/png");

  return ;

}
