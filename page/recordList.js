"use strict";
(function(){
	var listTable;
	
	function translate(line){
		return {
			ID: line.ID,
			CreateTime: line.CreateTime,
			Language: {
				'c++':'C++',
				'pascal':'Pascal',
				'c':'C',
				'java':'Java',
				'plaintext':'N/A'
			}[line.Language] || line.Language,
			Problem: Link.problem(line.Problem),
			User: Link.user(line.User),
			Score: {
				text: line.Score===null?'尚未评测'
					:line.Score==-1?'评测中'
					:line.Score==-2?'已评测'
					:line.Score,
				href: {page:'record',id:line.ID}
			},
			dblclick: function(){Page.item.record.load({id:line.ID});}
		};
	}
	
	function dataPicker(params,start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		var query={skip:start,top:Config.itemNumberEachTime};
		if(params.userID)
			query.userID=params.userID;
		if(params.contestID)
			query.contestID=params.contestID;
		if(params.problemID)
			query.problemID=params.problemID;
		
		moo.GET({
			URI: '/Records',
			data: query,
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	function deleteRecord(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Records/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	function rejudgeRecord(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Records/'+id+'/JudgeInfo',
			success: function(){
				moo.GET({
					URI: '/Records',
					data: {'id':id},
					success: function(data){
						listTable.rowMap[id].fadeOut('slow',function(){
							listTable.bindRow(listTable.rowMap[id],translate(data[0]));
							listTable.rowMap[id].fadeIn('slow');
						});
					}
				});
			}
		});
	}
	
	Page.item.recordList=new Page();
	Page.item.recordList.name='recordList';
	Page.item.recordList.onload=function(params){
		$('#pageTitle').text('记录列表');
		
		listTable=new ListTable({
			columns: [
				{title:'记录编号',type:'number',field:'ID'},
				{title:'提交时间',type:'date',field:'CreateTime'},
				{title:'题目',type:'html',field:'Problem'},
				{title:'用户',type:'html',field:'User'},
				{title:'语言',type:'text',field:'Language'},
				{title:'分数',type:'link',field:'Score'}
			],
			dataPicker: dataPicker.bind(null,params),
			singleMenu: [
				{title:'查看',action:function(id){Page.item.record.load({'id':id})}},
				{title:'重测',action:function(id){
					if(confirm('确实要重测'+id+'号记录吗'))
						rejudgeRecord(id);
				}},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号记录吗'))
						deleteRecord(id);
				}},
			],
			multipleMenu: [
				{title:'重测',action:function(ids){
					if(confirm('确实要重测'+ids.length+'条记录吗')){
						for(var i=0;i<ids.length;i++)
							rejudgeRecord(ids[i]);
					}
				}},
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'条记录吗')){
						for(var i=0;i<ids.length;i++)
							deleteRecord(ids[i]);
					}
				}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.recordList.onunload=function(){
	};
	Page.item.recordList.metroBlock=MetroBlock.item.record;
})();