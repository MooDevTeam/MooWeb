var MsgBar={};

MsgBar.init=function(){
	MsgBar.container=$('<div class="msgBarContainer"/>');
	$('body').append(MsgBar.container);
}

MsgBar.show=function(type,dom){
	var msgBar=$('<div class="msgBar"/>')
		.disableSelection()
		.addClass(type)
		.append($('<a class="close" href="#">×</a>')
			.click(function(){
				msgBar.slideUp('normal',function(){$(this).remove();});
				return false;
			}))
		.append(dom);
	MsgBar.container.append(msgBar);
	msgBar.hide().slideDown('normal',function(){
		if(type=='info'){
			setTimeout(function(){
				$('.close',msgBar).click();
			},1000);
		}else{
			setTimeout(function(){
				$('.close',msgBar).click();
			},3000);
		}
	});
};