//**********计算器rang拉动开始
	var hasTouch = 'ontouchstart' in window;
	var goTouchStart = hasTouch ? 'touchstart' : 'mousedown',
		goTouchEnd = hasTouch ? 'touchend' : 'mouseup';
	var $edu = $('#edu'),
		$eduNow = $edu.find('.now').children('span'),
		$eduVal = 3000,
		$eduLeft = 0;
	//添加鼠标按上去时字体放大（添加/删除样式）
	$('#edu input').on(goTouchStart,function(){
		$(this).parent('.compute-range').addClass('focus');
	}).on(goTouchEnd,function(){
		$(this).parent('.compute-range').removeClass('focus');
	})
	//为额度添加鼠标按上去文件跟随
	$edu.find('input').on('propertychange input',function(){
		$eduVal = $(this).val();
		$eduLeft = ($eduVal-3000)/(20000-3000)*88;
		$eduNow.html($eduVal).css({'left':$eduLeft+'%'});
		$eduLeft = $eduLeft+$eduLeft/10*1.4;
		$(this).css('background', 'linear-gradient(to right , #3297fd '+ $eduLeft +'%, #e8e8e8 ' + $eduLeft + '%)');
	})
	//借款期限开始变动时
	$('.compute-limit li').on('click',function(){
		var $this = $(this);
		if($this.hasClass('on') === false){
			$this.addClass('on').siblings().removeClass('on');
			$('.limitDay').val($this.text());
		}
	})
//**********计算器rang拉动结束