"use strict";
(function(){
	var params;
	
	function onsubmit(){
		$('#btnSubmit').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){
			$('#btnSubmit').attr('disabled',false);
		};
		moo.POST({
			URI: '/Articles',
			data: {article:{
				ProblemID: $('#txtProblemID').val()==''?null:Number($('#txtProblemID').val()),
				Name: $('#txtTitle').val(),
				Content: $('#txtContent').val()
			}},
			success: function(data){
				new MsgBar('info','创建成功');
				Page.item.article.load({id:data});
			}
		});
		return false;
	}
	
	Page.item.articleCreate=new Page();
	Page.item.articleCreate.name='articleCreate';
	Page.item.articleCreate.metroBlock=MetroBlock.item.article;
	Page.item.articleCreate.onload=function(_params){
		params=_params;
		$('#pageTitle').text('撰写新文章');
		
		$('#main')
			.append($('<form/>')
				.css('padding','10px')
				.submit(onsubmit)
				.append($('<div/>')
					.append('<input id="txtTitle" type="text" placeholder="名称" required="required"/>')
					.append(' ')
					.append(new AutoInput({
						id:'txtProblemID',
						type:'problem',
						placeholder: '相关题目',
						value: params.problemID?params.problemID:''
					}).html()))
				.append(new WikiEditor({
					id: 'txtContent',
					placeholder: '内容'
				}).html())
				.append('<div><input id="btnSubmit" type="submit" value="创建"/></div>'));
	};
	Page.item.articleCreate.onunload=function(){
	};
})();