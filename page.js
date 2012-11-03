function Page(){
}

Page.item={};

Page.currentPage = null;

Page.backToHomepage=function(){
	if(Page.currentPage){
		Page.currentPage.unload();
	}
	Page.currentPage=null;
	Layout.backToHomepage();
}

Page.prototype.load=function(params){
	if(Page.currentPage){
		Page.currentPage.unload();
	}
	
	if(!Page.currentPage){
		Page.currentPage=this;
		Layout.showMetroBlock(this.metroBlock);
	}else if(Page.currentPage.metroBlock!=this.metroBlock){
		Page.currentPage=this;
		Layout.switchMetroBlock(this.metroBlock);
	}else{
		Page.currentPage=this;
	}
	
	params=params || {};
	params.page=this.name;
	
	$('#pageTitle').attr('href','?'+URLEncode(params));
	$('#mainTopBar,#mainBottomBar')
		.css('border-color',this.metroBlock.css('background-color'));
	this.onload(params);
};

Page.prototype.unload=function(){
	$('#main').html('');
	$('#pageTitle').text('');
	this.onunload();
};