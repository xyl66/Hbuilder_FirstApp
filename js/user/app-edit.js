var userApp={
	serverUrl:"http://10.206.124.61/api",//"http://supplier.foxconn.com/yupin/api",
	userId:'',
	//打开新页面
	openCreatePage:function(value,title){
				mui.openWindowWithTitle({
				    url:value+'.html',
				    id:value,
				    extras:{
				        name:'',
				        status:0
				    }
				},{
					backgroundColor:"#f4645f",//导航栏背景色
				    title:{//标题配置
				        text:title,//标题文字
				        styles:{//绘制文本样式，参考：http://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.TextStyles
				            color:"#f0f0f0",
				            align:"center",
				            family:"'Helvetica Neue',Helvetica,sans-serif",
				            size:"17px",
				            style:"normal",
				            weight:"normal",
				            fontSrc:""
				        },
				    },
				    back:{//左上角返回箭头
				        image:{
				            base64Data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABd0lEQVR4Xu3Y4Q2CQAwFYG4UN8FJlI3cQEbRDXQTN8BeIgkxhPtB3/WVKwm/iCfvu1ZzTV3jV2o8fxcAUQGNC0QLNF4A8SMYLRAt0LhAtEDjBcD7LzBN0002Z0wpvZCbRNkCEn6U0Be5P3KfkQh0AIvw88ZDEagAVsLPCE+pgh7RCjQAG+HfErwXgFwJ6hcFgFX4rGkOYBneHMA6vCkAQ3gzAJbwJgBM4asDsIWvCsAYvhoAa/gqAMzh4QDs4aEAHsLDALyEhwB4Cq8O4C28KoCEv8qC95UDez7Hn1Dn+b0DAtXj8EYF5OHmsPdlEZ9XBcgv6A1BHcAbAgTAEwIMwAsCFMADAhyAHaEKADNCNQBWhKoAjAjVAdgQTACYEMwAWBBMARgQzAGsESgALBFoAKwQqAA2EAYZqIwuBiIaL/k3VIGFV50JagRfrvFDeKB2fv4uuhbQhiytFwAloaM/jwo4+g6X8kUFlISO/jwq4Og7XMrXfAV8AXit4EEot4OAAAAAAElFTkSuQmCC'
				        }
				    }
				})
			},
getStatus:function(value){
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
},
getStatusBadge:function(value){
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
},
/**
 * @alias getUUID
 * @description 生成uuid
 */
generateUUID:function() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = (d + Math.random()*16)%16 | 0;
	  d = Math.floor(d/16);
	  return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
},
/**
 *@description 获取base64 参数为对象:地址url,大小size,类型outType 
 *@param {Object} obj
 */
convertImgToBase64:function ({url:url, size:size, outType:outputFormat}){
	return new Promise((resolve,reject)=>{
		var canvas = document.createElement('CANVAS'),
	    ctx = canvas.getContext('2d'),
	    img = new Image;
	  	img.crossOrigin = 'Anonymous';
	  	img.onload = function(){
		  	var width = img.width;
		  	var height = img.height;
		  	let sSize=parseInt(size)/1024;//取得图片文件的大小KB
		  	console.log(sSize+'kb')
		  	let rate=1 
		  	if(sSize>2048){
			  	// 按比例压缩2倍
			  	rate= (width<height ? width/height : height/width)/2;
		  	}else if(sSize>1620){
		  		// 按比例压缩1.2倍
			  	rate= (width<height ? width/height : height/width)/1.8;
		  	}else if(sSize>1400){
		  		// 按比例压缩1.2倍
			  	rate= (width<height ? width/height : height/width)/1.5;
		  	}else if(sSize>1024){
		  		// 按比例压缩1.2倍
			  	rate= (width<height ? width/height : height/width)/1.2;
		  	}
		  	canvas.width = width*rate; 
		  	canvas.height = height*rate; 
		  	ctx.drawImage(img,0,0,width,height,0,0,width*rate,height*rate);
		    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
		    canvas = null; 
		    resolve(dataURL);
	  	};
	  	img.src = url;
	})
},
/**
 * @description 加载数据
 * @param {String} userID 用户Id
 * @param {String} Page 页数
 * @param {String} pageSize 每页数量
 */
getData:function ({userID,Page,pageSize,projectName}){
	console.log(this.serverUrl+'/'+projectName+'/GetList')
	return new Promise((resolve,reject)=>{
		mui.ajax(this.serverUrl+'/'+projectName+'/GetList',{
		data:{ userID:userID,Page:Page,pageSize:pageSize },
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(response){
			//获得服务器响应
			resolve(response)
			},
			error:function(xhr,type,errorThrown){
				reject({type:type,errthrow:errorThrown})
			}
		});
	})
},
GetDetail:function({applyId,projectName}){
	return new Promise((resolve,reject)=>{
		mui.ajax(this.serverUrl+'/'+projectName+'/GetDetail',{
			data:{
				apply_id:applyId
			},
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				//获得服务器响应
				resolve(data)
			},
			error:function(xhr,type,errorThrown){
				reject({type:type,errthrow:errorThrown})
			}
		});
	})
},
GetFlowDetail:function(apply_id){
	console.log(apply_id)
	return new Promise((resolve,rehect)=>{
		mui.get(userApp.serverUrl+'/WorkFlow/GetFlowInstance',{
				applyID:apply_id
			},function(data){
				resolve(data)
			},'json');
	})
	
}
}
