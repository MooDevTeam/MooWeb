(function(){
	var listTable;
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		moo.GET({
			URI: '/Records',
			data: {skip:start,top:Config.itemNumberEachTime},
			success: function(data){
				data=data.map(function(line){
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
						Score: line.Score,
						Problem: {
							text: line.Problem.Name,
							href: {page:'problem',id:line.Problem.ID}
						},
						User: {
							text: line.User.Name,
							href: {page:'user',id:line.User.ID}
						}
					};
				});
				callback(data,data.length==Config.itemNumberEachTime);
			},
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
		alert('Not Implemented:Rejudge Record '+id);
	}
	
	Page.item.recordList=new Page();
	Page.item.recordList.name='recordList';
	Page.item.recordList.onload=function(params){
		$('#pageTitle').text('记录列表');
		
		listTable=new ListTable();
		listTable.columns=
			[
				{title:'记录编号',type:'number',field:'ID'},
				{title:'提交时间',type:'date',field:'CreateTime'},
				{title:'题目',type:'link',field:'Problem'},
				{title:'用户',type:'link',field:'User'},
				{title:'语言',type:'text',field:'Language'},
				{title:'分数',type:'number',field:'Score'}
			];
		listTable.dataPicker=dataPicker;
		listTable.singleMenu=
			[
				{title:'查看',action:function(id){Page.item.record.load({'id':id})}},
				{title:'重测',action:rejudgeRecord},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号记录吗'))
						deleteRecord(id);
				}},
			];
		listTable.multipleMenu=
			[
				{title:'重测',action:function(ids){
					for(var i=0;i<ids.length;i++)
						rejudgeRecord(ids[i]);
				}},
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'条记录吗')){
						for(var i=0;i<ids.length;i++)
							deleteRecord(ids[i]);
					}
				}},
			];
		listTable.appendTo($('#main'));
		listTable.fillScreen();
	};
	Page.item.recordList.onunload=function(){
	};
	Page.item.recordList.metroBlock=MetroBlock.item.record;
})();