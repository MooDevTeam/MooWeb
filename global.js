var queryString={};

$(function(){
	(function parseURLArgs(){
		var arg=window.location.search;
		if(arg.length>0){
			arg.substring(1).split('&').forEach(
				function(keyValuePair){
					var index=keyValuePair.indexOf('=');
					if(index!=-1){
						var key=keyValuePair.substring(0,index);
						var value=keyValuePair.substring(index+1);
						queryString[URLDecode(key)]=URLDecode(value);
					}
				}
			);
		}
	})();
	
	$('body')
		.append($('<div id="pageHeader"/>')
			.append($('<div id="topBar"/>')
				.append('<div id="topBarLeft"/>')
				.append('<div id="topBarRight"/>')
				.append('<div class="clear"/>'))
			.append($('<div id="logoArea">'))
			.append($('<div id="navBar">')))
		.append($('<div id="pageBody"/>')
			.append($('<div id="mainWrapper"/>')
				.append($('<div id="main"/>')
					.append('<h1 id="pageTitle"/>')))
			.append($('<div id="sidePanelWrapper"/>')
				.append($('<div id="sidePanel"/>')
					.append('<ul id="sideNav"/>')))
			.append('<div class="clear"/>'))
		.append($('<div id="pageFooter"/>'));
	
	$('#topBarLeft')
		.append('<a href="#">Copyright</a>')
		.append(' | ')
		.append('<a href="#">Sitemap</a>');
	
	$('#topBarRight')
		.append($('<a href="#">Login</a>'))
		.append(' | ')
		.append($('<a href="#">Control Panel</a>'));
	
	$('#logoArea')
		.append('<img src="https://www.google.com.tw/images/srpr/logo3w.png" alt=""/>')
		.append($('<form/>')
			.append('<input type="text"/>')
			.append('<input type="submit" value="Search"/>'));
	
	$('#navBar')
		.append('<a href="#" class="selected">Selected</a>')
		.append('<a href="#">Others</a>');
	
	$('#pageTitle').text("SJY Got The IOI Au");
	
	$('#main')
		.append("Rencently, there is a Shen Ben named SJY, who got the IOI gold medal of this year!")
		.append($('<figure/>')
			.append('<figcaption>This is SJY</figcaption>')
			.append($('<div style="width: 190px; height: 300px; overflow:hidden;"/>')
				.append('<img style="margin-left: -130px; margin-top: -50px;" src="http://sjzyz.net/yrcg/UploadFiles_3914/201209/2012090211114788.jpg" alt=""/>')))
		.append(ListTable(
			[
				{title:'User',field:'user',type:'text'},
				{title:'Content',field:'content',type:'html'},
				{title:'Vote Counter',field:'vote',type:'number'}
			],
			function(start,callback){
				var result=[];
				for(var i=start;i<start+10;i++){
					result.push({
						user:'U'+Math.ceil(Math.random()*10000),
						content:'What a <span style="color:red; font-weight: bold; font-size: large;">Great</span> Shen Ben!',
						vote:Math.ceil(Math.random()*100)
					});
				}
				
				setTimeout(callback.bind(null,result,true),1000);
			}
		).css('width','100%'));
	
	for(var i=0;i<10;i++)
		$('#sidePanel ul').append('<li><a href="#">Function '+i+'</a></li>');
	
	$('#pageFooter').html('This is Moo. The Online Judge.<br/>Web Designed By Mr.Phone.');
});

function URLEncode(str){
	return encodeURIComponent(str);
}

function URLDecode(str){
	return decodeURIComponent(str.replace('+','%20'));
}

function ShowWarning(msg){
	$('#warningBars')
		.append($('<div class="warningBar"/>')
			.fadeIn('slow')
			.mouseout(function(){
				$(this).fadeOut('slow',function(){$(this).remove();});
			})
			.text(msg));
}