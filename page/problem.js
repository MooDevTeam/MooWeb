"use strict";
(function(){
	var params;
	
	function modifyTitle(){
		$('#btnModifyTitle').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){
			$('#btnModifyTitle').attr('disabled',false);
			$('#modifyTitle').hide();
			$('#mainTopBarLeft').show();
			$('#linkModifyTitle').show();
		};
		moo.PUT({
			URI: '/Problems/'+params.id,
			data: {problem:{Name:$('#txtTitle').val()}},
			success: function(){
				$('#pageTitle').text($('#txtTitle').val());
				moo.restore();
			}
		});
		return false;
	}
	
	function modifyContent(){
		$('#btnModifyContent').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){
			$('#btnModifyContent').attr('disabled',false);
			$('#modifyContent').hide();
			$('#content').show();
		};
		moo.POST({
			URI: '/Problems/'+params.id+'/Revisions',
			data: {revision:{
				Content: $('#txtContent').val(),
				Reason: $('#txtReason').val()
			}},
			success: function(){
				//Show the lastest revision, so it's not refresh
				Page.item.problem.load({id:params.id});
			}
		});
		return false;
	}
	
	function load(){
		var moo=new Moo();
		moo.GET({
			URI: '/Problems/'+params.id,
			data: params.revisionID===undefined?{}:{revisionID:params.revisionID},
			success: function(data){
				$('#pageTitle').text(data.ID+'.'+data.Name);
				$('#txtTitle').val(data.Name);
				$('#txtContent').text(data.Content);
				
				moo.POST({
					URI: '/ParseWiki',
					data: {wiki:data.Content},
					success: function(data){
						$('#content').append(data);
						$('pre code').each(function(i,e){hljs.highlightBlock(e);});
					}
				});
			}
		});
	}
	
	Page.item.problem=new Page();
	Page.item.problem.metroBlock=MetroBlock.item.problem;
	Page.item.problem.name='problem';
	Page.item.problem.onload=function(_params){
		params=_params;
		
		$('#mainTopBarLeft')
			.after($('<a id="linkModifyTitle" href="#"><img src="image/pen.png" alt="Modify Title" style="width: 20px;" title="修改标题"/></a>')
				.click(function(){
					$('#mainTopBarLeft').hide();
					$('#linkModifyTitle').hide();
					$('#modifyTitle').css('display','inline-block');
					return false;
				}))
			.after($('<form id="modifyTitle"/>')
				.css({
					'display':'none',
					'margin-left':'10px'
				})
				.submit(modifyTitle)
				.append('<input id="txtTitle" type="text" class="small" required="required"/>')
				.append('<input id="btnModifyTitle" type="submit" value="修改" class="small"/>')
				.append($('<a href="#">取消</a>')
					.click(function(){
						$('#modifyTitle').hide();
						$('#mainTopBarLeft').show();
						$('#linkModifyTitle').show();
						return false;
					})));
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">提交</a>')
					.click(function(){
						PopPage.item.submit.load({id:params.id});
						return false;
					})))
			.append($('<li/>')
				.append($('<a href="#">版本历史</a>')
					.click(function(){
						Page.item.problemHistory.load({id:params.id});
						return false;
					})))
			.append($('<li/>')
				.append($('<a href="#">选项</a>')
					.click(function(){
						Page.item.problemOption.load({id:params.id});
						return false;
					})))
			.append('<li><hr/></li>')
			.append($('<li/>')
				.append($('<a href="#">测试数据</a>')
					.click(function(){
						Page.item.testCaseList.load({id:params.id});
						return false;
					})))
			.append($('<li/>')
				.append($('<a href="#">相关记录</a>')
					.click(function(){
						Page.item.recordList.load({problemID:params.id});
						return false;
					})))
			.append($('<li/>')
				.append($('<a href="#">相关文章</a>')
					.click(function(){
						Page.item.articleList.load({problemID:params.id});
						return false;
					})))
			.append($('<li/>')
				.append($('<a href="#">相关帖子</a>')
					.click(function(){
						Page.item.postList.load({problemID:params.id});
						return false;
					})));
		
		$('#main')
			.append($('<div id="content"/>')
				.css('margin','10px')
				.append($('<a href="#" style="float: right;"><img src="image/pen.png" alt="Modify Content" title="修改内容"/></a>')
					.click(function(){
						$('#modifyContent').show();
						$('#content').hide();
						return false;
					})))
			.append($('<form id="modifyContent"/>')
				.css('padding','10px')
				.hide()
				.submit(modifyContent)
				.append(new WikiEditor({
						id:'txtContent',
						placeholder:'内容'
					}).html())
				.append($('<div/>')
					.append($('<input id="txtReason" type="text" placeholder="修改理由" required="required"/>')
						.css('width','80%')))
				.append($('<div/>')
					.append('<input id="btnModifyContent" type="submit" value="修改"/>')
					.append($('<a href="#">取消</a>')
						.click(function(){
							$('#modifyContent').hide();
							$('#content').show();
							return false;
						}))));
		load();
	};
	Page.item.problem.onunload=function(){
		$('#modifyTitle,#linkModifyTitle').remove();
	};
})();