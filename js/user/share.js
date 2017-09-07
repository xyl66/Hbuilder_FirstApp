var shares=null;
// H5 plus事件处理
function plusReady(){
	updateSerivces();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready', plusReady, false);
}
/**
 * 更新分享服务
 */
function updateSerivces(){
	plus.share.getServices(function(s){
		shares={};
		for(var i in s){
			var t=s[i];
			shares[t.id]=t;
		}
	}, function(e){
		plus.nativeUI.alert('获取分享服务列表失败：'+e.message);
	});
}
/**
   * 分享操作
   * @param {JSON} obj 分享内容对象title,guid,content,pic
   * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
   * @param {Boolean} bh 是否分享链接
   */
function shareAction(obj,sb,bh) {
	if(!sb||!sb.s){
		plus.nativeUI.alert('无效的分享服务！');
		return;
	}
	var msg={content:"我正在使用HBuilder+HTML5开发移动应用，赶紧跟我一起来体验！",extra:{scene:sb.x}};
	if(bh){
		msg.href="http://supplier.foxconn.com/yupintest/ShareView.aspx?id="+obj.guid;
		msg.pictures=['_www/logo.png'];
		console.log(JSON.stringify(obj))
		if(obj.pic&&obj.pic!=""){
			msg.thumbs=[obj.pic];
		}
		if(obj.title&&obj.title!=""){
			msg.title=obj.title
		}
		if(obj.content&&obj.content!=""){
			msg.content=obj.content
		}
	}else{
		if(pic&&pic.realUrl){
			msg.pictures=[pic.realUrl];
		}
	}
	// 发送分享
	if(sb.s.authenticated){
		shareMessage(msg, sb.s);
	}else{
		sb.s.authorize(function(){
			shareMessage(msg,sb.s);
		}, function(e){
			plus.nativeUI.alert('认证授权失败：'+e.code+' - '+e.message);
		});
	}
}
/**
   * 发送分享消息
   * @param {JSON} msg
   * @param {plus.share.ShareService} s
   */
function shareMessage(msg, s){
	console.log(JSON.stringify(msg));
	s.send(msg, function(){
		plus.nativeUI.alert('分享到"'+s.description+'"成功！');
	}, function(e){
		if(e.code=="-100"){
			
		}else{
		console.log('分享到"'+s.description+'"失败: '+JSON.stringify(e));	
		}
	});
}
// 分析链接
/**
 * @description 分析链接
 * @param [object] obj
 */
function shareHref(obj){
	var shareBts=[];
	// 更新分享列表
	var ss=shares['weixin'];
	ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
	shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
	// 弹出分享列表
	shareBts.length>0?plus.nativeUI.actionSheet({title:'分享链接',cancel:'取消',buttons:shareBts},function(e){
		(e.index>0)&&shareAction(obj,shareBts[e.index-1],true);
	}):plus.nativeUI.alert('当前环境无法支持分享链接操作!');
}