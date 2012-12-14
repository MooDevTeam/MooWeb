"use strict";
var Layout={};

Layout.speed='slow';

Layout.init=function(){
	$('body')
		.append($('<div id="pageTopBar"/>')
			.disableSelection()
			.append('<div id="pageTopBarLeft"><a href="http://moo.imeng.de/">Moo Online Judge</a></div>')
			.append($('<div id="pageTopBarRight"/>')
				.append('<div id="notLoggedIn" style="display: none;"><a id="loginLink" href="#">登录</a> <a href="#" id="registerLink">注册</a></div>')
				.append($('<div id="loggedIn" style="display: none;"/>')
					.append('<img id="loggedUserImg" alt="Your Image"/>')
					.append('<a href="#" id="loggedUserName"/>')
					.append(' ')
					.append('<a id="manageLink" href="#">Moo控制台</a>')
					.append(' ')
					.append('<a id="logoutLink" href="#">登出</a>')))
			.append('<div class="clear"/>'))
		.append($('<div id="pageBody"/>')
			.append($('<div id="sidePanel" class="full"/>')
				.append('<div id="sidePanelBackground"/>')
				.append($('<a href="#" title="返回首页" id="backToHomepage"><img src="image/home.png" alt="Back To Homepage"/></a>').hide())
				.append('<div id="homepage"/>')
				.append('<ul id="toolbar" style="display: none;"/>'))
			.append($('<div id="mainArea" class="hidden">')
				.append($('<div id="mainTopBar"/>')
					.disableSelection()
					.append($('<div id="mainTopBarLeft"/>')
						.append('<a id="pageTitle"/>'))
					.append($('<div id="mainTopBarRight"/>')
						.append('<a id="historyBackward" href="#"><img src="image/backward.png" alt="Backward" title="后退"/></a>')
						.append('<a id="historyForward" href="#"><img src="image/forward.png" alt="Forward" title="前进"/></a>')
						.append('<a id="refresh" href="#"><img src="image/refresh.png" alt="Refresh" title="刷新"/></a>')))
				.append('<div id="main" style="display: none;"/>')
				.append($('<div id="mainBottomBar">Moo II &copy; 2012 Mr.Phone 唉木欧欧 爱爱</div>')
					.disableSelection()))
			.append($('<div id="messagePanel" class="hidden offline"/>')
				.append($('<div id="msgBody"/>')
					.append('<div id="msgTitle"/>')
					.append('<div id="msgMain"/>')))
			.append($('<div id="msgBox" class="hidden"/>')
				.disableSelection()
				.append($('<div id="msgBoxTitle">消息盒子</div>')
					.append($('<div id="msgBoxTitleControl"/>')
						.append('<a id="showMsgBox" href="#">+</a>')
						.append('<a id="hideMsgBox" href="#" style="display:none;">-</a>')))
				.append($('<ul id="msgBoxList" style="display:none;"/>')
					.append('<li id="msgBoxEmpty">目前没有消息</li>')))
			.append('<div class="clear"/>'));
	/*
	//Auto Hide
	$('#sidePanel')
		.hover(function(){
			if(Layout.mode=='FullMain'){
				Layout.showSidePanel();
			}
		},function(){
			if(Layout.mode=='Normal'){
				setTimeout(function(){
					if(Layout.mode=='Normal')
						Layout.hideSidePanel();
				},500);
			}
		});
	*/
	$('#messagePanel')
		.hover(function(){
			if(Layout.messagePanelMode=='hidden')
				Layout.showMessagePanel();
		},function(){
		/*
			setTimeout(function(){
				if(Layout.messagePanelMode=='normal')
					Layout.hideMessagePanel();
			},1000);
			*/
		});
	
	$('#sidePanelBackground').css('background','url("'+Layout.getRandomBackground()+'")');
	
	$('#loggedUserName')
		.click(function(){
			Page.item.user.load({id:Moo.currentUser.ID});
			return false;
		});
	
	$('#loginLink')
		.click(function(){
			PopPage.item.login.load();
			return false;
		});
	
	$('#registerLink')
		.click(function(){
			Page.item.register.load();
			return false;
		});
	
	$('#logoutLink')
		.click(function(){
			var moo=new Moo();
			moo.restore=function(){
				clearUserInfo();
			};
			moo.POST({
				URI: '/Logout',
				success: function(){
					clearUserInfo();
					new MsgBar('info','已登出');
				}
			});
			return false;
		});
	
	$('#manageLink')
		.click(function(){
			Page.item.manageMain.load();
			return false;
		});
	
	$('#backToHomepage').click(function(){
		Page.backToHomepage();
		return false;
	});
	
	$('#pageTitle').click(function(){
		if(Page.currentPage)
			Page.refresh();
		return false;
	});
	
	$('#historyBackward').click(function(){
		history.back();
		return false;
	});
	
	$('#historyForward').click(function(){
		history.forward();
		return false;
	});
	
	$('#refresh').click(function(){
		if(Page.currentPage){
			Page.refresh();
		}
		return false;
	});
	
	$('#showMsgBox').click(function(){
		MsgBox.show();
		return false;
	});
	
	$('#hideMsgBox').click(function(){
		MsgBox.hide();
		return false;
	});

	Layout.cssTricks();
};

Layout.getRandomBackground=function(){
	return 'image/background/pic'+randInt(1,103)+'.jpg';
};

Layout.cssTricks=function(){
	$('#pageBody').height($(window).height()-$('#pageTopBar').height());
	$('#main').outerHeight($('#mainArea').height()-$('#mainTopBar').outerHeight(true)-$('#mainBottomBar').outerHeight(),true);
	$('#msgMain').outerHeight($('#messagePanel').outerHeight(true)-$('#msgTitle').outerHeight(true),true);
}

$(window).resize(Layout.cssTricks);

Layout.messagePanelMode='hidden';

Layout.showMessagePanel=function(callback){
	assert(Layout.messagePanelMode=='hidden');
	$('#messagePanel').switchClass('hidden','normal',function(){
		Layout.messagePanelMode='normal';
		$('#sidePanel,#mainArea').bind('click',Layout.hideMessagePanel);
		if(callback instanceof Function)
			callback();
	});
	Layout.messagePanelMode=undefined;
};

Layout.hideMessagePanel=function(){	
	assert(Layout.messagePanelMode=='normal');
	$('#sidePanel,#mainArea').unbind('click',Layout.hideMessagePanel);
	$('#messagePanel').switchClass('normal','hidden',function(){
		Layout.messagePanelMode='hidden';
	});
	Layout.messagePanelMode=undefined;
};

Layout.hide

//Switch between layouts

Layout.mode='FullSidePanel';

/**
	Homepage to normal
*/
Layout.showMetroBlock=function(block,callback){
	assert(Layout.mode=='FullSidePanel');
	
	stepOne();
	
	function stepOne(){
		Layout.mode=undefined;
	
		$('#sidePanel .metroBlock').not(block)
			.slideUp(Layout.speed);
		$('#sidePanel .metroBlock').switchClass('big','small',Layout.speed);
		
		$('#homepage').stop().fadeOut(Layout.speed,stepTwo);
	}
	
	function stepTwo(){
		Homepage.onunload();
		$('#sidePanel').switchClass('full','normal',Layout.speed);
		$('#sidePanelBackground').switchClass('full','normal',Layout.speed);
		$('#mainArea').switchClass('hidden','normal',Layout.speed);
		$('#backToHomepage').fadeIn(Layout.speed,stepThree);
	}
	
	function stepThree(){
		Layout.mode='Normal';
		if(callback && callback instanceof Function){
			callback();
		}
	}
}

/**
	Between normal
*/
Layout.switchMetroBlock=function(block,callback){
	assert(Layout.mode=='Normal' || Layout.mode=='FullMain');
	
	if(Layout.mode=='FullMain'){
		Layout.showSidePanel(stepOne);
	}else if(Layout.mode=='Normal'){
		stepOne();
	}
	
	function stepOne(){
		$('#sidePanel .metroBlock:visible').slideUp(Layout.speed);
		block.slideDown(Layout.speed,function(){
			if(callback && callback instanceof Function){
				callback();
			}
		});
	}
}

/**
	Back to Homepage
*/
Layout.backToHomepage=function(callback){
	assert(Layout.mode=='Normal' || Layout.mode=='FullMain');
	
	if(Layout.mode=='FullMain'){
		Layout.showSidePanel(stepOne);
	}else{
		stepOne();
	}
	
	function stepOne(){
		$('#sidePanel').switchClass('normal','full',Layout.speed,stepTwo);
		$('#sidePanelBackground').switchClass('normal','full',Layout.speed);
		$('#mainArea').switchClass('normal','hidden',Layout.speed);
		$('#backToHomepage').fadeOut(Layout.speed);
		
		$('#sidePanel .metroBlock').switchClass('small','big',Layout.speed);
	}
	
	function stepTwo(){
		
		Homepage.onload();
		$('#homepage').hide().fadeIn(Layout.speed);
		$('#sidePanel .metroBlock:hidden')
			.slideDown(Layout.speed);
		Layout.mode='FullSidePanel';
		if(callback && callback instanceof Function)
			callback();
	}
}

/**
	Hide the side panel
*/
Layout.hideSidePanel=function(callback){
	assert(Layout.mode=='Normal');
	
	$('#mainArea').switchClass('normal','full',Layout.speed);
	$('#sidePanel').switchClass('normal','hidden',Layout.speed,function(){
		Layout.mode='FullMain';
		if(callback && callback instanceof Function){
			callback();
		}
	});
};

/**
	Show the side panel
*/
Layout.showSidePanel=function(callback){
	assert(Layout.mode=='FullMain');
	
	//FIXME Bug: mainArea disappear when animating
	//$('#mainArea').switchClass('full','normal',Layout.speed);
	$('#mainArea').animate({
		'margin-left': '200px'
	},Layout.speed,function(){
		$('#mainArea').css('margin-left','').removeClass('full').addClass('normal');
	});
	$('#sidePanel').switchClass('hidden','normal',Layout.speed,function(){
		Layout.mode='Normal';
		if(callback && callback instanceof Function){
			callback();
		}
	});
};
