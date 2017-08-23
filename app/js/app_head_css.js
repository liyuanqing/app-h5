window.onload=function(){
    if(!window.android){
		$(".top").css({"border-top":"0.625rem solid #3297fd"});
		//$('.container').css({'padding-top':'3.125rem'});

        if($(".container").hasClass("userInfo")) {
            $(".top").css({"z-index":"1000"});
        }
    }

    //弹出软键盘时底部留空白
    $('input[type="text"]').focus(function(){
        $('.container').css('padding-bottom','8rem');
    }).blur(function(){
        $('.container').css('padding-bottom','0');
    });
	
	
	if(window.location.pathname == '/'  || window.location.href.indexOf('user/index') >= 0 ){
        if(window.android){
            android.visiableTab();
        }else{
            window.webkit.messageHandlers.CGTZ.postMessage({"key":"Tabbardisplay"});
        }
    }else{
        if(window.android){
            android.hideTab();
        }else{
            window.webkit.messageHandlers.CGTZ.postMessage({"key":"Tabbarhide"});
        }
    }
	
}