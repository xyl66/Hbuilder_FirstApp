/*<!--上传照片-->*/
	var server=userApp.serverUrl+"/Attachment/PostFile";
	const newUuId=getUid();
	var files=[];
	// 上传文件
	function upload(newId,imgUrl,size){
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
					addPic(res.data,res.initialData,res.code,res.type);
					plus.nativeUI.toast('上傳成功')
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
	}
	// 拍照添加文件
	function appendByCamera(newId){
		plus.camera.getCamera().captureImage(function(p){
			plus.io.resolveLocalFileSystemURL(p,function(entry){
				// 可通过entry对象操作test.html文件 
				entry.file( function(file){
					console.log("拍照获取到照片")
                		upload(newId,entry.toLocalURL(),file.size)
                });
			},function(e){
				outLine('读取拍照文件错误：'+e.message);
			} );
		});	
	}
	// 从相册添加文件
	function appendByGallery(newId){
		plus.gallery.pick(function(p){
	        plus.io.resolveLocalFileSystemURL(p,function(entry){
				// 可通过entry对象操作test.html文件 
				entry.file( function(file){
                		upload(newId,p,file.size)
                });
			},function(e){
				outLine('读取文件错误：'+e.message);
			} );  
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
	function addPic(url,initialUrl,fid,ftype){
		var piclist=document.getElementById("pic-list");
		var addpicli=document.getElementById("add-pic-li");
		var li=document.createElement("li");
		var img=document.createElement("img");
		var a=document.createElement("a");
		li.className="mui-table-view-cell mui-media mui-col-xs-6 img-longtap";
		img.className="mui-media-object";
		img.src=url;
		img.style.height="100%";
		img.style.width="100%";
		img.setAttribute("fileID", fid);//修改标签的id属性
		img.setAttribute("fileType", ftype);//修改标签的id属性
		img.setAttribute("data-preview-src", initialUrl);//修改标签的id属性
		img.setAttribute("data-preview-group", "1");//修改标签的id属性
		a.appendChild(img);
		li.appendChild(a);
		piclist.insertBefore(li,addpicli);
	}
	// 产生一个随机数
	function getUid(){
		return userApp.generateUUID();
	}