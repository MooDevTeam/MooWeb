"use strict";
/**
	name:
	metroBlock:
	onload: function(params)
	onunload: function()
*/
function Page(){
}

Page.item={};
Page.currentPage = null;
Page.history=[];

Page.history.backward=function(){
	assert(Page.history.index);
	Page.history.index--;
	var params=parseURL(Page.history[Page.history.index]);
	Page.item[params.page].load(params,true);
}

Page.history.forward=function(){
	assert(Page.history.index+1<Page.history.length);
	Page.history.index++;
	var params=parseURL(Page.history[Page.history.index]);
	Page.item[params.page].load(params,true);
}

Page.refresh=function(){
	assert(typeof Page.history.index=='number' && Page.history.length>0);
	var params=parseURL(Page.history[Page.history.index]);
	Page.item[params.page].load(params,true);
};

Page.redirect=function(url){
	if(url.match(/^\/?\?/)){
		url=url.replace(/^\/?\?/,'');
		var params=parseURL(url);
		Page.item[params.page].load(params);
	}else{
		window.open(url);
	}
};

Page.backToHomepage=function(){
	if(Page.currentPage){
		Page.currentPage.unload();
	}
	Page.currentPage=null;
	Layout.backToHomepage();
}

Page.prototype.load=function(params,noHistory){
	if(Page.currentPage){
		Page.currentPage.unload(this.doLoad.bind(this,params,Page.currentPage,noHistory));
		Page.currentPage=null;
	}else{
		this.doLoad(params,null,noHistory);
	}
};

Page.prototype.doLoad=function(params,previousPage,noHistory){
	Page.currentPage=this;
	if(!previousPage){
		Layout.showMetroBlock(this.metroBlock,function(){
			$('#main').fadeIn();
			$('#toolbar').fadeIn();
		});
	}else if(previousPage.metroBlock!=this.metroBlock){
		$('#main').fadeIn();
		$('#toolbar').fadeIn();
		Layout.switchMetroBlock(this.metroBlock);
	}else{
		$('#main').fadeIn();
		$('#toolbar').fadeIn();
	}
	
	params=params || {};
	params.page=this.name;
	
	var strParams=URLEncode(params);
	if(!noHistory){
		if(Page.history.length==0){
			Page.history.push(strParams);
			Page.history.index=0;
		}else if(strParams!=Page.history[Page.history.index]){
			while(Page.history.length-1>Page.history.index)
				Page.history.pop();
			Page.history.index=Page.history.length;
			Page.history.push(strParams);
		}
	}
	
	if(Page.history.index<Page.history.length-1)
		$('#historyForward').removeClass('disabled');
	else
		$('#historyForward').addClass('disabled');
	
	if(Page.history.index>0)
		$('#historyBackward').removeClass('disabled');
	else
		$('#historyBackward').addClass('disabled');
	
	$('#pageTitle').attr('href','?'+strParams);
	$('#mainTopBar,#mainBottomBar')
		.css('border-color',this.metroBlock.css('background-color'));
	this.onload(params);
}

Page.prototype.unload=function(callback){
	this.onunload();
	
	$('#toolbar').fadeOut();
	$('#main').fadeOut('normal',function(){
		$('#main').html('');
		$('#toolbar').html('');
		$('#pageTitle').text('');
		if(callback instanceof Function)
			callback();
	});
};