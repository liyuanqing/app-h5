//**********计算器rang拉动开始
	//初始化定义四需计算的值
	var $nhlx = $('.nhlx'), 	//年化利息
		$qcfwf = $('.qcfwf'),	//期初服务费
		$dzje = $('.dzje'),		//到账金额
		$hkje = $('.hkje');		//还款金额
		$sqed = $('.sqed');		//申请额度
	function setAmount(edu,day){
		edu = parseInt(edu);
		day = parseInt(day);
		$sqed.html( toDecimal(edu) );
		$nhlx.html( toDecimal(edu *0.07* day /365) );
		$qcfwf.html( toDecimal(edu * 0.12) );
		$dzje.html( toDecimal(edu*(1-0.12)) );
		$hkje.html( toDecimal(edu+edu *0.07* day /365) );
	}
	setAmount(500,7)
	//计算四项值并输出完成
	
	//定义鼠标或手势事件*************************
	var hasTouch = 'ontouchstart' in window;
	var goTouchStart = hasTouch ? 'touchstart' : 'mousedown',
		goTouchEnd = hasTouch ? 'touchend' : 'mouseup';
	//贷款额度range
	var $edu = $('#edu'),
		$eduNow = $edu.find('.now').children('span'),
		$eduVal = 500,
		$day = $('.limitDay'),
		$dayVal = 7,
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
		if($eduVal == 0) $eduVal=500;
		setAmount($eduVal,$dayVal);
		$eduLeft = $eduVal/30*0.89;
		if($eduVal==500) $eduLeft = 0;
		$eduNow.html($eduVal).css({'left':$eduLeft+'%'});
		$eduLeft = $eduLeft+$eduLeft/10;
		$(this).css('background', 'linear-gradient(to right , #3297fd '+ $eduLeft +'%, #e8e8e8 ' + $eduLeft + '%)');
	})
	//借款期限开始变动时
	$('.compute-limit li').on('click',function(){
		var $this = $(this);
		if($this.hasClass('on') === false){
			$this.addClass('on').siblings().removeClass('on');
		}
		//将值放入计算器工式填入隐藏的input
		$dayVal = $this.text();
		setAmount($eduVal,$dayVal);
		$('.limitDay').val($dayVal);
	})
	//取小数点后2位数
	function toDecimal(x){
		var f = parseFloat(x); 
		if (isNaN(f)) { 
			return false; 
		} 
		var f = Math.round(x*100)/100; 
		var s = f.toString(); 
		var rs = s.indexOf('.'); 
		if (rs < 0) { 
			rs = s.length; 
			s += '.'; 
		} 
		while (s.length <= rs + 2) { 
			s += '0'; 
		} 
		return s;
	}
	//取小数点后2位数完成
//**********计算器rang拉动结束