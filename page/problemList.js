﻿"use strict";
(function(){
	var listTable,params;
	
	function translate(line){
		return {
			ID: line.ID,
			Problem: Link.problem(line.Problem),
			MyScore: {
				text: line.MyScore==null?'':line.MyScore,
				href: {page:'recordList',userID:Moo.currentUser.ID,problemID:line.ID}
			},
			AverageScore: {
				text: line.AverageScore==null?'':line.AverageScore,
				href: {page:'recordList',problemID:line.ID}
			},
			FullScore: line.FullScore,
			SubmissionTimes: line.SubmissionTimes,
			SubmissionUser: line.SubmissionUser,
			dblclick: function(){
				Page.item.problem.load({id:line.ID});
			}
		};
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		var query={skip:start,top:Config.itemNumberEachTime};
		if(params.tagID)
			query.tagID=params.tagID;
		
		moo.GET({
			URI: '/Problems',
			data: query,
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	function deleteProblem(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Problems/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	Page.item.problemList=new Page();
	Page.item.problemList.name='problemList';
	Page.item.problemList.onload=function(_params){
		params=_params;
		$('#pageTitle').text('题目列表');
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">创建新题目</a>')
					.click(function(){
						Page.item.problemCreate.load();
						return false;
					})));
		
		listTable=new ListTable({
			columns: [
				{title:'题目编号',type:'number',field:'ID'},
				{title:'名称',type:'html',field:'Problem'},
				{title:'我的分数',type:'link',field:'MyScore'},
				{title:'平均分数',type:'link',field:'AverageScore'},
				{title:'满分',type:'number',field:'FullScore'},
				{title:'提交次数',type:'number',field:'SubmissionTimes'},
				{title:'提交人数',type:'number',field:'SubmissionUser'}
			],
			dataPicker: dataPicker,
			singleMenu: [
				{title:'查看',action:function(id){Page.item.problem.load({'id':id})}},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号题目吗'))
						deleteProblem(id);
				}},
			],
			multipleMenu: [
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'道题目吗')){
						for(var i=0;i<ids.length;i++)
							deleteProblem(ids[i]);
					}
				}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.problemList.onunload=function(){
	};
	Page.item.problemList.metroBlock=MetroBlock.item.problem;
})();