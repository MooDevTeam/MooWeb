function MsgBar(type,dom){
	var self=this;
	this.msgBar=$('<div class="msgBar"/>')
		.disableSelection()
		.addClass(type)
		.append($('<a class="close" href="#">×</a>')
			.click(function(){
				self.close();
				return false;
			}))
		.append(dom);
	$('#msgBarContainer').append(this.msgBar);
	this.msgBar.hide().slideDown('normal',function(){
		if(type=='info'){
			setTimeout(function(){
				self.close();
			},1000);
		}else{
			setTimeout(function(){
				self.close();
			},5000);
		}
	});
};

MsgBar.init=function(){
	$('body').append($('<div id="msgBarContainer"/>'));
}

MsgBar.prototype.close=function(){
	this.msgBar.slideUp('normal',function(){$(this).remove();});
};