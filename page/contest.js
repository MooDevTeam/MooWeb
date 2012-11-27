"use strict";
(function(){
	var listTable,params;
	
	function addProblem(){
		Prompt.problem({
			text:'请输入需要加入比赛的题目',
			success: function(id){
				new Moo().POST({
					URI: '/Contests/'+params.id+'/Problems',
					data: {problemID:id},
					success: function(){
						MsgBar.show('info','题目成功添加');
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	function modifyStartTime(){
		Prompt.date({
			text: '请输入新的开始时间',
			success: function(date){
				new Moo().PUT({
					URI: '/Contests/'+params.id,
					data: {contest:{
						StartTime: date.toMS()
					}},
					success: function(){
						MsgBar.show('info','开始时间已修改');
						Page.refresh();
					}
				});
			}
		});
	}
	
	function modifyEndTime(){
		Prompt.date({
			text: '请输入新的结束时间',
			success: function(date){
				new Moo().PUT({
					URI: '/Contests/'+params.id,
					data: {contest:{
						EndTime: date.toMS()
					}},
					success: function(){
						MsgBar.show('info','结束时间已修改');
						Page.refresh();
					}
				});
			}
		});
	}
	
	function modifyDescription(oldDesc){
		Prompt.text({
			text: '请输入新的描述',
			value: oldDesc,
			success: function(newDesc){
				new Moo().PUT({
					URI: '/Contests/'+params.id,
					data: {contest:{
						Description: newDesc
					}},
					success: function(){
						MsgBar.show('info','描述修改成功');
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	function modifyTitle(){
		Prompt.string({
			text: '请输入新的标题',
			value: $('#pageTitle').text(),
			success: function(newTitle){
				new Moo().PUT({
					URI: '/Contests/'+params.id,
					data: {contest:{
						Name: newTitle
					}},
					success: function(){
						$('#pageTitle').text(newTitle);
					}
				});
			}
		});
		return false;
	}
	
	function attend(){
		new Moo().POST({
			URI: '/Contests/'+params.id+'/Attend',
			success: function(){
				MsgBar.show('info','已报名');
				Page.refresh();
			}
		});
	}
	
	function deleteProblem(id){
		new Moo().DELETE({
			URI: '/Contests/'+params.id+'/Problems/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	Page.item.contest=new Page();
	Page.item.contest.name='contest';
	Page.item.contest.metroBlock=MetroBlock.item.contest;
	Page.item.contest.onload=function(_params){
		params=_params;
		
		$('#mainTopBarLeft')
			.after($('<a id="linkModifyTitle" href="#" title="修改标题"><img src="image/pen.png" style="width: 20px; vertical-align: bottom;" alt=""/></a>')
				.click(modifyTitle));
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">查看结果</a>')
					.click(function(){
						Page.item.contestResult.load({id:params.id});
						return false;
					})))
			.append($('<li/>')
				.append($('<a href="#">选项</a>')
					.click(function(){
						Page.item.contestOption.load({id:params.id});
						return false;
					})));
		
		new Moo().GET({
			URI: '/Contests/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name);
				
				var detailTableColumns=[
					{title:'状态',type:'html',data:data.Status=='Before'?'<span style="color:green;">尚未开始</span>'
											:data.Status=='During'?'<span style="color: red;">进行中</span>'
											:data.Status=='After'?'已结束':'??'},
					{title:'开始时间',type:'html',data:
						$('<div/>')
							.append(data.StartTime.toString())
							.append($('<a href="#" title="修改"><img src="image/pen.png" style="width: 30px; vertical-align: bottom;" alt=""/></a>')
								.click(modifyStartTime))},
					{title:'结束时间',type:'html',data:
						$('<div/>')
							.append(data.EndTime.toString())
							.append($('<a href="#" title="修改"><img src="image/pen.png" style="width: 30px; vertical-align: bottom;" alt=""/></a>')
								.click(modifyEndTime))},
					{title:'报名人数',type:'number',data:data.UserNumber}
				];
				
				if(data.Attended)
					detailTableColumns.push({title:'我的状态',type:'html',data:'<span style="color:green; font-weight: bold;">已报名</span>'});
				else if(data.EndTime<new Date())
					detailTableColumns.push({title:'我的状态',type:'html',data:'<span style="color: red; font-weight: bold;">未报名</span>'});
				else
					detailTableColumns.push({title:'报名',type:'html',data:
						$('<input type="button" value="立即报名"/>')
							.click(attend)});
				
				$('#main')
					.append(new DetailTable({
						columns: detailTableColumns
					}).html())
					.append($('<a href="#" title="修改描述" style="float: right;"><img src="image/pen.png" alt=""/></a>')
						.click(modifyDescription.bind(null,data.Description)))
					.append($('<div id="divContent" style="margin: 10px;"/>')
						.text(data.Description))
					.append('<div class="clear"/>');
				new Moo().POST({
					URI: '/ParseWiki',
					data: {wiki:data.Description},
					success: function(data){
						$('#divContent').html(data);
						$('pre code').each(function(i,e){hljs.highlightBlock(e);});
					}
				});
				
				listTable=new ListTable({
					caption: $('<span/>')
						.append('比赛试题')
						.append($('<a href="#" title="添加试题"><img src="image/add.png" style="width: 20px; vertical-align: bottom;" alt="Add"/></a>').click(addProblem)),
					columns:[
						{title:'题目编号',type:'number',field:'ID'},
						{title:'名称',type:'html',field:'Problem'},
						{title:'类型',type:'text',field:'Type'},
					],
					dataPicker: function(start,callback){
						callback(data.Problem.map(function(p){
							return {
								ID: p.ID,
								Problem: Link.problem(p),
								Type: {
									'Traditional':'传统',
									'SpecialJudged':'自定义测评',
									'Interactive':'交互式',
									'AnswerOnly':'提交答案'
								}[p.Type],
								dblclick: function(){
									Page.item.problem.load({id:p.ID});
								}
							};
						}),false);
					},
					singleMenu: [
						{title:'查看',action: function(id){Page.item.problem.load({id:id});}},
						{title:'从列表删除',action: function(id){
							if(confirm('确实要从列表删除'+id+'号题目吗'))
								deleteProblem(id);
						}}
					],
					multipleMenu: [
						{title:'从列表删除',action: function(ids){
							if(confirm('确实要从列表删除'+ids.length+'道题目吗')){
								for(var i=0;i<ids.length;i++)
									deleteProblem(ids[i]);
							}
						}}
					]
				});
				
				$('#main')
					.append(listTable.html()
						.css({
							'height':'auto'
						}));
				listTable.showMore();
			}
		});
	};
	Page.item.contest.onunload=function(){
		$('#linkModifyTitle').remove();
	};
})();