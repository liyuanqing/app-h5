window.onload = function(){
	/*倒计时*/
	var wait=60;
	function time(o) {
		if (wait == 0) {	
			o.removeAttribute("disabled")
			o.value="发送验证码";
			wait = 60;
		} else {
			o.setAttribute("disabled",true)
			o.value= wait+"s";
			wait--;
			setTimeout(function() {
				time(o)
			},
			1000)
		}
	}
	document.getElementById("btn").onclick=function(){time(this);}
	/*注册成功*/
	document.getElementById("tjBtn").onclick=function(){
		document.getElementById("tck").style.display="block";
	};
	/*关闭弹出框*/
	function None(e){
		e.parentNode.parentNode.style.display="none";
	}
	/*点击即刻下载判断是ios浏览器访问还是安卓浏览器访问*/
	var ua = navigator.userAgent.toLowerCase();
	document.getElementById("down").onclick=function(){	
		if (/iphone|ipad|ipod/.test(ua)) {
			    //iphone	
			    window.location.href="https://itunes.apple.com/cn/app/song-jiang-dai/id984424855?mt=8";
		} else if (/android/.test(ua)) {
			    //android
			    window.location.href="https://cgtzmobiles.b0.upaiyun.com/apk/songjiangdai_2.0.2_bww.apk";
		}
	}
	//判断微信浏览器中显示提示层--去打开浏览器
	if(ua.match(/MicroMessenger/i)=="micromessenger") {  
		$("#browser").removeClass("disNone");
	}
	document.getElementById("close").onclick=function(){None(this);}
}
