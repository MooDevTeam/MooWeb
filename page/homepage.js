"use strict";
var Homepage={};
(function(){
	Homepage.onload=function(){
		$.get('resources/homepage.txt',function(data){
			var innerDiv;
			$('#homepage')
				.html(innerDiv=$('<div/>')
					.css({
						'padding':'10px',
						'margin-bottom':'10px',
						'background':'rgba(255,255,255,0.8)'
					}));
			new Moo().POST({
				URI: '/ParseWiki',
				data: {wiki: data},
				success: function(data){
					innerDiv.html(data);
					$('#homepage pre code').each(function(i,e){hljs.highlightBlock(e);});
				}
			});
		});
	};
	Homepage.onunload=function(){
		$('#homepage').html('');
	};
})();