"use strict";
var MetroBlock={};

MetroBlock.item={
	problem: $('<div style="background: green;"><div class="title">Problem</div></div>')
		.click(function(){
			Page.item.problemList.load();
			return false;
		}),
	record: $('<div style="background: blue;"><div class="title">Record</div></div>')
		.click(function(){
			Page.item.recordList.load();
			return false;
		}),
	article: $('<div style="background: purple;"><div class="title">Article</div></div>')
		.click(function(){
			Page.item.articleList.load();
			return false;
		}),
	post: $('<div style="background: red;"><div class="title">Post</div></div>')
		.click(function(){
			Page.item.postList.load();
			return false;
		}),
	user: $('<div style="background: goldenrod;"><div class="title">User</div></div>')
		.click(function(){
			Page.item.userList.load();
			return false;
		}),
	contest: $('<div style="background: darkcyan;"><div class="title">Contest</div></div>')
		.click(function(){
			Page.item.contestList.load();
			return false;
		}),
	file: $('<div style="background: brown;"><div class="title">File</div></div>')
		.click(function(){
			Page.item.fileList.load();
			return false;
		}),
	help: $('<div style="background: orangered;"><div class="title">Help</div></div>')
		.click(function(){
			Page.item.wikiSandbox.load();
			return false;
		})
};

MetroBlock.init=function(){
	var toAppend=[];
	
	var index=0;
	for(var blockName in MetroBlock.item){
		var block=MetroBlock.item[blockName];
		block.disableSelection();
		block.addClass('metroBlock').addClass('big');
		
		if(index++ % 2 == 0){
			block.css({
				'float':'left',
				'clear':'left'
			});
		}else{
			block.css({
				'float':'right',
				'clear':'right'
			});
		}
		
		toAppend.push(block);
	}
	
	$('#sidePanel').prepend(toAppend);
};