//添加cookie的函数
function setCookie(cName,cVal,expDay){
	var exDate = new Date();
	exDate.setDate(exDate.getDate() + expDay);
	document.cookie = cName+'='+escape(cVal)+((expDay==null)?'':'; expires='+exDate.toGMTString());
}
//获取cookie的函数
function getCookie(cName){
	if(document.cookie.length > 0){
		cStart = document.cookie.indexOf(cName+'=');
		if(cStart!= -1){
			cStart = cStart + cName.length +1;
			cEnd = document.cookie.indexOf(';',cStart);
			if(cEnd == -1) cEnd = document.cookie.length;
			return unescape(document.cookie.substring(cStart,cEnd));
		}
	}
}