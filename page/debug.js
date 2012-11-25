"use strict";
(function(){
	Page.item.debug=new Page();
	Page.item.debug.name='debug';
	Page.item.debug.metroBlock=MetroBlock.item.help;
	Page.item.debug.onload=function(){
		$('#main')
			.append('<input id="fileIn" type="file"/>')
			.append($('<a href="#">ClickMe</a>')
				.click(function(){
					var file=$('#fileIn')[0].files[0];
					var reader=new FileReader();
					reader.readAsArrayBuffer(file);
					reader.onload=function(){
						var worker=new Worker('compressor.js');
						worker.onmessage=function(evt){
							worker.terminate();
							new Moo().sendBlob({
								data: evt.data,
								success: function(id){
									console.log('Got id='+id);
									new Moo().getBlob({
										id: id,
										success: function(data){
											console.log(data);
										}
									});
								}
							});
							console.log('Before: '+reader.result.byteLength+' After: '+evt.data.length);
						};
						worker.postMessage(reader.result);
					};
					return false;
				}));
	};
	Page.item.debug.onunload=function(){
	};
})();