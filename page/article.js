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
			URI: '/Articles/'+params.id,
			data: {article:{Name:$('#txtTitle').val()}},
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
			URI: '/Articles/'+params.id+'/Revisions',
			data: {revision:{
				Content: $('#txtContent').val(),
				Reason: $('#txtReason').val()
			}},
			success: function(){
				//Show the lastest revision, so it's not refresh
				Page.item.article.load({id:params.id});
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
				$('#txtTitle').val(data.Name);
				$('#txtContent').text(data.Content);
				
				var tags=$('<div/>');
				data.Tag.forEach(function(tag){
					var tagDom;
					tag.onDelete=function(){
						if(confirm('确实要删除标签 '+tag.Name+' 吗')){
							new Moo().DELETE({
								URI: '/Articles/'+params.id+'/Tags/'+tag.ID,
								success: function(){
									tagDom.fadeOut(function(){
										$(this).remove();
									});
								}
							});
						}
						return false;
					};
					tags.append(tagDom=Link.tag(tag));
				});
				tags
					.append($('<a id="linkAddTag" title="添加标签" href="#"/>')
						.click(function(){
							$('#linkAddTag').hide();
							$('#frmAddTag').show();
							return false;
						})
						.append($('<img src="image/add.png" alt="Add"/>')
							.css({
								'width': '30px',
								'vertical-align': 'bottom'
							})))
					.append($('<form id="frmAddTag"/>')
						.hide()
						.submit(function(){
							$('#btnAddTag').attr('disabled',true);
							var moo=new Moo();
							moo.restore=function(){
								$('#btnAddTag').attr('disabled',false);
							};
							moo.POST({
								URI: '/Articles/'+params.id+'/Tags',
								data: {tagID:Number($('#txtTagID').val())},
								success: function(){
									Page.refresh();
								}
							});
							return false;
						})
						.append(new AutoInput({
							id: 'txtTagID',
							type: 'tag',
							'class': 'small'
						}).html())
						.append('<input id="btnAddTag" type="submit" class="small" value="添加"/>')
						.append($('<a id="linkCancelAddTag" href="#">取消</a>')
							.click(function(){
								$('#frmAddTag').hide();
								$('#linkAddTag').show();
								return false;
							})));
				
				$('#main')
					.prepend(new DetailTable({
						columns: [
									{title: '创建时间',type: 'date',data: data.CreateTime},
									{title: '更新时间',type: 'date',data: data.Revision.CreateTime},
									{title: '最后编辑者',type: 'html',data: Link.user(data.Revision.CreatedBy)},
									{title: '标签',type: 'html',data: tags},
									{title: '对应题目',type:'html',data: data.Problem.ID?Link.problem(data.Problem):'无'}
								]
					}).html());
				
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
	
	Page.item.article=new Page();
	Page.item.article.metroBlock=MetroBlock.item.article;
	Page.item.article.name='article';
	Page.item.article.onload=function(_params){
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
				.append($('<a href="#">版本历史</a>')
					.click(function(){
						Page.item.articleHistory.load({id:params.id});
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
	Page.item.article.onunload=function(){
		$('#modifyTitle,#linkModifyTitle').remove();
	};
})();