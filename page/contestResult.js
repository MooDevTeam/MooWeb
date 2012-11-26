"use strict";
(function(){
	var params;
	
	function translate(line){
		var data= {
			ID: line.ID,
			User: Link.user(line),
			Score: {
				text: line.Score,
				href: {page:'recordList',contestID:params.id,userID:line.ID}
			},
			dblclick: function(){
				Page.item.recordList.load({contestID:params.id,userID:line.ID});
			}
		};
		
		line.Scores.forEach(function(s){
			data[s.ID]={
				text: s.Score,
				href: {page:'recordList',contestID:params.id,userID:line.ID,problemID: s.ID}
			};
		});
		return data;
	}
	
	function dataPicker(start,callback){
		new Moo().GET({
			URI: '/Contests/'+params.id+'/Result',
			data: {skip:start,top:Config.itemNumberEachTime},
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	Page.item.contestResult=new Page();
	Page.item.contestResult.name='contestResult';
	Page.item.contestResult.metroBlock=MetroBlock.item.contest;
	Page.item.contestResult.onload=function(_params){
		params=_params;

		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回比赛</a>')
					.click(function(){
						Page.item.contest.load({id:params.id});
						return 0;
					})));

		new Moo().GET({
			URI: '/Contests/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name+'的结果');
				
				var columns=[
					{title:'用户编号',type:'number',field:'ID'},
					{title:'名称',type:'html',field:'User'},
					{title:'总分',type:'link',field:'Score'},
				];
				data.Problem.forEach(function(p){
					columns.push({title:$('<a href="#"/>')
						.text(p.Name)
						.click(function(){
							Page.item.recordList.load({contestID:params.id,problemID:p.ID});
							return false;
						}),type:'link',field:p.ID});
				});
				
				var listTable=new ListTable({
					columns:columns,
					dataPicker: dataPicker,
				});
				
				$('#main').append(listTable.html());
				listTable.fillScreen();
			}
		});
	};
	Page.item.contestResult.onunload=function(){
	};
})();