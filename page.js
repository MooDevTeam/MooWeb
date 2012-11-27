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
Page.recentHash=null;
Page.currentPage = null;

Page.pollHash=function(){
	if(location.hash!=Page.recentHash){
		Page.recentHash=location.hash;
		if(!location.hash.match(/^#!.+$/)){
			if(Page.currentPage)
				Page.backToHomepage();
		}else{
			var params=parseURL(location.hash.substring(2));
			Page.item[params.page].load(params);
		}
	}
	
};

Page.refresh=function(){
	var params=parseURL($('#pageTitle')[0].hash.substring(2));
	Page.item[params.page].load(params,true);
};

Page.redirect=function(url){
	if(url.match(/^\/?#!/)){
		url=url.replace(/^\/?#!/,'');
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
	Page.recentHash='#!';
	location.hash='#!';
	Layout.backToHomepage();
}

Page.prototype.load=function(params){
	if(Page.currentPage){
		Page.currentPage.unload(this.doLoad.bind(this,params,Page.currentPage));
		Page.currentPage=null;
	}else{
		this.doLoad(params,null);
	}
};

Page.prototype.doLoad=function(params,previousPage){
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
	
	Page.recentHash='#!'+strParams;
	location.hash='#!'+strParams;
	$('#pageTitle').attr('href','#!'+strParams);
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