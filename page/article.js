"use strict";
(function(){
	var params;
	
	function modifyTitle(){
		Prompt.string({
			text: '请输入新的标题',
			value: $('#pageTitle').text(),
			success: function(newTitle){
				new Moo().PUT({
					URI: '/Articles/'+params.id,
					data: {article:{Name:newTitle}},
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
			text: '请输入文章内容',
			value: oldContent,
			success: function(newContent,reason){
				new Moo().POST({
					URI: '/Articles/'+params.id+'/Revisions',
					data: {revision:{
						Content: newContent,
						Reason: reason
					}},
					success: function(){
						//Show the lastest revision, so it's not refresh
						Page.item.article.load({id:params.id});
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
					URI: '/Articles/'+params.id+'/Tags',
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
			URI: '/Articles/'+params.id,
			data: params.revisionID===undefined?{}:{revisionID:params.revisionID},
			success: function(data){
				$('#pageTitle').text(data.Name);
				
				var tags=$('<div/>');
				data.Tag.forEach(function(tag){
					var tagDom;
					tag.onDelete=function(){
						if(confirm('确实要删除标签 '+tag.Name+' 吗')){
							new Moo().DELETE({
								URI: '/Articles/'+params.id+'/Tags/'+tag.ID,
								success: function(){
									tagDom.fadeOut(function(){$(this).remove();});
								}
							});
						}
						return false;
					};
					tag.page=Page.item.articleList;
					tags.append(tagDom=Link.tag(tag));
				});
				
				tags
					.append($('<a id="linkAddTag" title="添加标签" href="#"><img src="image/add.png" style="width: 20px; vertical-align: bottom;" alt="Add"/></a>')
						.click(addTag));
				
				$('#main')
					.append(new DetailTable({
						columns: [
									{title: '创建者',type:'html',data: Link.user(data.CreatedBy)},
									{title: '创建时间',type: 'date',data: data.CreateTime},
									{title: '最后编辑者',type: 'html',data: Link.user(data.Revision.CreatedBy)},
									{title: '更新时间',type: 'date',data: data.Revision.CreateTime},
									{title: '标签',type: 'html',data: tags},
									{title: '对应题目',type:'html',data: data.Problem.ID?Link.problem(data.Problem):'无'}
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
	
	Page.item.article=new Page();
	Page.item.article.metroBlock=MetroBlock.item.article;
	Page.item.article.name='article';
	Page.item.article.onload=function(_params){
		params=_params;
		
		$('#mainTopBarLeft')
			.after($('<a id="linkModifyTitle" href="#"><img src="image/pen.png" alt="Modify Title" style="width: 20px; vertical-align: bottom;" title="修改标题"/></a>')
				.click(modifyTitle));
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">版本历史</a>')
					.click(function(){
						Page.item.articleHistory.load({id:params.id});
						return false;
					})));
		load();
	};
	Page.item.article.onunload=function(){
		$('#linkModifyTitle').remove();
	};
})();