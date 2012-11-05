"use strict";
(function(){
	Page.item.problem=new Page();
	Page.item.problem.metroBlock=MetroBlock.item.problem;
	Page.item.problem.name='problem';
	Page.item.problem.onload=function(params){
		var moo=new Moo();
		moo.GET({
			URI: '/Problems/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name);
				$('#main')
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
	};
	Page.item.problem.onunload=function(){
	};
})();