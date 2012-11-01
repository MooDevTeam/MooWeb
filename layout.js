var Layout={};

Layout.buildPage=function(){
	$('body')
		.append($('<div id="pageTopBar"/>')
			.append('<div id="pageTopBarLeft"/>')
			.append('<div id="pageTopBarRight"/>')
			.append('<div class="clear"/>'))
		.append($('<div id="pageBody"/>')
			.append($('<div id="sidePanel"/>')
				.append('<a href="#" id="returnFullSidePanel">&lt;&lt; Back &lt;&lt;</a>')
				.append('<div id="homepage"/>'))
			.append($('<div id="mainArea">')
				.append($('<div id="mainTopBar"/>')
					.append('<h1 id="pageTitle"/>')
					.append('<div id="mainTopBarRight"/>'))
				.append('<div id="main"/>')
				.append('<div id="mainBottomBar"/>'))
			.append('<div class="clear"/>'));
	
	//CSS Values
	var sampleElement=$('<div/>');
	$('body').append(sampleElement);
	Layout.sidePanelWidth=$('#sidePanel').width();
	
	sampleElement.addClass('metroBlock').addClass('big');
	Layout.bigMetroBlockWidth=sampleElement.width()
	Layout.bigMetroBlockHeight=sampleElement.height();
	
	sampleElement.removeClass('big').addClass('small');
	Layout.smallMetroBlockWidth=sampleElement.width();
	Layout.smallMetroBlockHeight=sampleElement.height();
	sampleElement.remove();
	
	//Auto Hide
	$('#sidePanel')
		.hover(function(){
			if(Layout.mode=='FullMain'){
				Layout.asNormal();
			}
		},function(){
			if(Layout.mode=='Normal'){
				setTimeout(Layout.asFullMain,500);
			}
		});
	$('#returnFullSidePanel').click(function(){
		Layout.asFullSidePanel();
		return false;
	});
	
	Layout.cssTricks();
};

Layout.cssTricks=function(){
	$('#pageBody').height($(window).height()-$('#pageTopBar').height());
	$('#main').outerHeight($('#mainArea').height()-$('#mainTopBar').outerHeight()-$('#mainBottomBar').outerHeight());
}

$(window).resize(Layout.cssTricks);

Layout.appendMetroBlock=function(theDiv,onclick){
	theDiv.addClass('metroBlock');
	
	var index=$('#sidePanel .metroBlock').length;
	if(index % 2 == 0){
		theDiv.css({
			'float':'left',
			'clear':'left'
		});
	}else{
		theDiv.css({
			'float':'right',
			'clear':'right'
		});
	}
	
	theDiv.click(function(){
		if(Layout.mode=='FullSidePanel'){
			$('#mainTopBar,#mainBottomBar')
				.css('border-color',$(this).css('background-color'));
			$('#homepage').fadeOut('slow');
			$('#sidePanel .metroBlock').not(this)
				.slideUp('slow',function(){
					Layout.asNormal();
				});
			$(this).animate({
				width:Layout.smallMetroBlockWidth,
				height:Layout.smallMetroBlockHeight
			},'slow',function(){
				$(this)
					.css({
						width:'',
						height:'',
					})
					.removeClass('big')
					.addClass('small');
				$('#returnFullSidePanel').fadeIn('slow');
				if(onclick && onclick instanceof Function){
					onclick();
				}
			});
		}else if(onclick && onclick instanceof Function){
			onclick();
		}
	});
	
	$('#sidePanel').append(theDiv);
	return Layout;
}

Layout.mode='Normal';

Layout.asFullMain=function(speed,callback){
	if(!Layout.mode || Layout.mode=='FullMain') return;
	Layout.mode=undefined;
	if(speed===undefined)
		speed='slow';
	
	$('#sidePanel')
		.css('float','left')
		.animate({
			'margin-left':-Layout.sidePanelWidth+20,
			'width':Layout.sidePanelWidth
		},speed);
	$('#mainArea')
		.css('display','block')
		.animate({
			'margin-left':20
		},speed,function(){
			if(!Layout.mode){
				Layout.mode='FullMain';
				if(callback && callback instanceof Function){
					callback();
				}
			}
		});
};

Layout.asNormal=function(speed,callback){
	if(!Layout.mode || Layout.mode=='Normal') return;
	Layout.mode=undefined;
	if(speed===undefined)
		speed='slow';
	
	$('#sidePanel')
		.css('float','left')
		.animate({
			'margin-left':0,
			'width':Layout.sidePanelWidth
		},speed);
	$('#mainArea')
		.css('display','block')
		.animate({
			'margin-left':Layout.sidePanelWidth
		},speed,function(){
			if(!Layout.mode){
				Layout.mode='Normal';
				if(callback && callback instanceof Function)
					callback();
			}
		});
};

Layout.asFullSidePanel=function(speed,callback){
	if(!Layout.mode || Layout.mode=='FullSidePanel') return;
	Layout.mode=undefined;
	if(speed===undefined)
		speed='slow';
	
	$('#sidePanel')
		.animate({
			'margin-left':0,
			'width':$(window).width()
		},speed,function(){
			$(this).css('float','none');
			$(this).width('100%');
			$('#homepage').hide().fadeIn('slow');
		});
	
	$('#mainArea').animate({
		'margin-left':$(window).width(),
	},speed,function(){
		$(this).css('display','none');
	});
	
	$('#returnFullSidePanel').fadeOut(speed);
	
	$('#sidePanel .metroBlock')
		.animate({
			'width':Layout.bigMetroBlockWidth,
			'height':Layout.bigMetroBlockHeight,
		},speed,function(){
			$('#sidePanel .metroBlock')
				.css({
					width:'',
					height:''
				})
				.removeClass('selected')
				.addClass('big');
			$('#sidePanel .metroBlock:hidden')
				.slideDown(speed);
			if(!Layout.mode){
				Layout.mode='FullSidePanel';
				if(callback && callback instanceof Function)
					callback();
			}
		});
};