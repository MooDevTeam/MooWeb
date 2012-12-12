"use strict";
(function(){
	var listTable,params;
	
	function translate(line){
		return {
			ID: line.ID,
			Name: line.Name,
			ProblemNumber: {
				text: String(line.ProblemNumber),
				href: {page:'problemList',tagID:line.ID}
			},
			ArticleNumber: {
				text: String(line.ArticleNumber),
				href: {page:'articleList',tagID:line.ID}
			}
		};
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		var query={skip:start,top:Config.itemNumberEachTime};
		
		moo.GET({
			URI: '/Tags',
			data: query,
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	function deleteTag(id){
		var data=listTable.rowMap[id].data('data');
		var moo=new Moo();
		moo.DELETE({
			URI: '/Tags/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
		return false;
	}
	
	function modifyName(id){
		var oldName=listTable.rowMap[id].data('data').Name;
		Prompt.string({
			text: '请输入新的名称',
			value: oldName,
			success: function(newName){
				new Moo().PUT({
					URI: '/Tags/'+id,
					data: {tag:{
						Name: newName
					}},
					success: function(){
						new Moo().GET({
							URI: '/Tags',
							data: {id:id},
							success: function(data){
								listTable.rowMap[id].fadeOut('slow',function(){
									listTable.bindRow(listTable.rowMap[id],translate(data[0]));
									listTable.rowMap[id].fadeIn('slow').css('display','table-row');
								});
							}
						});
					}
				});
			}
		});
		return false;
	}
	
	function createTag(){
		Prompt.string({
			text:'请输入新标签的名称',
			success: function(name){
				new Moo().POST({
					URI: '/Tags',
					data: {tag:{
						Name: name
					}},
					success: function(){
						new MsgBar('info','成功加入标签');
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	Page.item.tagList=new Page();
	Page.item.tagList.name='tagList';
	Page.item.tagList.onload=function(_params){
		params=_params;
		$('#pageTitle').text('标签列表');
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">添加新标签</a>')
					.click(function(){
						createTag();
						return false;
					})));
		
		listTable=new ListTable({
			columns: [
				{title:'标签编号',type:'number',field:'ID'},
				{title:'名称',type:'text',field:'Name'},
				{title:'引用题目数量',type:'link',field:'ProblemNumber'},
				{title:'引用文章数量',type:'link',field:'ArticleNumber'}
			],
			dataPicker: dataPicker,
			singleMenu: [
				{title:'更改名称',action:modifyName},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号标签吗'))
						deleteTag(id);
				}},
			],
			multipleMenu: [
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'个标签吗')){
						for(var i=0;i<ids.length;i++)
							deleteTag(ids[i]);
					}
				}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.tagList.onunload=function(){
	};
	Page.item.tagList.metroBlock=MetroBlock.item.help;
})();