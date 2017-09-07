/**
 * @param serverUrl 服務器地址
 * @param userId 當前用戶id
 * @param pageSize 每页数据
 */
var userApp={
	serverUrl:"http://supplier.foxconn.com/yupintest/api",//"http://supplier.foxconn.com/yupin/api",
	imgServerUrl:"http://supplier.foxconn.com/yupintest/api",
	userId:'',
	pageSize:5,
	//打开新页面
	openCreatePage:function(id,value,title){
				mui.openWindowWithTitle({
				    url:value,
				    id:id,
				    extras:{
				        name:'',
				        status:0
				    }
				})
			},
getStatus:function(value){
	var num=Number.parseInt(value)
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
	case 3:
	  return '已结案'
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
	  return 'mui-badge mui-badge-danger'
	  break;
	case 1:
	  return 'mui-badge mui-badge-warning'
	  break;
	case 2:
	  return 'mui-badge mui-badge-success'
	  break;
	case 3:
	  return 'mui-badge mui-badge-success'
	  break;
	default:
	  return 'mui-badge'
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
// 压缩图片
compressImage:function ({url:url, size:size}){
	return new Promise((resolve,reject)=>{
		let sSize = parseInt(size) / 1024, //取得图片文件的大小KB
			rate = 100;
		console.log(rate)
		plus.zip.compressImage({
				src: url,
				dst: "_doc/cm.jpg",
				quality: rate,
				width:"640px",
				overwrite: true
			},
			function(i) {
				console.log("压缩图片成功原来大小" + url+"size:"+sSize+"kb")
				console.log("压缩图片成功：" + (i.size/1024)+"kb")
				resolve(i);
			},
			function(e) {
				console.log("压缩图片失败: " + JSON.stringify(e));
			});
	})
	
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
	console.log(userID)
	return new Promise((resolve,reject)=>{
		mui.ajax(this.serverUrl+'/'+projectName+'/GetList',{
		data:{ userID:userID,Page:Page,pageSize:pageSize,status:"0"},
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
	
},
Post:function(url,gdata){
	console.log(url)
	console.log(JSON.stringify(gdata))
	return new Promise((resolve,reject)=>{
		if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
				return reject('似乎已断开与互联网的连接')
		}
		mui.ajax(url,{
			data:gdata,
			headers: {'Content-Type':'application/json'},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(response){
				return resolve(response)
			},
			error:function(xhr,type,errorThrown){
				return reject(errorThrown)
			}
		});
	})	
},
Get:function(url,gdata){
	return new Promise((resolve,reject)=>{
		if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
				return reject('似乎已断开与互联网的连接')
		}
		mui.ajax(url,{
			data:gdata,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				resolve(data)
			},
			error:function(xhr,type,errorThrown){
				reject(errorThrown)
			}
		});
	})
},
/**
 *@description 关闭预加载窗口 
 * @param {Object} obj 需关闭的预加载页面数组
 */
clearView: function(obj) {
	for(let i of obj) {
		if(plus.webview.getWebviewById(i)) {
			plus.webview.getWebviewById(i).close();
		}
	}
},
checkImg:function(url){
	return new Promise((resolve,reject)=>{
		let img=new Image
		img.onload=function(){
			return resolve(true)
		}
		img.onerror=function(){
			return resolve(false)
		}
		img.src=url
	})
}
}
/**
			 * 格式化时间的辅助类，将一个时间转换成x小时前、y天前等
			 */
			var dateUtils = {
				UNITS: {
					'年': 31557600000,
					'月': 2629800000,
					'天': 86400000,
					'小时': 3600000,
					'分钟': 60000,
					'秒': 1000
				},
				humanize: function(milliseconds) {
					var humanize = '';
					mui.each(this.UNITS, function(unit, value) {
						if(milliseconds >= value) {
							humanize = Math.floor(milliseconds / value) + unit + '前';
							return false;
						}
						return true;
					});
					return humanize || '刚刚';
				},
				format: function(dateStr) {
					var date = this.parse(dateStr)
					var diff = Date.now() - date.getTime();
					if(diff < this.UNITS['天']) {
						return this.humanize(diff);
					}
					
					var _format = function(number) {
						return(number < 10 ? ('0' + number) : number);
					};
					return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()); //+ '-' + _format(date.getHours()) + ':' + _format(date.getMinutes());
				},
				parse:function (str) {//将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
					var a = str.split(/[^0-9]/);
					return new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5] );
				}
			};
var shareHelper={
	shareHandler:function(obj){
		return function(){
			shareHref(obj)
//					var btnArray = [{title:"微信朋友圈"},{title:"微信好友"}];
//					plus.nativeUI.actionSheet( {
//						title:"分享链接",
//						cancel:"取消",
//						buttons:btnArray
//					}, function(e){
//						var index = e.index;
//						var text = "你刚点击了\"";
//						switch (index){
//							case 0:
//								text += "取消";
//								break;
//							case 1:
//								text += "微信朋友圈";
//								break;
//							case 2:
//								text += "微信好友";
//								break;
//						}
//						plus.nativeUI.alert("功能完善中："+obj.guid)
//					} );
				}
	}
}
var taskTrack={
getStatus:function(value){
	var num=Number.parseInt(value)
	switch(num)
	{
	case 0:
	  return '待处理'
	  break;
	case 1:
	  return '处理中'
	  break;
	case 2:
	  return '处理中'
	  break;
	case 3:
	  return '已结案'
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
	  return 'mui-badge mui-badge-danger'
	  break;
	case 1:
	  return 'mui-badge mui-badge-warning'
	  break;
	case 2:
	  return 'mui-badge mui-badge-warning'
	  break;
	case 3:
	  return 'mui-badge mui-badge-success'
	  break;
	default:
	  return 'mui-badge'
	}
},
}
