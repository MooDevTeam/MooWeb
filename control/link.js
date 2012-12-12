"use strict";
var Link={};

Link.user=function(info){
	var result=$('<a href="#!page=user&id='+info.ID+'"/>');
	if(info.Email!==undefined){
		result.append($('<img alt="Avatar" style="vertical-align: middle;"/>')
			.attr('src',Gravatar.get(info.Email,30)))
	}
	result
		.append(htmlEncode(info.Name))
		.click(function(){
			Page.item.user.load({id:info.ID});
			return false;
		});
	return result;
}

Link.problem=function(info){
	return $('<a href="#!page=problem&id='+info.ID+'"/>')
		.text(info.Name)
		.click(function(){
			Page.item.problem.load({id:info.ID});
			return false;
		});
}

Link.article=function(info){
	return $('<a href="#!page=article&id='+info.ID+'"/>')
		.text(info.Name)
		.click(function(){
			Page.item.article.load({id:info.ID});
			return false;
		});
}

Link.file=function(info){
	return $('<a href="#!page=file&id='+info.ID+'"/>')
		.text(info.Name)
		.click(function(){
			Page.item.file.load({id:info.ID});
			return false;
		});
}

Link.contest=function(info){
	return $('<a href="#!page=contest&id='+info.ID+'"/>')
		.text(info.Name)
		.click(function(){
			Page.item.contest.load({id:info.ID});
			return false;
		});
}

Link.tag=function(info){
	return $('<a class="tag" href="#"/>')
		.text(info.Name)
		.click(function(){
			info.page.load({tagID:info.ID});
			return false;
		})
		.append($('<a class="tagDelete" href="#" title="删除"><img src="image/delete.png" alt="Delete"/></a>')
			.click(info.onDelete));
}