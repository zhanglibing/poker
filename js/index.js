$(function(){
	var pre=null;
	function makePoker(){
		 var poker=[]
  var colors=['h','s','c','d']
  // 制作表biao用来判断是否已经插入
  var biao={}
  while(poker.length!==52){
  	var a=Math.floor(Math.random()*4)
  	var n=Math.ceil(Math.random()*13)
  	var c=colors[a]
     var v={
     	color:c,
     	number:n
     }
     if(!biao[c+n]){
     	poker.push(v);
     	biao[c+n]=true;
     }
  }
		return poker
}
 function setPoker(poker){
 	var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'k'}
  var index=0;
  // 第一层循环代表一行；第二层循环代表每一行有几个值
  // 动画之前注意delay()在前并灵活运用i*30等
for (var i = 0; i <7; i++) {
	for (var j = 0; j< i+1; j++) {
		index++;
		var poke=poker[index]
		$('<div>').attr('bb',index).attr('id',i+'_'+j).attr('data-num',poke.number).addClass('pai').css({backgroundImage:'url(image/'+dict[poke.number]+''+poke.color+'.png)'}).appendTo('.scence').delay(index*30).animate({
			left:(6-i)*71+j*142,
			top:i*40,
			opacity:1
		})

	};
};
for (var i =0; i <24; i++) {
	
	 var v=poker[index]
	 index++;
  		$('<div>').attr('bb',index).attr('data-num',v.number).addClass('pai left').css({backgroundImage:'url(image/'+dict[v.number]+''+v.color+'.png)'}).appendTo('.scence').delay(index*30).animate({
			left:205,
			top:432,
			opacity:1
		})
  	};  	
 }
var linkL=$('.leftbtn');
linkL.on('mousedown',false)
linkL.on('click',(function(){
	var zIndex=0;
	return function(){
	if(pre){
		pre.animate({top:'+=15'})
		pre=null;
	}
  $('.left').last().css('zIndex',zIndex++).animate({
  	left:650
  }).queue(function(){
  	$(this).removeClass('left').addClass('right').dequeue()
  }) 
 }
})())

var linkR=$('.rightbtn')
linkR.on('mousedown',false)
linkR.on('click',(function(){
	var num=0
	return function(){
		if(pre){
		pre.animate({top:'+=15'})
		pre=null;
	}
		if($('.left').length){
			return
		}
		num++;
		if(num>3){
		 return	
		}
	$('.right').each(function(i,v){
			$(this).css('zIndex',0).delay(i*50).animate({
				left:190
			}).queue(function(){
        	 $(this).removeClass('right').addClass('left').dequeue()
          }) 
	})
 }
})())
// 获取data-num的值用作判断
function getnum(a){
	return parseInt($(a).attr('data-num'))
}
// 判断是否被遮挡
function isid(a){
	// 注意parseInt和split()的用法；
	var x=parseInt($(a).attr('id').split('_')[0])
	var y=parseInt($(a).attr('id').split('_')[1]);
	// parseInt得到整数 否则字符串+1变为连接符号
	if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+"_"+(y+1)).length){
		return true;
	}else{
		return false
	}
}


var scord=0;
var pi=0;
$('.scence').on('click','.pai',function(){
	// 如果被压住 直接返回

	// 如果是13 直接消除 函数返回
	// 
	// 判断当前是否有id和是否被遮挡
	if($(this).attr('id')&&isid($(this))){
      return
	}
	var number=getnum(this)
	if(number===13){
		scord+=10
		pi++;
		$(this).animate({
			top:50,
			left:800
		}).queue(function(){
			$(this).detach().dequeue()
			// 注意记得出对
		})
		$('.scord .zhi').text(scord+'分')
		$('.dang').text('当前配对:'+pi)
		$('.sheng').text('剩余配对:'+(26-pi))
		return 
	}
	// 如果前一张有记录则进行如下判断
	if(pre){
		if(getnum(pre)+getnum($(this))==13){
			scord+=10
			pi++;
			pre.add(this).animate({
			top:50,
			left:800
		}).queue(function(){
			$(this).detach().dequeue()
		})
		$('.dang').text('当前配对:'+pi)
		$('.sheng').text('剩余配对:'+(26-pi))
		$('.scord .zhi').text(scord+'分')
		}else{
			if($(this).attr('bb')==$(pre).attr('bb')){
				pre.animate({top:'+=15'})
			}else{
			$(this).animate({top:'-=15'}).animate({top:'+=15'})
			pre.delay(400).animate({top:'+=15'})	
			}
			
			// 注意add()的用法
		}
		pre=null;
		// 不满足条件则清空
	}else{
		pre=$(this)
		pre.animate({top:'-=15'})
	}
})
// 倒计时
var m=3;
var s=60;
function time(){
	$('.time').text('倒计时:'+m+'分'+s+'秒')
	if(s==0&&m==0){
		s=0;
		return
	}
   s-=1;
   if(s==0){
	   	if(m==0){
	   		m=0;
	   	}else{
	   	 m-=1;
	   	 s=60
	   	}
   }
}
setInterval(time,1000)

// 点击开始游戏
$('.start').on('mousedown',false)
$('.start').on('click',function(){
	$('.xx').show()
     m=3;
     s=60;
	$('.pai').detach()
	setPoker(makePoker())
})
// 点击重置
$('.reset').on('mousedown',false)
$('.reset').on('click',function(){
	m=3;
    s=60;
	// $('.btn').show(500)
	$('.xx').show()
	scord=0;
	pi=0
	$('.dang').text('当前配对:'+pi)
	$('.sheng').text('剩余配对:'+(26-pi))
	$('.scord .zhi').text('0分')
	$('.pai').detach()
	setPoker(makePoker())
})

// 结束游戏
$('.end').on('mousedown',false)
$('.end').on('click',function(){
	$('.xx').hide(500)
	scord=0;
	pi=0
	$('.dang').text('当前配对:'+pi)
	$('.sheng').text('剩余配对:'+(26-pi))
	$('.scord .zhi').text('0分')
	$('.pai').hide(1000,function(){
		$('.pai').detach()
	})
})



})