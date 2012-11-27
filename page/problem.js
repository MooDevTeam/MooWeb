"use strict";
(function(){
	var params;
	
	function modifyTitle(){
		Prompt.string({
			text: '请输入新的标题',
			value: $('#pageTitle').text(),
			success: function(newTitle){
				new Moo().PUT({
					URI: '/Problems/'+params.id,
					data: {problem:{Name:newTitle}},
					success: function(){
						$('#pageTitle').text(newTitle);
					}
				});
			}
		});
		return false;
	}
	
	function modifyContent(oldContent){
		Prompt.textWithReason({
			text: '请输入题目内容',
			value: oldContent,
			success: function(newContent,reason){
				new Moo().POST({
					URI: '/Problems/'+params.id+'/Revisions',
					data: {revision:{
						Content: newContent,
						Reason: reason
					}},
					success: function(){
						//Show the lastest revision, so it's not refresh
						Page.item.problem.load({id:params.id});
					}
				});
			}
		});
		return false;
	}
	
	function addTag(){
		Prompt.tag({
			text:'请输入新标签',
			success: function(id){
				new Moo().POST({
					URI: '/Problems/'+params.id+'/Tags',
					data: {tagID:id},
					success: function(){
						Page.refresh();
					}
				});
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
				$('#pageTitle').text(data.Name);
				
				var tags=$('<div/>');
				data.Tag.forEach(function(tag){
					var tagDom;
					tag.onDelete=function(){
						if(confirm('确实要删除标签 '+tag.Name+' 吗')){
							new Moo().DELETE({
								URI: '/Problems/'+params.id+'/Tags/'+tag.ID,
								success: function(){
									tagDom.fadeOut(function(){$(this).remove();});
								}
							});
						}
						return false;
					};
					tag.page=Page.item.problemList;
					tags.append(tagDom=Link.tag(tag));
				});
				
				tags
					.append($('<a id="linkAddTag" title="添加标签" href="#"><img src="image/add.png" style="width: 20px; vertical-align: bottom;" alt="Add"/></a>')
						.click(addTag));
				
				$('#main')
					.append(new DetailTable({
						columns: [
							{title: '类型',type:'text',data:{
								'Traditional':'传统',
								'SpecialJudged':'自定义测评',
								'Interactive':'交互式',
								'AnswerOnly':'提交答案'
							}[data.Type]},
							{title: '创建者',type:'html',data: Link.user(data.CreatedBy)},
							{title: '创建时间',type: 'date',data: data.CreateTime},
							{title: '最后编辑者',type: 'html',data: Link.user(data.Revision.CreatedBy)},
							{title: '更新时间',type: 'date',data: data.Revision.CreateTime},
							{title: '标签',type: 'html',data: tags}
						]
					}).html())
					.append($('<a href="#" style="float: right;"><img src="image/pen.png" alt="Modify Content" title="修改内容"/></a>')
							.click(modifyContent.bind(null,data.Content)))
					.append($('<div id="content"/>')
						.css('margin','10px')
						.text(data.Content));
				
				moo.POST({
					URI: '/ParseWiki',
					data: {wiki:data.Content},
					success: function(data){
						$('#content').html(data);
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
			.after($('<a id="linkModifyTitle" href="#"><img src="image/pen.png" alt="Modify Title" style="width: 20px; vertical-align: bottom;" title="修改标题"/></a>')
				.click(modifyTitle));
		
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
		
		
		load();
	};
	Page.item.problem.onunload=function(){
		$('#linkModifyTitle').remove();
	};
})();