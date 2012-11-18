"use strict";
(function(){
	PopPage.item.submit=new PopPage();
	PopPage.item.submit.onload=function(params){
		$('#windowTitle').text('提交代码');
		$('#windowMain')
			.append($('<form/>')
				.css({
					'display':'inline-block',
					'text-align':'left'
				})
				.submit(function(){
					$('#btnSubmit').attr('disabled',true);
					var moo=new Moo();
					moo.restore=function(){
						$('#btnSubmit').attr('disabled',false);
					};
					moo.POST({
						URI: '/Records',
						data: {record: {
							Problem: params.id,
							Language: $('#selLanguage').val(),
							Code: $('#txtCode').val(),
							PublicCode: $('#chkPublicCode').attr('checked')=='checked'
						}},
						success: function(data){
							if(PopPage.currentPage)
								PopPage.currentPage.unload();
							Page.item.record.load({id:data});
						}
					});
					return false;
				})
				.append('<div><textarea id="txtCode" cols="70" rows="20" autofocus="autofocus"/></div>')
				.append($('<div/>')
					.append('<input id="chkPublicCode" type="checkbox" checked="true"/><label for="chkPublicCode">公开我的源码</label>')
					.append($('<select id="selLanguage"/>')
						.append('<option value="c++">C++</option>')
						.append('<option value="c">C</option>')
						.append('<option value="pascal">Pascal</option>')
						.append('<option value="java">Java</option>'))
					.append($('<input id="fileSourceCode" type="file"/>')
						.change(function(){
							var files=$('#fileSourceCode')[0].files;
							if(files.length>0){
								var reader=new FileReader();
								reader.onload=function(){
									$('#txtCode').val(reader.result);
								};
								reader.readAsText(files[0]);
								var extName=files[0].name.replace(/.*\.(.*?)/,'$1');
								var language={
									'cpp':'cpp',
									'c':'c',
									'cxx':'cpp',
									'cc':'cpp',
									'java':'java',
									'pas':'pascal'
								}[extName.toLowerCase()];
								if(language){
									$('#selLanguage').val(language);
								}
							}
						})))
				.append('<div><input id="btnSubmit" type="submit" value="提交"/>'));
	};
	PopPage.item.submit.onunload=function(){
	};
})();