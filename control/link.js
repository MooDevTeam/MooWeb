"use strict";
var Link={};

Link.user=function(info){
	return $('<a href="#"/>')
		.text(info.Name)
		.click(function(){
			Page.item.user.load({id:info.ID});
			return false;
		});
}

Link.problem=function(info){
	return $('<a href="#"/>')
		.text(info.Name)
		.click(function(){
			Page.item.problem.load({id:info.ID});
			return false;
		});
}