$(document).ready(function(){
	//自定义全部整市的对象数组
	var cityArr = [];
	//遍历出列出的城市
	$('#myList li').each(function(){
		var $this = $(this);
		//城市数组方便后期扩展，比如添加链接，可以新增获取这个值写入对象中
		var city = {
			name:$this.html()
		}
		cityArr.push(city);
	});
	//列出所有可能的首字母（26字母）
	var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	//按首字母存放的内容
	var citySort = {};
	var insetStr = floatStr = '';
	var cityABC = [];
	//循环将内容填入citySort对象中
	for(var i = 0; i < cityArr.length; i++){
		var first = checkCh(cityArr[i].name);
		first = first.length>1?first.substring(0,1):first;
		if(citySort[first] == undefined) citySort[first] = [];
		citySort[first].push(cityArr[i]);
	}
	//按照A-Z顺序先将列表循环输出（同时记录输入了哪些字母用于右侧浮动）
	for(var i =0; i < 26; i++){
		var print = citySort[letters[i]];
		if(citySort[letters[i]]!=undefined){
			cityABC.push(letters[i]);
			insetStr += '<dl id="'+letters[i]+'"><dt><a name="'+letters[i]+'">'+letters[i]+'</a></dt>'
			for(var j = 0; j < print.length; j ++){
				insetStr += '<dd>'+print[j].name+'</dd>'
			}
			insetStr += '</dl>';
		}
	}
	$('#myList').append(insetStr);
	//开始添加右侧浮动（用于快捷选择到相应字母开头的地域）+ 标记出每一块距离顶部的位置以便于下面将字母DL浮动的要求
	var conFloat = {};
	for(var i = 0; i < cityABC.length; i ++){
		conFloat[cityABC[i]] = $('#'+cityABC[i]).offset().top;
		//floatStr += '<a href="#'+cityABC[i]+'" target="_self">'+cityABC[i]+'</a>'
		floatStr += '<a>'+cityABC[i]+'</a>'
	}
	floatStr = '<p>'+floatStr+'</p>'
	$('#myList').append(floatStr);
	//让右侧浮动条居中显示（配合样子将marginTop向上一半元素实际高度值）
	var $listP = $('#myList p');
	var flexHeight = $listP.height();
	//让右侧浮动垂直居中
	$listP.css('margin-top','-'+flexHeight/2+'px');
	//页面滚动时让正文字母标题浮动
	$(window).scroll(function(){
		//获取滚动条的位置
		var Ctop = $(document).scrollTop();
		//判断三种情况（1）不足第一个高度（2）大于最后一个高度（3）中间高度
		if(Ctop < conFloat[cityABC[0]]){
			$('#myList dl').removeClass('floatLetter');
		}else if(Ctop >= conFloat[cityABC[cityABC.length-1]]){
			$('#'+cityABC[cityABC.length-1]).addClass('floatLetter').siblings().removeClass('floatLetter');
		}else{
			for(var i = 0; i < cityABC.length; i++){
				if(conFloat[cityABC[i+1]] > Ctop && Ctop >= conFloat[cityABC[i]]){
					$('#'+cityABC[i]).addClass('floatLetter').siblings().removeClass('floatLetter');
					break;
				}
			}
		}
	});
	
	
	//20161227新增代码
	//右侧浮动scroll去相应位置
	$(document).on('click','.selectCity p a',function(){
			$(document.body).stop().animate({scrollTop: conFloat[$(this).html()]+'px'}, 800);
	});
	
	//阻止p区域滑动时，页面不滑动开始
	var hasTouch = 'ontouchstart' in window;
	var goTouchStart = hasTouch ? 'touchstart' : 'mousedown',
			goTouchMove = hasTouch ? 'touchmove' : 'mousemove',
			goTouchEnd = hasTouch ? 'touchend' : 'mouseup';
			
	var mo=function(e){e.preventDefault();};
	$(document).on(goTouchStart,'.selectCity p',function(){
		document.body.style.overflow='hidden';
		document.addEventListener(goTouchMove,mo,false);//禁止页面滑动
	});	
	$(document).on(goTouchEnd,function(){
		document.body.style.overflow='';//出现滚动条
		document.removeEventListener(goTouchMove,mo,false);
	});
	//阻止p区域滑动时，页面不滑动完成
	
	
});