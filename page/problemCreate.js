"use strict";
(function(){
	function onsubmit(){
		$('#btnSubmit').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){
			$('#btnSubmit').attr('disabled',false);
		};
		moo.POST({
			URI: '/Problems',
			data: {problem:{
				Name: $('#txtTitle').val(),
				Content: $('#txtContent').val(),
				Type: $('#selType').val()
			}},
			success: function(data){
				if(confirm('题目创建成功，需要立即添加测试数据吗'))
					Page.item.testCaseCreate.load({id:data});
				else
					Page.item.problem.load({id:data});
			}
		});
		return false;
	}

	Page.item.problemCreate=new Page();
	Page.item.problemCreate.name='problemCreate';
	Page.item.problemCreate.metroBlock=MetroBlock.item.problem;
	Page.item.problemCreate.onload=function(){
		$('#pageTitle').text('创建新题目');
		
		$('#main')
			.append($('<form/>')
				.submit(onsubmit)
				.css('padding','10px')
				.append('<div><input id="txtTitle" type="text" required="required" placeholder="名称"/></div>')
				.append(new WikiEditor({
						id:'txtContent',
						placeholder:'内容'
					}).html())
				.append($('<div/>')
					.append($('<select id="selType" required="required"/>')
						.append('<option value="">题目类型</option>')
						.append('<option value="Traditional">传统</option>')
						.append('<option value="SpecialJudged">自定义测评</option>')
						.append('<option value="Interactive">交互式</option>')
						.append('<option value="AnswerOnly">提交答案</option>')))
				.append('<div><input id="btnSubmit" type="submit" value="创建"/></div>'));
	};
	Page.item.problemCreate.onunload=function(){
	};
})();