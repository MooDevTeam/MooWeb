"use strict";
(function(){
	var listTable,params;
	
	function translate(line){
		return {
			ID: line.ID,
			Article: Link.article(line.Article),
			Problem: line.Problem.ID==null?'':Link.problem(line.Problem),
			dblclick: function(){
				Page.item.article.load({id:line.ID});
			}
		};
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		var query={skip:start,top:Config.itemNumberEachTime};
		if(params.tagID)
			query.tagID=params.tagID;
		if(params.problemID)
			query.problemID=params.problemID;
		
		moo.GET({
			URI: '/Articles',
			data: query,
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	function deleteArticle(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Articles/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	Page.item.articleList=new Page();
	Page.item.articleList.name='articleList';
	Page.item.articleList.onload=function(_params){
		params=_params;
		$('#pageTitle').text('文章列表');
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">撰写新文章</a>')
					.click(function(){
						if(params.problemID)
							Page.item.articleCreate.load({problemID:params.problemID});
						else
							Page.item.articleCreate.load();
						return false;
					})));
		
		listTable=new ListTable({
			columns: [
				{title:'文章编号',type:'number',field:'ID'},
				{title:'名称',type:'html',field:'Article'},
				{title:'对应题目',type:'html',field:'Problem'},
			],
			dataPicker: dataPicker,
			singleMenu: [
				{title:'查看',action:function(id){Page.item.article.load({'id':id})}},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号文章吗'))
						deleteArticle(id);
				}},
			],
			multipleMenu: [
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'篇文章吗')){
						for(var i=0;i<ids.length;i++)
							deleteArticle(ids[i]);
					}
				}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.articleList.onunload=function(){
	};
	Page.item.articleList.metroBlock=MetroBlock.item.article;
})();