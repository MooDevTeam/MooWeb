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
	
	Layout.buildPage();
	
	$('#pageTopBarLeft')
		.append('Moo Online Judge');
	
	$('#pageTopBarRight')
		.append('Login | Control Panel');
	
	Layout
		.appendMetroBlock($('<div style="background: green;">Problems</div>'))
		.appendMetroBlock($('<div style="background: blue;">Posts</div>'))
		.appendMetroBlock($('<div style="background: red;">Articles</div>'))
		.appendMetroBlock($('<div style="background: purple;">Records</div>'))
		.appendMetroBlock($('<div style="background: gold;">Users</div>'))
		.appendMetroBlock($('<div style="background: orangered;">Help</div>'));
	
	$('#homepage')
		.append('The Moo Online Judge');
	
	$('#mainBottomBar').html('&copy; 2012 Mr.Phone');
	
	Layout.asFullSidePanel(0);
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