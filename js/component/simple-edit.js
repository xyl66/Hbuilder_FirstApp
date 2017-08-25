/*<!--上传照片-->*/
	var server=userApp.serverUrl+"/Attachment/PostFile";
	const newUuId=getUid();
	var files=[];
	// 上传文件
	function upload(newId,imgUrl,size){
		console.log(userApp.userId)
		return new Promise((resolve,reject)=>{
			let fname=imgUrl.substring(imgUrl.lastIndexOf("\/")+1)
			if((size/1024/1024)>4){
				plus.nativeUI.toast('上传图片过大！请重新选择(4M以内)')
			}
			plus.nativeUI.showWaiting('上傳中，請稍候...',{loading:{display:"inline"}})
		var task=plus.uploader.createUpload(server,
			{method:"POST"},
			function(t,status){ //上传完成
				if(status==200){
					var res=JSON.parse(t.responseText)
					plus.nativeUI.closeWaiting()
					resolve(res)
				}else{
					plus.nativeUI.closeWaiting()
					plus.nativeUI.toast('上傳失敗:'+status)
				}
			}
		);
		task.addData("userID",userApp.userId);
		task.addData("fileName",fname);
		task.addData("applyID",newId);
		task.addFile(imgUrl,{key:'uploadkey1'});
		task.start();
//			if((size/1024/1024)>4){
//				plus.nativeUI.toast('上传图片过大！请重新选择(4M以内)')
//			}
//			plus.nativeUI.showWaiting('上傳中，請稍候...',{loading:{display:"inline"}})
//			userApp.convertImgToBase64({url:imgUrl,size:size}).then(base64Img=>{
//				let imgData=base64Img.substring(base64Img.indexOf('4')+2)
//				let fname=imgUrl.substring(imgUrl.lastIndexOf("\/")+1)
//				mui.ajax(server,{
//					data:{
//						applyID: newId,
//						userID:userApp.userId,
//						fileName:fname,
//						base64data:imgData
//					},
//					headers: {'Content-Type':'application/json'},
//					dataType:'json',//服务器返回json格式数据
//					type:'post',//HTTP请求类型
//					timeout:30000,//超时时间设置为10秒；
//					success:function(data){
//						plus.nativeUI.closeWaiting()
//						resolve(data)
//						//addPic(data.data,data.code,data.type);
//						//plus.nativeUI.toast('上傳成功')
//					},
//					error:function(xhr,type,errorThrown){
//						console.log('上传失败')
//						console.log(type)
//						console.log(errorThrown)
//						plus.nativeUI.closeWaiting()
//						plus.nativeUI.toast('上傳失敗')
//					}
//				});
//			})
//		})
			
	})
	}
	// 拍照添加文件
	function appendByCamera(newId){
		return new Promise((resolve,reject)=>{
			plus.camera.getCamera().captureImage(function(p){
				plus.io.resolveLocalFileSystemURL(p,function(entry){
					// 可通过entry对象操作test.html文件 
					entry.file( function(file){
	                		 return resolve(upload(newId,entry.toLocalURL(),file.size)) 
	                });
				},function(e){
					outLine('读取拍照文件错误：'+e.message);
				} );
			});	
		})
	}
	// 从相册添加文件
	function appendByGallery(newId){
		return new Promise((resolve,reject)=>{
			plus.gallery.pick(function(p){
	        plus.io.resolveLocalFileSystemURL(p,function(entry){
				// 可通过entry对象操作test.html文件 
				entry.file( function(file){
                		return resolve(upload(newId,p,file.size)) 
                });
			},function(e){
				outLine('读取文件错误：'+e.message);
			} );  
	    });
		
		})
		
	}
	// 添加文件
	var index=1;
	function appendFile(p){
		var fe=document.getElementById("files");
		var piclist=document.getElementById("pic-list");
		var addpicli=document.getElementById("add-pic-li");
		var li=document.createElement("li");
		var n=p.substr(p.lastIndexOf('/')+1);
		li.innerText=n;
		fe.appendChild(li);
		files.push({name:"uploadkey"+index,path:p});
		index++;
		empty.style.display="none";
	}
	function addPic(url,fid,ftype){
		var piclist=document.getElementById("pic-list");
		var addpicli=document.getElementById("add-pic-li");
		var li=document.createElement("li");
		var img=document.createElement("img");
		var a=document.createElement("a");
		li.className="mui-table-view-cell mui-media mui-col-xs-6 img-longtap";
		img.className="mui-media-object";
		img.src=url;
		img.style.height="100px";
		img.style.width="100px";
		img.setAttribute("fileID", fid);//修改标签的id属性
		img.setAttribute("fileType", ftype);//修改标签的id属性
		img.setAttribute("data-preview-src", "");//修改标签的id属性
		img.setAttribute("data-preview-group", "1");//修改标签的id属性
		a.appendChild(img);
		li.appendChild(a);
		piclist.insertBefore(li,addpicli);
	}
	// 产生一个随机数
	function getUid(){
		return userApp.generateUUID();
	}