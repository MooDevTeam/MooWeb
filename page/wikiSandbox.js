"use strict";
(function(){
	Page.item.wikiSandbox=new Page();
	Page.item.wikiSandbox.metroBlock=MetroBlock.item.wikiSandbox;
	Page.item.wikiSandbox.name='wikiSandbox';
	Page.item.wikiSandbox.onload=function(params){
		$('#pageTitle').text('Wiki演练场');
		$('#main')
			.append($('<div id="result"/>'))
			.append($('<form/>')
				.submit(function(){
					$('#btnSubmit').attr('disabled',true);
					var moo=new Moo();
					moo.restore=function(){
						$('#btnSubmit').attr('disabled',false);
					};
					moo.POST({
						URI: '/ParseWiki',
						data: {wiki:$('#txtInput').val()},
						success: function(data){
							$('#result').html(data);
							$('pre code').each(function(i,e){hljs.highlightBlock(e);});
							$('#btnSubmit').attr('disabled',false);
						}
					});
					return false;
				})
				.append('<div><textarea id="txtInput" cols="100" rows="30"/></div>')
				.append('<div><input id="btnSubmit" type="submit" value="显示效果"/></div>'));
	};
	Page.item.wikiSandbox.onunload=function(){
	};
})();