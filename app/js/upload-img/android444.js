//判断是否为安卓4.4.4版本，是的话就执行：隐藏老插件显示另一个自定义的
	if(window.android){
		var userAgent = navigator.userAgent;
		var index = userAgent.indexOf("Android");
		var androidVersion = userAgent.substring(index+8,index+13); 
		if( androidVersion == '4.4.4' ){
			$('#uploader0').addClass('disNone');
			$('#otherUpload').removeClass('disNone');
			if($('.addUploadLi').length == (numUploadLimit-1) ) $('.otherBtnUp').addClass('disNone');//保存后再次打开最多显示几张图片
			$('.uploadBtn').addClass('uploadOther').removeClass('uploadBtn'); //将原插件的按钮样式去掉-使它无法解发
		}
	}

//安卓4.4.4自定义方法，安卓执行调用将选择上传成功后获取到的URL值返回
	function getAndroidImg(imgUrl,imgType,imgSize){
		if(imgUrl != ''){
			//var fileType = imgUrl.substring(imgUrl.length-3 , imgUrl.length);
			var filePath = imgUrl.substring(imgUrl.indexOf('upaiyun.com') + 11 , imgUrl.length);
			var conts = '<li class="addUploadLi" fileType="' + imgType + '" fileSize="' + imgSize + '" filePath="' + filePath + '" ><img src="' + imgUrl + '"><div class="delUpload" style="height:0"><span class="cancel">删除</span></div></li>';
			$('#otherUpload').prepend(conts);
			if($('.addUploadLi').length == (numUploadLimit-1)) $('.otherBtnUp').addClass('disNone');//最多显示几张图片
		}
	}
	
//安卓4.4.4--点击图片弹出删除按钮
	$(document).on('click','.addUploadLi',function(){
		$(this).find('.delUpload').animate({height:"30px"});
		$(this).siblings().find('.delUpload').animate({height:"0px"});
	});
	
//安卓4.4.4--点击删除按钮后将LI节点删除
	$(document).on('click','.delUpload .cancel',function(){
		$(this).parent('div').parent('li').remove();
		if($('.addUploadLi').length < (numUploadLimit-1)) $('.otherBtnUp').removeClass('disNone');
	});

//安卓4.4.4--组织数据格式getData
$(document).on('click','.uploadOther',function(){
	postOtherData();
});