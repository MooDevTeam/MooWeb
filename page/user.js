"use strict";
(function(){
	var params;
	
	function modifyName(oldName){
		Prompt.string({
			text: '请输入新的名称',
			value: oldName,
			success: function(newName){
				new Moo().PUT({
					URI: '/Users/'+params.id,
					data: {user:{
						Name: newName
					}},
					success: function(){
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	function modifyRole(oldRole){
		Prompt.select({
			text: '请选择新的角色',
			options: [
				{text: '组织者',value: 'Organizer'},
				{text: '工作者',value: 'Worker'},
				{text: '普通用户',value: 'NormalUser'},
				{text: '浏览者',value: 'Reader'}
			],
			value: oldRole,
			success: function(newRole){
				new Moo().PUT({
					URI: '/Users/'+params.id,
					data: {user:{
						Role: newRole
					}},
					success: function(){
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	function modifyEmail(oldEmail){
		Prompt.email({
			text: '请输入新的Email',
			value: oldEmail,
			success: function(newEmail){
				new Moo().PUT({
					URI: '/Users/'+params.id,
					data: {user:{
						Email: newEmail
					}},
					success: function(){
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	function modifyBriefDescription(oldDesc){
		Prompt.string({
			text: '请输入新的简述',
			value: oldDesc,
			success: function(newDesc){
				new Moo().PUT({
					URI: '/Users/'+params.id,
					data: {user:{
						BriefDescription: newDesc
					}},
					success: function(){
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	Page.item.user=new Page();
	Page.item.user.name='user';
	Page.item.user.metroBlock=MetroBlock.item.user;
	Page.item.user.onload=function(_params){
		params=_params;
		$('#mainTopBarLeft')
			.after('<a id="linkModifyName" href="#"><img src="image/pen.png" alt="" style="width: 20px; vertical-align: bottom;"/></a>');
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">修改密码</a>')
					.click(function(){
						Page.item.userModifyPassword.load({id:params.id});
						return false;
					})));
		
		new Moo().GET({
			URI: '/Users/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name);
				$('#linkModifyName').click(modifyName.bind(null,data.Name));
				
				$('#main')
					.append(new DetailTable({
						columns: [
							{title:'注册时间',type:'date',data:data.CreateTime},
							{title:'角色',type:'html',data:$('<div/>')
								.text({
									Organizer: '组织者',
									Worker: '工作者',
									NormalUser: '普通用户',
									Reader: '浏览者'
								}[data.Role])
								.append($('<a href="#"><img src="image/pen.png" alt="Modify" style="width: 20px; vertical-align: bottom;"/></a>')
									.click(modifyRole.bind(null,data.Role)))},
							{title:'Email',type:'html',data:$('<div/>')
								.text(data.Email)
								.append($('<a href="#"><img src="image/pen.png" alt="Modify Email" style="width: 20px; vertical-align: bottom;"/></a>')
									.click(modifyEmail.bind(null,data.Email)))},
							//{title:'分数',type:'number',data:data.Score},
							{title:'开始聊天',type:'html',data:$('<a href="#">开始聊天</a>')
								.click(function(){
									Message.item.main.load({id:data.ID});
									return false;
								})},
							{title:'简述',type:'html',data:$('<div/>')
								.text(data.BriefDescription)
								.append($('<a href="#"><img src="image/pen.png" alt="Modify" style="width: 20px; vertical-align: bottom;"/></a>').click(modifyBriefDescription.bind(null,data.BriefDescription)))}
						]
					}).html())
					.append($('<img alt="" style="float: right; margin: 10px;"/>')
						.attr('src',Gravatar.get(data.Email,120)))
					.append($('<div id="divContent"/>')
						.css('margin','10px')
						.text(data.Description));
				new Moo().POST({
					URI: '/ParseWiki',
					data: {wiki:data.Description},
					success: function(data){
						$('#divContent').html(data);
						$('pre code').each(function(i,e){hljs.highlightBlock(e);});
					}
				});
			}
		});
	};
	Page.item.user.onunload=function(){
		$('#linkModifyName').remove();
	};
})();