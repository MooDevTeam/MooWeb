var MetroBlock={};

MetroBlock.item={
	problem: $('<div style="background: green;">Problem</div>')
		.click(function(){
			Page.item.problemList.load();
			return false;
		}),
	record: $('<div style="background: blue;">Record</div>')
		.click(function(){
			Page.item.recordList.load();
			return false;
		}),
	post: $('<div style="background: red;">Post</div>')
		.click(function(){
			Page.item.postList.load();
			return false;
		}),
	article: $('<div style="background: purple;">Article</div>')
		.click(function(){
			Page.item.articleList.load();
			return false;
		}),
	user: $('<div style="background: gold;">User</div>')
		.click(function(){
			Page.item.userList.load();
			return false;
		}),
	contest: $('<div style="background: cyan;">Contest</div>')
		.click(function(){
			Page.item.contest.load();
			return false;
		}),
	wikiSandbox: $('<div style="background: pink;">Wiki Sandbox</div>')
		.click(function(){
			Page.item.wikiSandbox.load();
			return false;
		}),
	help: $('<div style="background: orangered;">Help</div>')
		.click(function(){
			Page.item.helpIndex.load();
			return false;
		}),
};

MetroBlock.init=function(){
	for(var blockName in MetroBlock.item){
		var block=MetroBlock.item[blockName];
		block.addClass('metroBlock').addClass('big');
		
		var index=$('#sidePanel .metroBlock').length;
		if(index % 2 == 0){
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
		
		$('#sidePanel').append(block);
	}
};