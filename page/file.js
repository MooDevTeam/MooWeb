"use strict";
(function(){
	var params;
	
	function modifyName(){
		Prompt.string({
			text: '请输入新名称',
			value: $('#pageTitle').text(),
			success: function(newName){
				new Moo().PUT({
					URI: '/Files/'+params.id,
					data: {file:{
						Name: newName
					}},
					success: function(){
						$('#pageTitle').text(newName);
					}
				});
			}
		});
		return false;
	}
	
	function modifyDescription(oldDesc){
		Prompt.text({
			text: '请输入新描述',
			value: oldDesc,
			success: function(newDesc){
				new Moo().PUT({
					URI: '/Files/'+params.id,
					data: {file:{
						Description: newDesc
					}},
					success: function(){
						new MsgBar('info','修改描述成功');
						Page.refresh();
					}
				});
			}
		});
		return false;
	}
	
	Page.item.file=new Page();
	Page.item.file.name='file';
	Page.item.file.metroBlock=MetroBlock.item.file;
	Page.item.file.onload=function(_params){
		params=_params;
		
		$('#mainTopBarLeft')
			.after($('<a id="linkModifyName" href="#"><img src="image/pen.png" alt="Modify Name" style="width:20px; vertical-align: bottom;"/></a>')
				.click(modifyName));
		
		new Moo().GET({
			URI: '/Files/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name);
				
				$('#main')
					.append(new DetailTable({
						columns:[
							{title:'创建者',type:'html',data: Link.user(data.CreatedBy)},
							{title:'文件大小(bytes)',type:'number',data: data.Length},
							{title:'下载文件',type:'html',data: $('<a>下载此文件</a>')
								.attr('href',Moo.URL+'/file/'+data.ID)
								.click(function(){
									$('#main')
										.append($('<iframe style="display:none;"/>')
											.attr('src',Moo.URL+'/file/'+data.ID));
									return false;
								})}
						]
					}).html())
					.append($('<a href="#" style="float:right;"><img src="image/pen.png" alt="Modify Description"/></a>')
						.click(modifyDescription.bind(null,data.Description)))
					.append($('<div id="content"/>')
						.css('padding','10px'));
				new Moo().POST({
					URI: '/ParseWiki',
					data: {wiki:data.Description},
					success: function(data){
						$('#content').html(data);
						$('pre code').each(function(i,e){hljs.highlightBlock(e);});
					}
				});
				
				switch(data.Extension.toLowerCase()){
					case '.jpg':
					case '.png':
					case '.bmp':
					case '.tiff':
					case '.svg':
					case '.gif':
					case '.wmf':
						$('#main')
							.append($('<img alt="Preview" style="margin:auto; display:block;"/>')
								.attr('src',Moo.URL+'/file/'+data.ID));
						break;
				}
			}
		});
	};
	Page.item.file.onunload=function(){
		$('#linkModifyName').remove();
	};
})();