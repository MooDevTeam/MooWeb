﻿"use strict";
/**
	onload:function(params)
	onunload:function()
*/
function PopPage(){
}

PopPage.item={};

PopPage.currentPage=null;

PopPage.prototype.load=function(params){
	assert(!PopPage.currentPage);
	
	PopPage.currentPage=this;
	var wholepage=$('<div class="wholepage"/>');
	var blackout=$('<div class="blackout"/>')
		.click(function(){
			if(PopPage.currentPage)
				PopPage.currentPage.unload();
		});
	var popBox=$('<div id="popBox"/>')
		.append($('<div id="windowBar">&nbsp;</div>')
			.append('<span id="windowTitle"/>'))
		.append($('<div id="windowBody"/>')
			.append('<div id="windowMain">'));
	wholepage.append(blackout).append(popBox);
	
	$('body')
		.append(wholepage.hide().fadeIn());
	
	popBox.draggable({
		addClasses: false,
		containment: wholepage,
		cursor: 'move',
		handle: $('#windowBar')
	});
	$(window).bind('resize',PopPage.cssTrick);
	$(document).bind('keyup',PopPage.hotKey);
	PopPage.cssTrick();
	
	this.onload(params?params:{});
};

PopPage.prototype.unload=function(){
	PopPage.currentPage=null;
	$(window).unbind('resize',PopPage.cssTrick);
	$(document).unbind('keyup',PopPage.hotKey);
	this.onunload();
	$('.wholepage').fadeOut(function(){
		$(this).remove();
	});
};

PopPage.cssTrick=function(){
	$('#windowBody').height($('#popBox').height()-$('#windowBar').outerHeight(true));
};

PopPage.hotKey=function(evt){
	if(evt.which==27){//Esc
		if(PopPage.currentPage)
			PopPage.currentPage.unload();
	}
};