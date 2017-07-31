var getStatus=function(value){
	let num=Number.parseInt(value)
	switch(num)
	{
	case 0:
	  return '待处理'
	  break;
	case 1:
	  return '处理中'
	  break;
	case 2:
	  return '已完成'
	  break;
	default:
	  return '其它'
	}
}
var getStatusBadge=function(value){
	let num=Number.parseInt(value)
	switch(num)
	{
	case 0:
	  return 'mui-badge mui-badge-warning'
	  break;
	case 1:
	  return 'mui-badge mui-badge-success'
	  break;
	case 2:
	  return 'mui-badge '
	  break;
	default:
	  return 'mui-badge mui-badge-danger'
	}
}
/**
 * @alias getUUID
 * @description 生成uuid
 */
var generateUUID=function() {
var d = new Date().getTime();
var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  var r = (d + Math.random()*16)%16 | 0;
  d = Math.floor(d/16);
  return (c=='x' ? r : (r&0x3|0x8)).toString(16);
});
return uuid;
};
function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
  	var width = img.width;
  	var height = img.height;
  	// 按比例压缩4倍
  	var rate = (width<height ? width/height : height/width)/4;
  	canvas.width = width*rate; 
  	canvas.height = height*rate; 
  	ctx.drawImage(img,0,0,width,height,0,0,width*rate,height*rate);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null; 
  };
  img.src = url;
}
function getImgToBase64(url, callback,iWidth,iHeight, outputFormat){
  var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
  	var width = img.width;
  	var height = img.height;
  	canvas.width = iWidth; 
  	canvas.height = iHeight; 
  	ctx.drawImage(img,0,0,width,height,0,0,iWidth,iHeight);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null; 
  };
  img.src = url;
}
