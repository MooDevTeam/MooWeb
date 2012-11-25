"use strict";
(function(){
	Page.item.wikiSandbox=new Page();
	Page.item.wikiSandbox.metroBlock=MetroBlock.item.help;
	Page.item.wikiSandbox.name='wikiSandbox';
	Page.item.wikiSandbox.onload=function(params){
		$('#pageTitle').text('Wiki演练场');
		
		$('#main')
			.append($('<div/>')
				.css({
					'display':'table',
					'width':'100%',
					'height':'100%'
				})
				.append($('<div/>')
					.css({
						'text-align':'center',
						'vertical-align':'middle',
						'display':'table-cell'
					})
					.append(new WikiEditor({
						placeholder:'在此输入内容，下方即显示最终效果。'
					}).html().css({
						'display':'inline-block',
						'text-align':'left'
					}))));
	};
	Page.item.wikiSandbox.onunload=function(){
	};
})();