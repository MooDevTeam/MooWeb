"use strict";
(function(){
	var params;
	
	function onsubmit(){
		var moo=new Moo();
		moo.restore=function(){
			$('#btnSubmit').attr('disabled',false);
		};
		$('#btnSubmit').attr('disabled',true);
		
		moo.POST({
			URI: '/Contests',
			data: {contest:{
				Name: $('#txtTitle').val(),
				Description: $('#txtDescription').val(),
				StartTime: new Date($('#txtStartTime').val()).toMS(),
				EndTime: new Date($('#txtEndTime').val()).toMS(),
			}},
			success: function(id){
				MsgBar.show('info','比赛创建成功，请酌情修改选项。');
				Page.item.contestOption.load({id:id});
			}
		});
		return false;
	}
	
	Page.item.contestCreate=new Page();
	Page.item.contestCreate.name='contestCreate';
	Page.item.contestCreate.metroBlock=MetroBlock.item.contest;
	Page.item.contestCreate.onload=function(_params){
		params=_params;
		
		$('#pageTitle').text('创建新比赛');
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(onsubmit)
				.append('<div><input id="txtTitle" type="text" required="required" placeholder="标题"/></div>')
				.append(new WikiEditor({
					id: 'txtDescription',
					placeholder: '描述'
				}).html())
				.append($('<div/>')
					.append('<input id="txtStartTime" type="datetime" pattern="\\d{4}-\\d{1,2}-\\d{1,2} \\d{1,2}:\\d{1,2}:\\d{1,2}" title="YYYY-MM-DD HH:mm:ss" required="requried" placeholder="开始时间"/>')
					.append(' ')
					.append('<input id="txtEndTime" type="datetime" pattern="\\d{4}-\\d{1,2}-\\d{1,2} \\d{1,2}:\\d{1,2}:\\d{1,2}" title="YYYY-MM-DD HH:mm:ss" required="requried" placeholder="结束时间"/>'))
				.append('<div><input id="btnSubmit" type="submit" value="创建"/></div>'));
	};
	Page.item.contestCreate.onunload=function(){
	};
})();