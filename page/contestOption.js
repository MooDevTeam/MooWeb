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
			URI: '/Contests/'+params.id,
			data:{contest:{
				EnableTestingOnStart: $('#chkEnableTestingOnStart').attr('checked')=='checked',
				EnableTestingOnEnd: $('#chkEnableTestingOnEnd').attr('checked')=='checked',
				
				HideProblemOnStart: $('#chkHideProblemOnStart').attr('checked')=='checked',
				HideProblemOnEnd: $('#chkHideProblemOnEnd').attr('checked')=='checked',
				
				HideTestCaseOnStart: $('#chkHideTestCaseOnStart').attr('checked')=='checked',
				HideTestCaseOnEnd: $('#chkHideTestCaseOnEnd').attr('checked')=='checked',
				
				HideJudgeInfoOnStart: $('#chkHideJudgeInfoOnStart').attr('checked')=='checked',
				HideJudgeInfoOnEnd: $('#chkHideJudgeInfoOnEnd').attr('checked')=='checked',
				
				LockArticleOnStart: $('#chkLockArticleOnStart').attr('checked')=='checked',
				LockArticleOnEnd: $('#chkLockArticleOnEnd').attr('checked')=='checked',
				
				LockPostOnStart: $('#chkLockPostOnStart').attr('checked')=='checked',
				LockPostOnEnd: $('#chkLockPostOnEnd').attr('checked')=='checked',
				
				LockProblemOnStart: $('#chkLockProblemOnStart').attr('checked')=='checked',
				LockProblemOnEnd: $('#chkLockProblemOnEnd').attr('checked')=='checked',
				
				LockRecordOnStart: $('#chkLockRecordOnStart').attr('checked')=='checked',
				LockRecordOnEnd: $('#chkLockRecordOnEnd').attr('checked')=='checked',
				
				LockTestCaseOnStart: $('#chkLockTestCaseOnStart').attr('checked')=='checked',
				LockTestCaseOnEnd: $('#chkLockTestCaseOnEnd').attr('checked')=='checked',
				
				ViewResultAnyTime: $('#chkViewResultAnyTime').attr('checked')=='checked',
			}},
			success: function(){
				new MsgBar('info','修改成功');
				Page.refresh();
			}
		});
		return false;
	}
	
	function load(){
		new Moo().GET({
			URI: '/Contests/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name+'的选项');
				
				$('#chkEnableTestingOnStart').attr('checked',data.EnableTestingOnStart);
				$('#chkEnableTestingOnEnd').attr('checked',data.EnableTestingOnEnd);
				
				$('#chkHideProblemOnStart').attr('checked',data.HideProblemOnStart);
				$('#chkHideProblemOnEnd').attr('checked',data.HideProblemOnEnd);
				
				$('#chkHideTestCaseOnStart').attr('checked',data.HideTestCaseOnStart);
				$('#chkHideTestCaseOnEnd').attr('checked',data.HideTestCaseOnEnd);
				
				$('#chkHideJudgeInfoOnStart').attr('checked',data.HideJudgeInfoOnStart);
				$('#chkHideJudgeInfoOnEnd').attr('checked',data.HideJudgeInfoOnEnd);
				
				$('#chkLockArticleOnStart').attr('checked',data.LockArticleOnStart);
				$('#chkLockArticleOnEnd').attr('checked',data.LockArticleOnEnd);
				
				$('#chkLockPostOnStart').attr('checked',data.LockPostOnStart);
				$('#chkLockPostOnEnd').attr('checked',data.LockPostOnEnd);
				
				$('#chkLockProblemOnStart').attr('checked',data.LockProblemOnStart);
				$('#chkLockProblemOnEnd').attr('checked',data.LockProblemOnEnd);
				
				$('#chkLockRecordOnStart').attr('checked',data.LockRecordOnStart);
				$('#chkLockRecordOnEnd').attr('checked',data.LockRecordOnEnd);
				
				$('#chkLockTestCaseOnStart').attr('checked',data.LockTestCaseOnStart);
				$('#chkLockTestCaseOnEnd').attr('checked',data.LockTestCaseOnEnd);
				
				$('#chkViewResultAnyTime').attr('checked',data.ViewResultAnyTime);
			}
		});
	}
	
	function setOI(){
		$('#chkEnableTestingOnStart').attr('checked',true);
		$('#chkEnableTestingOnEnd').attr('checked',true);
		
		$('#chkHideProblemOnStart').attr('checked',false);
		$('#chkHideProblemOnEnd').attr('checked',false);
		
		$('#chkHideTestCaseOnStart').attr('checked',true);
		$('#chkHideTestCaseOnEnd').attr('checked',false);
		
		$('#chkHideJudgeInfoOnStart').attr('checked',true);
		$('#chkHideJudgeInfoOnEnd').attr('checked',false);
		
		$('#chkLockArticleOnStart').attr('checked',true);
		$('#chkLockArticleOnEnd').attr('checked',false);
		
		$('#chkLockPostOnStart').attr('checked',true);
		$('#chkLockPostOnEnd').attr('checked',false);
		
		$('#chkLockProblemOnStart').attr('checked',true);
		$('#chkLockProblemOnEnd').attr('checked',false);
		
		$('#chkLockRecordOnStart').attr('checked',false);
		$('#chkLockRecordOnEnd').attr('checked',false);
		
		$('#chkLockTestCaseOnStart').attr('checked',true);
		$('#chkLockTestCaseOnEnd').attr('checked',false);
		
		$('#chkViewResultAnyTime').attr('checked',false);
	}
	
	function setACM(){
		$('#chkEnableTestingOnStart').attr('checked',true);
		$('#chkEnableTestingOnEnd').attr('checked',true);
		
		$('#chkHideProblemOnStart').attr('checked',false);
		$('#chkHideProblemOnEnd').attr('checked',false);
		
		$('#chkHideTestCaseOnStart').attr('checked',true);
		$('#chkHideTestCaseOnEnd').attr('checked',false);
		
		$('#chkHideJudgeInfoOnStart').attr('checked',false);
		$('#chkHideJudgeInfoOnEnd').attr('checked',false);
		
		$('#chkLockArticleOnStart').attr('checked',true);
		$('#chkLockArticleOnEnd').attr('checked',false);
		
		$('#chkLockPostOnStart').attr('checked',true);
		$('#chkLockPostOnEnd').attr('checked',false);
		
		$('#chkLockProblemOnStart').attr('checked',true);
		$('#chkLockProblemOnEnd').attr('checked',false);
		
		$('#chkLockRecordOnStart').attr('checked',false);
		$('#chkLockRecordOnEnd').attr('checked',false);
		
		$('#chkLockTestCaseOnStart').attr('checked',true);
		$('#chkLockTestCaseOnEnd').attr('checked',false);
		
		$('#chkViewResultAnyTime').attr('checked',true);
	}
	
	function setHackable(){
		$('#chkEnableTestingOnStart').attr('checked',true);
		$('#chkEnableTestingOnEnd').attr('checked',true);
		
		$('#chkHideProblemOnStart').attr('checked',false);
		$('#chkHideProblemOnEnd').attr('checked',false);
		
		$('#chkHideTestCaseOnStart').attr('checked',true);
		$('#chkHideTestCaseOnEnd').attr('checked',false);
		
		$('#chkHideJudgeInfoOnStart').attr('checked',false);
		$('#chkHideJudgeInfoOnEnd').attr('checked',false);
		
		$('#chkLockArticleOnStart').attr('checked',true);
		$('#chkLockArticleOnEnd').attr('checked',false);
		
		$('#chkLockPostOnStart').attr('checked',true);
		$('#chkLockPostOnEnd').attr('checked',false);
		
		$('#chkLockProblemOnStart').attr('checked',true);
		$('#chkLockProblemOnEnd').attr('checked',false);
		
		$('#chkLockRecordOnStart').attr('checked',false);
		$('#chkLockRecordOnEnd').attr('checked',false);
		
		$('#chkLockTestCaseOnStart').attr('checked',false);
		$('#chkLockTestCaseOnEnd').attr('checked',false);
		
		$('#chkViewResultAnyTime').attr('checked',true);
	}
	
	Page.item.contestOption=new Page();
	Page.item.contestOption.name='contestOption';
	Page.item.contestOption.metroBlock=MetroBlock.item.contest;
	Page.item.contestOption.onload=function(_params){
		params=_params;
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回比赛</a>')
					.click(function(){
						Page.item.contest.load({id:params.id});
						return false;
					})));
		
		$('#main')
			.append($('<form/>')
				.css('padding','10px')
				.submit(onsubmit)
				.append($('<fieldset/>')
					.disableSelection()
					.append('<legend>快速设置</legend>')
					.append($('<input type="button" value="OI"/>').click(setOI))
					.append($('<input type="button" value="ACM"/>').click(setACM))
					.append($('<input type="button" value="ACM+Hack"/>').click(setHackable)))
				.append($('<fieldset/>')
					.disableSelection()
					.append('<legend>开始后</legend>')
					.append('<input id="chkEnableTestingOnStart" type="checkbox"/><label for="chkEnableTestingOnStart">评测机工作</label>')
					.append('<input id="chkHideProblemOnStart" type="checkbox"/><label for="chkHideProblemOnStart">隐藏题目</label>')
					.append('<input id="chkHideTestCaseOnStart" type="checkbox"/><label for="chkHideTestCaseOnStart">隐藏测试数据</label>')
					.append('<input id="chkHideJudgeInfoOnStart" type="checkbox"/><label for="chkHideJudgeInfoOnStart">隐藏评测信息</label>')
					.append('<input id="chkLockArticleOnStart" type="checkbox"/><label for="chkLockArticleOnStart">锁定文章</label>')
					.append('<input id="chkLockPostOnStart" type="checkbox"/><label for="chkLockPostOnStart">锁定帖子</label>')
					.append('<input id="chkLockProblemOnStart" type="checkbox"/><label for="chkLockProblemOnStart">锁定题目</label>')
					.append('<input id="chkLockRecordOnStart" type="checkbox"/><label for="chkLockRecordOnStart">锁定记录</label>')
					.append('<input id="chkLockTestCaseOnStart" type="checkbox"/><label for="chkLockTestCaseOnStart">锁定测试数据</label>'))
				.append($('<fieldset/>')
					.disableSelection()
					.append('<legend>结束后</legend>')
					.append('<input id="chkEnableTestingOnEnd" type="checkbox"/><label for="chkEnableTestingOnEnd">评测机工作</label>')
					.append('<input id="chkHideProblemOnEnd" type="checkbox"/><label for="chkHideProblemOnEnd">隐藏题目</label>')
					.append('<input id="chkHideTestCaseOnEnd" type="checkbox"/><label for="chkHideTestCaseOnEnd">隐藏测试数据</label>')
					.append('<input id="chkHideJudgeInfoOnEnd" type="checkbox"/><label for="chkHideJudgeInfoOnEnd">隐藏评测信息</label>')
					.append('<input id="chkLockArticleOnEnd" type="checkbox"/><label for="chkLockArticleOnEnd">锁定文章</label>')
					.append('<input id="chkLockPostOnEnd" type="checkbox"/><label for="chkLockPostOnEnd">锁定帖子</label>')
					.append('<input id="chkLockProblemOnEnd" type="checkbox"/><label for="chkLockProblemOnEnd">锁定题目</label>')
					.append('<input id="chkLockRecordOnEnd" type="checkbox"/><label for="chkLockRecordOnEnd">锁定记录</label>')
					.append('<input id="chkLockTestCaseOnEnd" type="checkbox"/><label for="chkLockTestCaseOnEnd">锁定测试数据</label>'))
				.append($('<fieldset/>')
					.disableSelection()
					.append('<legend>杂项</legend>')
					.append('<input id="chkViewResultAnyTime" type="checkbox"/><label for="chkViewResultAnyTime">显示实时排名</label>'))
				.append('<input id="btnSubmit" type="submit" value="修改"/>'));
		load();
	};
	Page.item.contestOption.onunload=function(){
	};
})();