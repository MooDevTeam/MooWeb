"use strict";
(function(){
	Page.item.record=new Page();
	Page.item.record.name='record';
	Page.item.record.metroBlock=MetroBlock.item.record;
	Page.item.record.onload=function(params){
		$('#pageTitle').text('第'+params.id+'号记录');
		
		var moo=new Moo();
		moo.GET({
			URI: '/Records/'+params.id,
			success: function(data){
				var columns=[
					{title:'题目',type:'html',data:Link.problem(data.Problem)},
					{title:'用户',type:'html',data:Link.user(data.User)},
					{title:'提交时间',type:'date',data:data.CreateTime},
					{title:'语言',type:'text',data:
						{
							'c++':'C++',
							'c':'C',
							'java':'Java',
							'pascal':'Pascal',
							'plaintext':'N/A'
						}[data.Language] || data.Language},
					{title:'代码长度',type:'number',data:data.CodeLength},
					{title:'评测状态',type:'text',data:data.Score===null?'尚未评测':data.Score==-1?'正在评测':'已评测'},
					{title:'源码可见性',type:'text',data:data.PublicCode?'公开':'私有'}
				];
				if(data.Score!==null && data.Score>=0)
					columns.push({title:'分数',type:'number',data:data.Score});
				
				$('#main')
					.append(new DetailTable({'columns':columns}).html())
					.append($('<div id="area"/>')
						.css({
							margin: '10px'
						}));
				if(data.Code!==null){
					var langForSH={
						'c++':'cpp',
						'c':'c',
						'java':'java',
						'pascal':'delphi'
					}[data.Language] || 'plain';
					$('#area')
						.append($('<pre/>')
							.append($('<code class="language-'+langForSH+'"/>').text(data.Code)));
					$('pre code').each(function(i,e){hljs.highlightBlock(e);});
				}
				if(data.JudgeInfo!=null){
					$('#area')
						.append($('<div id="judgeInfo"/>').text(data.JudgeInfo));
					moo.POST({
						URI: '/ParseWiki',
						data: {wiki:data.JudgeInfo},
						success: function(data){
							$('#judgeInfo').html(data);
							$('pre code').each(function(i,e){hljs.highlightBlock(e);});
						}
					});
				}
			}
		});
	};
	Page.item.record.onunload=function(){
	};
})();