//特例-加链接，后期需求直接用加在html
$('.banner-scroll li').eq(2).attr('data-url','http://cgtzfiles.b0.upaiyun.com/cgjr/jrwx/html/huodong/iframe-banner-wnd.html')
if(window.android){
	$('.banner-scroll li').eq(1).attr('data-url','http://cgtzfiles.b0.upaiyun.com/cgjr/jrwx/html/huodong/iframe-banner-jqdx.html')
}
//将第一张banner移动到最后一张
$('.banner-scroll li').eq(0).appendTo($('.banner-scroll ul'))


//插件内容在下面
$.fn.bannerScroll = function(param){
	$(this).each(function(){
		//初始化一些值		
		var $this = $(this) , $ul = $(this).find('ul') , $li = $(this).find('li');
		//初始化鼠标开始、结束位置与屏幕宽度[用于后面计量滑动宽度]
		var $start = 0 , $end = 0 ;
		//获取需要滚动的图片个数,以及单张图片宽度
		var $num = $li.length , $width = $('body').width();
		//统一li宽度
		$li.css('width',$width)
		//克隆两次内容
		var $cloneHtml = $ul.html();
		$ul.prepend($cloneHtml).prepend($cloneHtml);
		//判断是否拥有移动端某个touch事件[再自定义事件赋值某端的相应事件]
		var hasTouch = 'ontouchstart' in window;
		//接下来去自定义相关事件
		var goTouchStart = hasTouch ? 'touchstart' : 'mousedown',
			goTouchMove = hasTouch ? 'touchmove' : 'mousemove',
			goTouchEnd = hasTouch ? 'touchend' : 'mouseup';
		//flag-[鼠标点击到放开的过程],与当前索引和url数组
		var $flag = false, $index = 0, $url = [];
		//******初始化圆点列表,并记录对应的marginLeft的值范围
		var $valArry = [];
		//向DOM添加圆点的结构
		$this.append('<ol></ol>');
		var $tag = $this.children('ol');
		for(var i = 0; i < $num; i++){
			$tag.append('<li>'+ (i+1) +'</li>');
			$valArry.push( -$width*($num+i) );
		}
		$tag.children().eq(0).addClass('on');
		//*******初始平移的位置
		var $point = $valArry[0];
		$ul.css({left:$point+'px'});
		//*******开始绑定事件
		//鼠标按下ul-li标签按下
		$li.each(function(){
			$url.push($(this).attr('data-url') || '')
		})
		$this.on(goTouchStart,function(e){
			//获取按下时的位置[先判断是否在动画中]
			if(!$ul.is(":animated")){
				//将标识flag调为true,可以进行鼠标移动操作
				$flag = true;
				//获取鼠标按下位置
				$start = hasTouch ? e.originalEvent.targetTouches[0].screenX : e.originalEvent.screenX;
				$end = $start;
			}
			//阻止默认动作
			e.preventDefault();
		})
		//鼠标移动-整个body中任意
		$('body').on(goTouchMove,function(e){
			//判断flag-即是否点击了
			if($flag){
				$end = hasTouch ? e.originalEvent.targetTouches[0].screenX : e.originalEvent.screenX;
				$ul.css({left:$point + ($end-$start) + 'px'});
			}
		})
		//鼠标放开-整个document中任意
		$(document).on(goTouchEnd,function(e){
			//获取离开时的位置[先判断是否在动画中]
			if(!$ul.is(":animated") && $flag){
				//将标识flag调为false,使页面中“移动”操作不会再改变值
				$flag = false;
				//判断最后与开始的鼠标位置
				if($end - $start > 30){
				//如果结束位置大于开始位置-- 即鼠标是向右滑
					bannerNext();
				}else if($start - $end > 30){
				//如果开始位置大于结束位置-- 即鼠标是向左滑
					bannerPrev();
				}else{
					//拉的距离小的话就先还原到当前索引位置
					$ul.css({left:$point + 'px'});
					//再判断是否有需要跳转的url
					if($url[$index] !== '') window.open($url[$index],'_self');
				}
			}
		})
		//list圆点点击事件
		$tag.children('li').on(goTouchStart,function(){
			if(!$ul.is(":animated")){
				$index = $(this).index();
				$tag.children('li').eq( $(this).index() ).addClass('on').siblings().removeClass('on');
				$point = $valArry[$(this).index()];
				$ul.animate({left:$point + 'px'},500);
			}
		})
		//自动跳转到下一屏
		if(param != undefined){
			if(param===true) param = 3000;
			//定时器
			setInterval(function(){
				if(!$ul.is(":animated") && $flag===false ){
					bannerPrev()
				}
			},param);
		}
		//向上一张滑动
		function bannerNext(){
			$index = $index===0?$num-1:$index-1;
			$ul.animate({left : $point + $width + 'px'},500,function(){
					$point = $valArry[$index];
					$ul.css({left : $point + 'px'});
				});
				$tag.children('li').eq( $tag.find('.on').index()==0 ? $num-1 : $tag.find('.on').index()-1 ).addClass('on').siblings().removeClass('on');
		}
		//向下一张滑动
		function bannerPrev(){
			$index = $index===$num-1?0:$index+1;
			$ul.animate({left:$point - $width + 'px'},500,function(){
					$point = $valArry[$index];
					$ul.css({left : $point + 'px'});
				});
				$tag.children('li').eq( $tag.find('.on').index()==$num-1 ? 0 : $tag.find('.on').index()+1 ).addClass('on').siblings().removeClass('on');
		}
		
	})
}//$.fn完成