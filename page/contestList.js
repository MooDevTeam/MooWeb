"use strict";
(function(){
	var listTable,params;
	
	function translate(line){
		return {
			ID: line.ID,
			Status: line.Status=='Before'?'<span style="color:green;">尚未开始</span>'
				:line.Status=='During'?'<span style="color: red;">进行中</span>'
				:line.Status=='After'?'已结束':'??',
			Contest: Link.contest(line.Contest),
			StartTime: line.StartTime,
			EndTime: line.EndTime,
			dblclick: function(){
				Page.item.contest.load({id:line.ID});
			}
		};
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		var query={skip:start,top:Config.itemNumberEachTime};
		
		moo.GET({
			URI: '/Contests',
			data: query,
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	function deleteContest(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Contests/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	Page.item.contestList=new Page();
	Page.item.contestList.name='contestList';
	Page.item.contestList.onload=function(_params){
		params=_params;
		$('#pageTitle').text('比赛列表');
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">创建新比赛</a>')
					.click(function(){
						Page.item.contestCreate.load();
						return false;
					})));
		
		listTable=new ListTable({
			columns: [
				{title:'比赛编号',type:'number',field:'ID'},
				{title:'状态',type:'html',field:'Status'},
				{title:'名称',type:'html',field:'Contest'},
				{title:'开始时间',type:'date',field:'StartTime'},
				{title:'结束时间',type:'date',field:'EndTime'}
			],
			dataPicker: dataPicker,
			singleMenu: [
				{title:'查看',action:function(id){Page.item.contest.load({'id':id})}},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号比赛吗'))
						deleteContest(id);
				}},
			],
			multipleMenu: [
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'场比赛吗')){
						for(var i=0;i<ids.length;i++)
							deleteContest(ids[i]);
					}
				}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.contestList.onunload=function(){
	};
	Page.item.contestList.metroBlock=MetroBlock.item.contest;
})();