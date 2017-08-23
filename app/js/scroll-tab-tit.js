$(document).ready(function(){
	//自定义触摸事件
		var hasTouch = 'ontouchstart' in window;
		var goTouchStart = hasTouch ? 'touchstart' : 'mousedown',
				goTouchMove = hasTouch ? 'touchmove' : 'mousemove',
				goTouchEnd = hasTouch ? 'touchend' : 'mouseup';
	//表单头部滚动--开始
	var $titUl = $('.list-tab-title ul');
	var $titLi = $('.list-tab-title li');
	var $index = 0,$tempIdx=0;
	var $formList = $('.form-list ul');
	//记录滚动对齐位置
	var $scrollWarp = $('.list-tab-title').width();
	var $scrollSize = 0,$tempSize=0;
	var $arrScroll = [],$arrTemp=[];
	var $point = 0,$tempPoint="";
		//初始化一些值
		var $flag = false;
		var $start = 0 , $end = 0;
		//按上去
		$titLi.each(function(index){
			$arrTemp.push($(this)[0].scrollWidth)
			
			$(this).on(goTouchStart,function(e){
				$tempIdx = index;
				$flag = true;
				$start = hasTouch ? e.originalEvent.targetTouches[0].screenX : e.originalEvent.screenX;
				$end = $start;
				e.preventDefault();
			})
			
		})
			//重整scroll数组
			for(var i =0; i<$arrTemp.length; i++){
				$tempSize += $arrTemp[i];
				$scrollSize = $scrollWarp <= $tempSize ? $scrollWarp - $tempSize:0;
				$arrScroll.push($scrollSize);
			}
		//移动中
		$('body').on(goTouchMove,function(e){
			if($flag){
				
				$end = hasTouch ? e.originalEvent.targetTouches[0].screenX : e.originalEvent.screenX;
				$tempPoint = $point + $end-$start;
				if($tempPoint >= $arrScroll[0]){
					$tempPoint = $arrScroll[0]
				}else if($tempPoint <= $arrScroll[$arrScroll.length-1]){
					$tempPoint = $arrScroll[$arrScroll.length-1]
				}
				$titUl.css({'left':$tempPoint})
				
			}
		})
		//放开
		$(document).on(goTouchEnd,function(e){
			$flag = false;
			$point = $tempPoint===''?$point:$tempPoint;
			$tempPoint='';
			if(Math.abs($end-$start)<=10 && $tempIdx !== $index){
				$titLi.eq($index).removeClass('on');
				$titLi.eq($tempIdx).addClass('on');
				$formList.eq($index).hide();
				$formList.eq($tempIdx).show();
				$index = $tempIdx;
				$point = $arrScroll[$index];
				$titUl.animate({'left':$point})
			}
		})
	//表单头部滚动--完成
})