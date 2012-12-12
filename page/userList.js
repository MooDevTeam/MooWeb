"use strict";
(function(){
	var listTable,params;
	
	function translate(line,rank){
		var result= {
			Rank: rank,
			ID: line.ID,
			User: Link.user(line.User),
			Role: {
				Organizer: '组织者',
				Worker: '工作者',
				NormalUser: '普通用户',
				Reader: '浏览者'
			}[line.Role],
			//Score: line.Score,
			BriefDescription: line.BriefDescription,
			dblclick: function(){
				Page.item.user.load({id:line.ID});
			}
		};
		if(rank==1)
			result.css={background:'yellow'};
		else if(rank<=3)
			result.css={background:'gold'};
		else if(rank<=10)
			result.css={background:'lightCoral'};
		else if(rank<=100)
			result.css={background:'lightsalmon'};
		return result;
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		var query={skip:start,top:Config.itemNumberEachTime};
		
		moo.GET({
			URI: '/Users',
			data: query,
			success: function(data){
				for(var i=0;i<data.length;i++)
					data[i]=translate(data[i],i+start+1);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	Page.item.userList=new Page();
	Page.item.userList.name='userList';
	Page.item.userList.onload=function(_params){
		params=_params;
		$('#pageTitle').text('用户列表');
		
		listTable=new ListTable({
			columns: [
				{title:'排名',type:'number',field:'Rank'},
				{title:'用户编号',type:'number',field:'ID'},
				{title:'名称',type:'html',field:'User'},
				{title:'角色',type:'text',field:'Role'},
				//{title:'分数',type:'number',field:'Score'},
				{title:'简述',type:'text',field:'BriefDescription'},
			],
			dataPicker: dataPicker,
			singleMenu: [
				{title:'查看',action:function(id){Page.item.user.load({'id':id})}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.userList.onunload=function(){
	};
	Page.item.userList.metroBlock=MetroBlock.item.user;
})();