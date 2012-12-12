"use strict";
(function(){
	Page.item.debug=new Page();
	Page.item.debug.name='debug';
	Page.item.debug.metroBlock=MetroBlock.item.help;
	Page.item.debug.onload=function(){
		$('#main')
			.append('<input id="file" type="file" />')
			.append($('<a href="#">ClickMe</a>')
				.click(function(){
					var reader=new FileReader();
					reader.readAsArrayBuffer($('#file')[0].files[0]);
					reader.onload=function(){
						var input=reader.result;
						var worker=new Worker('zip.js/deflate.js');
						worker.onmessage=function(e){
							var msg=e.data;
							console.log(msg);
							
							if(msg.oninit){
								worker.postMessage({append:true,data: new Uint8Array(input)});
							}else if(msg.onappend){
								worker.postMessage({flush:true});
							}
						};
						worker.postMessage({init:true});
					};
					return false;
				}));
	};
	Page.item.debug.onunload=function(){
	};
})();