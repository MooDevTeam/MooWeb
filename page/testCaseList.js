"use strict";
(function(){
	var listTable,params;
	
	function translate(line){
		return {
			ID: line.ID,
			Type: {
				TraditionalTestCase: '传统',
				SpecialJudgedTestCase: '自定义测评',
				InteractiveTestCase: '交互式',
				AnswerOnlyTestCase: '提交答案'
			}[line.Type] || '未知',
			CreatedBy: Link.user(line.CreatedBy),
			dblclick: function(){
				Page.item.testCase.load({id:line.ID});
			}
		};
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		moo.GET({
			URI: '/Problems/'+params.id+'/TestCases',
			data: {skip:start,top:Config.itemNumberEachTime},
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	function deleteTestCase(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Problems/'+params.id+'/TestCases/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	Page.item.testCaseList=new Page();
	Page.item.testCaseList.name='testCaseList';
	Page.item.testCaseList.onload=function(_params){
		params=_params;
		
		new Moo().GET({
			URI: '/Problems/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name+'的测试数据');
			}
		});
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">添加测试数据</a>')
					.click(function(){
						Page.item.testCaseCreate.load({id:params.id});
						return false;
					}))
				.append($('<a href="#">返回题目</a>')
					.click(function(){
						Page.item.problem.load({id:params.id});
						return false;
					})));
		
		listTable=new ListTable({
			columns: [
				{title:'测试数据编号',type:'number',field:'ID'},
				{title:'类型',type:'text',field:'Type'},
				{title:'创建者',type:'html',field:'CreatedBy'},
			],
			dataPicker: dataPicker,
			singleMenu: [
				{title:'查看',action:function(id){Page.item.testCase.load({'id':id})}},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号测试数据吗'))
						deleteTestCase(id);
				}},
			],
			multipleMenu: [
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'组测试数据吗')){
						for(var i=0;i<ids.length;i++)
							deleteTestCase(ids[i]);
					}
				}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.testCaseList.onunload=function(){
	};
	Page.item.testCaseList.metroBlock=MetroBlock.item.problem;
})();