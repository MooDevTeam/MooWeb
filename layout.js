var Layout={};

Layout.speed='slow';

Layout.init=function(){
	$('body')
		.append($('<div id="pageTopBar"/>')
			.append('<div id="pageTopBarLeft">Moo Online Judge</div>')
			.append($('<div id="pageTopBarRight"/>')
				.append('<div id="notLoggedIn" style="display: none"><a id="loginLink" href="#">登录</a></div>')
				.append('<div id="loggedIn" style="display: none"><span id="loggedUserName"/> | <a id="logoutLink" href="#">登出</a></div>'))
			.append('<div class="clear"/>'))
		.append($('<div id="pageBody"/>')
			.append($('<div id="sidePanel" class="full"/>')
				.append($('<a href="#" id="backToHomepage">&lt;&lt; Back &lt;&lt;</a>').hide())
				.append('<div id="homepage"/>'))
			.append($('<div id="mainArea" class="hidden">')
				.append($('<div id="mainTopBar"/>')
					.append($('<a id="pageTitle"/>'))
					.append('<div id="mainTopBarRight"/>'))
				.append('<div id="main"/>')
				.append('<div id="mainBottomBar">&copy; 2012 Mr.Phone</div>'))
			.append('<div class="clear"/>'));
	
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
	$('#backToHomepage').click(function(){
		Page.backToHomepage();
		return false;
	});
	
	Layout.cssTricks();
};

Layout.cssTricks=function(){
	$('#pageBody').height($(window).height()-$('#pageTopBar').height());
	$('#main').outerHeight($('#mainArea').height()-$('#mainTopBar').outerHeight()-$('#mainBottomBar').outerHeight());
}

$(window).resize(Layout.cssTricks);

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
		$('#main').hide();
		
		$('#sidePanel').switchClass('full','normal',Layout.speed);
		$('#mainArea').switchClass('hidden','normal',Layout.speed);
		$('#backToHomepage').fadeIn(Layout.speed,stepThree);
	}
	
	function stepThree(){
		$('#main').fadeIn(Layout.speed);
		
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
		$('#mainArea').switchClass('normal','hidden',Layout.speed);
		$('#backToHomepage').fadeOut(Layout.speed);
		
		$('#sidePanel .metroBlock').switchClass('small','big',Layout.speed);
	}
	
	function stepTwo(){
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
