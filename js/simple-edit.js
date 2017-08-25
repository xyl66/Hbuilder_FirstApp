/*<!--上传照片-->*/
	var server=userApp.serverUrl+"/Attachment/UploadFile";
	const newUuId=getUid();
	var files=[];
	// 上传文件
	function upload(newId,imgUrl){
			console.log(imgUrl); 
			convertImgToBase64(imgUrl,function(base64Img){
				let imgData=base64Img.substring(base64Img.indexOf('4')+2)
				let fname=imgUrl.substring(imgUrl.lastIndexOf("\/")+1)
				console.log(imgData)
				console.log(fname)
				mui.ajax(server,{
					data:{
						applyID: newId,
						userID:"F3229346",
						fileName:fname,
						base64data:imgData
					},
					headers: {'Content-Type':'application/json'},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:30000,//超时时间设置为10秒；
					success:function(data){
						console.log(data.name)
						addPic(data.data,data.code,data.type);
					},
					error:function(xhr,type,errorThrown){
						console.log('上传失败')
						console.log(type)
						console.log(errorThrown)
					}
				});
			})
		/*console.log(newId)
		task.start();*/
	}
	// 拍照添加文件
	function appendByCamera(newId){
		plus.camera.getCamera().captureImage(function(p){
			plus.io.resolveLocalFileSystemURL(p,function(entry){
				//addPic(entry.toLocalURL());
	        	upload(newId,entry.toLocalURL())
			},function(e){
				outLine('读取拍照文件错误：'+e.message);
			} );
		});	
	}
	// 从相册添加文件
	function appendByGallery(newId){
		plus.gallery.pick(function(p){
	        //appendFile(p);
	        upload(newId,p)
	    });
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
		var p=document.createElement("p");
		li.className="mui-table-view-cell mui-media mui-col-xs-6 img-longtap";
		img.className="mui-media-object";
		img.src=url;
		img.style.height="100px";
		img.style.width="100px";
		img.setAttribute("fileID", fid);//修改标签的id属性
		img.setAttribute("fileType", ftype);//修改标签的id属性
		img.setAttribute("data-preview-src", "");//修改标签的id属性
		img.setAttribute("data-preview-group", "1");//修改标签的id属性
		p.appendChild(img);
		li.appendChild(p);
		piclist.insertBefore(li,addpicli);
	}
	// 产生一个随机数
	function getUid(){
		return generateUUID();
	}