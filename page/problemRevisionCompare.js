"use strict";
(function(){
	var params;

	Page.item.problemRevisionCompare=new Page();
	Page.item.problemRevisionCompare.name='problemRevisionCompare';
	Page.item.problemRevisionCompare.metroBlock=MetroBlock.item.problem;
	Page.item.problemRevisionCompare.onload=function(_params){
		params=_params;
		
		if(params.revisionID[0]>params.revisionID[1]){
			var tmp=params.revisionID[1];
			params.revisionID[1]=params.revisionID[0];
			params.revisionID[0]=tmp;
		}
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回题目</a>')
					.click(function(){
						Page.item.problem.load({id:params.problemID});
						return false;
					})))
			.append($('<li/>')
				.append($('<a href="#">返回版本历史</a>')
					.click(function(){
						Page.item.problemHistory.load({id:params.problemID});
						return false;
					})));
		
		new Moo().GET({
			URI: '/Problems',
			data: {id:params.problemID},
			success: function(data){
				$('#pageTitle').text(data[0].Problem.Name+'的版本比较');
			}
		});
		
		var revisions=[];
		[0,1].forEach(function(index){
			new Moo().GET({
				URI: '/Problems/'+params.problemID,
				data: {revisionID: params.revisionID[index]},
				success: function(data){
					revisions[index]=data;
					if(revisions[0]!==undefined && revisions[1]!=undefined){
						var patchTool=new diff_match_patch();
						var diffFirstLine='--- '+data.Name+'/'+params.revisionID[0];
						var diffSecondLine='+++ '+data.Name+'/'+params.revisionID[1];
						var align=Math.max(diffFirstLine.length,diffSecondLine.length)+4;
						while(diffFirstLine.length<align)
							diffFirstLine+=' ';
						while(diffSecondLine.length<align)
							diffSecondLine+=' ';
						var diffText=diffFirstLine+revisions[0].Revision.CreateTime+'\n'
									+diffSecondLine+revisions[1].Revision.CreateTime+'\n'
									+patchTool.patch_toText(patchTool.patch_make(revisions[0].Content,revisions[1].Content));
						
						$('#main')
							.append($('<pre/>')
								.append($('<code class="diff"/>')
									.text(diffText)));
						$('pre code').each(function(i,e){hljs.highlightBlock(e);});
					}
				}
			});
		});
	};
	Page.item.problemRevisionCompare.onunload=function(){
	};
})();