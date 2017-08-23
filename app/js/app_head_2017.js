window.onload=function(){
    if(!window.android){
		$('body').addClass('ios-body').prepend('<span class="ios-div"></span>');
    }

    //弹出软键盘时底部留空白
    $('input[type="text"],input[type="password"]').focus(function(){
        $('.container').css('padding-bottom','240px');
    }).blur(function(){
        $('.container').css('padding-bottom','0');
    });
	
		var reg = /^\/v[0-9]{3}\/$/;
		if(window.location.pathname === '/' || reg.test(window.location.pathname) || window.location.href.indexOf('user/index') >= 0 ){
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