/**

 @data: 2016-09-13
 @param type为dialog类型：text,true,false字符串
 @param val为展示的内容字符串
 
 */
function dialog(type,val,time){
	if(time == undefined) time = 3000;
	$('body').append('<div class="dialog hide ' + type +'">' + val + '</div><div class="dialogBg"></div>');
	var $dialog = $('.dialog')
		$bg = $('.dialogBg');
	$dialog.css({'transform':'scale(0.5)'});
	setTimeout(function(){
		$dialog.css({'transform':'scale(1)'}).removeClass('hide')
	},200);
	setTimeout(function(){
		$dialog.remove();
		$bg.remove();
	},time);
}
