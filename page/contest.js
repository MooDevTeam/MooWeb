"use strict";
(function(){
	var params;
	
	Page.item.contest=new Page();
	Page.item.contest.name='contest';
	Page.item.contest.metroBlock=MetroBlock.item.contest;
	Page.item.contest.onload=function(_params){
		params=_params;
		
		new Moo().GET({
			URI: '/Contests/'+params.id,
			success: function(data){
				$('#pageTitle').text(data.Name);
				$('#main')
					.append(new DetailTable({
						columns:[
							{title:'状态',type:'html',data:data.Status=='Before'?'<span style="color:green;">尚未开始</span>'
													:data.Status=='During'?'<span style="color: red;">进行中</span>'
													:data.Status=='After'?'已结束':'??'},
							{title:'开始时间',type:'date',data:data.StartTime},
							{title:'结束时间',type:'date',data:data.EndTime},
							{title:'报名人数',type:'number',data:data.UserNumber}
						]
					}).html())
					.append($('<div id="divContent" style="margin: 10px;"/>')
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
	Page.item.contest.onunload=function(){
	};
})();