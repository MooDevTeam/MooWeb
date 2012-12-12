"use strict";
(function(){
	var params;
	
	function download(field){
		new Moo().GET({
			URI: '/Problems/xxx/TestCases/'+params.id,
			success: function(data){
				$('#main')
					.append($('<iframe style="display:none;"/>')
						.attr('src',Moo.URL+'/Blob.ashx?id='+data[field].BlobID));
			}
		});
	}
	
	function modifyTimeLimit(type,oldTimeLimit){
		Prompt.number({
			text: '请输入新的时间限制',
			value: oldTimeLimit,
			min: 0,
			max: 60000,
			success: function(newTimeLimit){
				new Moo().PUT({
					URI: '/Problems/xxx/TestCases/'+type+'/'+params.id,
					data: {testCase:{
						TimeLimit: newTimeLimit
					}},
					success: function(){
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	function modifyMemoryLimit(type,oldMemoryLimit){
		Prompt.number({
			text: '请输入新的内存限制',
			value: oldMemoryLimit,
			min: 0,
			max: 2147483647,
			success: function(newMemoryLimit){
				new Moo().PUT({
					URI: '/Problems/xxx/TestCases/'+type+'/'+params.id,
					data: {testCase:{
						MemoryLimit: newMemoryLimit
					}},
					success: function(){
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	function loadTraditional(data){
		$('#main')
			.append(new DetailTable({
						columns:[
							{title:'题目',type:'html',data:Link.problem(data.Problem)},
							{title:'类型',type:'text',data:'传统'},
							{title:'创建者',type:'html',data:Link.user(data.CreatedBy)},
							{title:'创建时间',type:'date',data: data.CreateTime},
							{title:'时间限制(ms)',type:'html',data:
								$('<div/>')
									.text(String(data.TimeLimit))
									.append($('<a href="#"><img src="image/pen.png" style="width: 20px; vertical-align: bottom;" alt=""/></a>')
										.click(modifyTimeLimit.bind(null,'Traditional',data.TimeLimit)))},
							{title:'内存限制(bytes)',type:'html',data:
								$('<div/>')
									.text(String(data.MemoryLimit))
									.append($('<a href="#"><img src="image/pen.png" style="width: 20px; vertical-align: bottom;" alt=""/></a>')
										.click(modifyMemoryLimit.bind(null,'Traditional',data.MemoryLimit)))},
							{title:'分数',type:'number',data:data.Score}
						]
					}).html())
			.append($('<div style="padding: 10px;"/>')
				.append($('<table/>')
					.css({
						'width':'100%',
						'border-collapse':'collapse'
					})
					.append($('<thead/>')
						.append($('<tr/>')
							.append($('<th/>')
								.append('部分输入')
								.append($('<a href="#" title="更新输入"><img src="image/upload.png" style="width:20px;" alt="Upload"/></a>'))
								.append($('<a href="#" title="下载完整输入"><img src="image/download.png" style="width:20px;" alt="Download"/></a>')
									.click(function(){
										download('Input');
										return false;
									})))
							.append($('<th/>')
								.append('部分答案')
								.append($('<a href="#" title="更新答案"><img src="image/upload.png" style="width:20px;" alt="Upload"/></a>'))
								.append($('<a href="#" title="下载完整答案"><img src="image/download.png" style="width:20px;" alt="Download"/></a>')
									.click(function(){
										download('Answer');
										return false;
									})))))
					.append($('<tbody/>')
						.append($('<tr/>')
							.append($('<td/>').append($('<textarea rows="20" cols="0" readonly="readonly"/>').val(data.Input.Preview)))
							.append($('<td/>').append($('<textarea rows="20" cols="20" readonly="readonly"/>').val(data.Answer.Preview)))))));
		$('textarea').css({
			'width':'100%',
			'margin':'0',
			'border':'0',
			'padding':'0',
			'box-shadow':'0 0 5px gray inset'
		});
	}
	
	function loadSpecialJudged(data){
		$('#main')
			.append(new DetailTable({
						columns:[
							{title:'题目',type:'html',data:Link.problem(data.Problem)},
							{title:'类型',type:'text',data:'自定义测评'},
							{title:'创建者',type:'html',data:Link.user(data.CreatedBy)},
							{title:'创建时间',type:'date',data: data.CreateTime},
							{title:'时间限制(ms)',type:'html',data:
								$('<div/>')
									.text(String(data.TimeLimit))
									.append($('<a href="#"><img src="image/pen.png" style="width: 20px; vertical-align: bottom;" alt=""/></a>')
										.click(modifyTimeLimit.bind(null,'SpecialJudged',data.TimeLimit)))},
							{title:'内存限制(bytes)',type:'html',data:
								$('<div/>')
									.text(String(data.MemoryLimit))
									.append($('<a href="#"><img src="image/pen.png" style="width: 20px; vertical-align: bottom;" alt=""/></a>')
										.click(modifyMemoryLimit.bind(null,'SpecialJudged',data.MemoryLimit)))},
							{title:'测评程序',type:'html',data:Link.file(data.Judger)}
						]
					}).html())
			.append($('<div style="padding: 10px;"/>')
				.append($('<table/>')
					.css({
						'width':'100%',
						'border-collapse':'collapse'
					})
					.append($('<thead/>')
						.append($('<tr/>')
							.append($('<th/>')
								.append('部分输入')
								.append($('<a href="#" title="更新输入"><img src="image/upload.png" style="width:20px;" alt="Upload"/></a>'))
								.append($('<a href="#" title="下载完整输入"><img src="image/download.png" style="width:20px;" alt="Download"/></a>')
									.click(function(){
										download('Input');
										return false;
									})))
							.append($('<th/>')
								.append('部分答案')
								.append($('<a href="#" title="更新答案"><img src="image/upload.png" style="width:20px;" alt="Upload"/></a>'))
								.append($('<a href="#" title="下载完整答案"><img src="image/download.png" style="width:20px;" alt="Download"/></a>')
									.click(function(){
										download('Answer');
										return false;
									})))))
					.append($('<tbody/>')
						.append($('<tr/>')
							.append($('<td/>').append($('<textarea rows="20" cols="0" readonly="readonly"/>').val(data.Input.Preview)))
							.append($('<td/>').append($('<textarea rows="20" cols="20" readonly="readonly"/>').val(data.Answer.Preview)))))));
		$('textarea').css({
			'width':'100%',
			'margin':'0',
			'border':'0',
			'padding':'0',
			'box-shadow':'0 0 5px gray inset'
		});
	}
	
	function loadInteractive(data){
		$('#main')
			.append(new DetailTable({
						columns:[
							{title:'题目',type:'html',data:Link.problem(data.Problem)},
							{title:'类型',type:'text',data:'交互式'},
							{title:'创建者',type:'html',data:Link.user(data.CreatedBy)},
							{title:'创建时间',type:'date',data: data.CreateTime},
							{title:'时间限制(ms)',type:'html',data:
								$('<div/>')
									.text(String(data.TimeLimit))
									.append($('<a href="#"><img src="image/pen.png" style="width: 20px; vertical-align: bottom;" alt=""/></a>')
										.click(modifyTimeLimit.bind(null,'Interactive',data.TimeLimit)))},
							{title:'内存限制(bytes)',type:'html',data:
								$('<div/>')
									.text(String(data.MemoryLimit))
									.append($('<a href="#"><img src="image/pen.png" style="width: 20px; vertical-align: bottom;" alt=""/></a>')
										.click(modifyMemoryLimit.bind(null,'Interactive',data.MemoryLimit)))},
							{title:'调用程序',type:'html',data:Link.file(data.Invoker)}
						]
					}).html())
			.append($('<div style="padding: 10px;"/>')
				.append($('<table/>')
					.css({
						'width':'100%',
						'border-collapse':'collapse'
					})
					.append($('<thead/>')
						.append($('<tr/>')
							.append($('<th/>')
								.append('测评资料')
								.append($('<a href="#" title="更新测评资料"><img src="image/upload.png" style="width:20px;" alt="Upload"/></a>'))
								.append($('<a href="#" title="下载完整测评资料"><img src="image/download.png" style="width:20px;" alt="Download"/></a>')
									.click(function(){
										download('TestData');
										return false;
									})))))
					.append($('<tbody/>')
						.append($('<tr/>')
							.append($('<td/>').append($('<textarea rows="20" cols="0" readonly="readonly"/>').val(data.TestData.Preview)))))));
		$('textarea').css({
			'width':'100%',
			'margin':'0',
			'border':'0',
			'padding':'0',
			'box-shadow':'0 0 5px gray inset'
		});
	}
	
	function loadAnswerOnly(data){
		$('#main')
			.append(new DetailTable({
						columns:[
							{title:'题目',type:'html',data:Link.problem(data.Problem)},
							{title:'类型',type:'text',data:'交互式'},
							{title:'创建者',type:'html',data:Link.user(data.CreatedBy)},
							{title:'创建时间',type:'date',data: data.CreateTime},
							{title:'测评程序',type:'html',data:Link.file(data.Judger)}
						]
					}).html())
			.append($('<div style="padding: 10px;"/>')
				.append($('<table/>')
					.css({
						'width':'100%',
						'border-collapse':'collapse'
					})
					.append($('<thead/>')
						.append($('<tr/>')
							.append($('<th/>')
								.append('测评资料')
								.append($('<a href="#" title="更新测评资料"><img src="image/upload.png" style="width:20px;" alt="Upload"/></a>'))
								.append($('<a href="#" title="下载完整测评资料"><img src="image/download.png" style="width:20px;" alt="Download"/></a>')
									.click(function(){
										download('TestData');
										return false;
									})))))
					.append($('<tbody/>')
						.append($('<tr/>')
							.append($('<td/>').append($('<textarea rows="20" cols="0" readonly="readonly"/>').val(data.TestData.Preview)))))));
		$('textarea').css({
			'width':'100%',
			'margin':'0',
			'border':'0',
			'padding':'0',
			'box-shadow':'0 0 5px gray inset'
		});
	}
	
	Page.item.testCase=new Page();
	Page.item.testCase.name='testCase';
	Page.item.testCase.metroBlock=MetroBlock.item.problem;
	Page.item.testCase.onload=function(_params){
		params=_params;
		
		$('#pageTitle').text('第'+params.id+'号测试数据');
		
		new Moo().GET({
			URI: '/Problems/XXX/TestCases/'+params.id,
			success: function(data){
				$('#toolbar')
				.append($('<li/>')
					.append($('<a href="#">返回数据列表</a>')
						.click(function(){
							Page.item.testCaseList.load({id:data.Problem.ID});
							return false;
						})));
				switch(data.Type){
					case 'TraditionalTestCase':
						loadTraditional(data);
						break;
					case 'SpecialJudgedTestCase':
						loadSpecialJudged(data);
						break;
					case 'InteractiveTestCase':
						loadInteractive(data);
						break;
					case 'AnswerOnlyTestCase':
						loadAnswerOnly(data);
						break;
					default:
						assert(false);
				}
			}
		});
	};
	Page.item.testCase.onunload=function(_params){
	};
})();