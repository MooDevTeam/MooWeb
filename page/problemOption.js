"use strict";
(function(){
	var params;
	function onsubmit(){
		var moo=new Moo();
		moo.restore=function(){
			$('#btnSubmit').attr('disabled',false);
		};
		$('#btnSubmit').attr('disabled',true);
		moo.PUT({
			URI: '/Problems/'+params.id,
			data:{problem:{
				Locked: $('#chkLocked').attr('checked')=='checked',
				Hidden: $('#chkHidden').attr('checked')=='checked',
				TestCaseLocked: $('#chkTestCaseLocked').attr('checked')=='checked',
				TestCaseHidden: $('#chkTestCaseHidden').attr('checked')=='checked',
				ArticleLocked: $('#chkArticleLocked').attr('checked')=='checked',
				PostLocked: $('#chkPostLocked').attr('checked')=='checked',
				RecordLocked: $('#chkRecordLocked').attr('checked')=='checked',
				EnableTesting: $('#chkEnableTesting').attr('checked')=='checked',
				Type: $('#selType').val()
			}},
			success: function(){
				MsgBar.show('info','修改成功');
				Page.refresh();
			}
		});
		return false;
	}
	
	function load(){
		new Moo().GET({
			URI: '/Problems/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name+'的选项');
				$('#chkLocked').attr('checked',data.Locked);
				$('#chkHidden').attr('checked',data.Hidden);
				$('#chkTestCaseLocked').attr('checked',data.TestCaseLocked);
				$('#chkTestCaseHidden').attr('checked',data.TestCaseHidden);
				$('#chkArticleLocked').attr('checked',data.ArticleLocked);
				$('#chkPostLocked').attr('checked',data.PostLocked);
				$('#chkRecordLocked').attr('checked',data.RecordLocked);
				$('#chkEnableTesting').attr('checked',data.EnableTesting);
				$('#selType').val(data.Type);
			}
		});
	}
	
	Page.item.problemOption=new Page();
	Page.item.problemOption.name='problemOption';
	Page.item.problemOption.metroBlock=MetroBlock.item.problem;
	Page.item.problemOption.onload=function(_params){
		params=_params;
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回题目</a>')
					.click(function(){
						Page.item.problem.load({id:params.id});
						return false;
					})));
		
		$('#main')
			.append($('<form/>')
				.disableSelection()
				.css('padding','10px')
				.submit(onsubmit)
				.append($('<fieldset>')
					.append('<legend>题目本身</legend>')
					.append('<input id="chkLocked" type="checkbox"/><label for="chkLocked">锁定</label>')
					.append('<input id="chkHidden" type="checkbox"/><label for="chkHidden">隐藏</label>'))
				.append($('<fieldset>')
					.append('<legend>测试数据</legend>')
					.append('<input id="chkTestCaseLocked" type="checkbox"/><label for="chkTestCaseLocked">锁定</label>')
					.append('<input id="chkTestCaseHidden" type="checkbox"/><label for="chkTestCaseHidden">隐藏</label>'))
				.append($('<fieldset>')
					.append('<legend>相关文章</legend>')
					.append('<input id="chkArticleLocked" type="checkbox"/><label for="chkArticleLocked">锁定</label>'))
				.append($('<fieldset>')
					.append('<legend>相关帖子</legend>')
					.append('<input id="chkPostLocked" type="checkbox"/><label for="chkPostLocked">锁定</label>'))
				.append($('<fieldset>')
					.append('<legend>相关记录</legend>')
					.append('<input id="chkRecordLocked" type="checkbox"/><label for="chkRecordLocked">锁定</label>'))
				.append($('<fieldset>')
					.append('<legend>杂项</legend>')
					.append('<input id="chkEnableTesting" type="checkbox"/><label for="chkEnableTesting">评测此题</label>')
					.append($('<div/>')
						.append('<label for="selType">题目类型</label>')
						.append($('<select id="selType"/>')
							.append('<option value="Tranditional">传统</option>')
							.append('<option value="SpecialJudged">自定义测评</option>')
							.append('<option value="Interactive">交互式</option>')
							.append('<option value="AnswerOnly">提交答案</option>'))))
				.append('<input id="btnSubmit" type="submit" value="修改"/>'));
		load();
	};
	Page.item.problemOption.onunload=function(){
	};
})();