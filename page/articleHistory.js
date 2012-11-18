"use strict";
(function(){
	var listTable,params;
	
	function translate(line){
		return {
			ID: line.ID,
			CreateTime: line.CreateTime,
			CreatedBy: Link.user(line.CreatedBy),
			Reason: line.Reason
		};
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		moo.GET({
			URI: '/Articles/'+params.id+'/Revisions',
			data: {skip:start,top:Config.itemNumberEachTime},
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			},
		});
	}
	
	function deleteRevision(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Articles/'+params.id+'/Revisions/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	Page.item.articleHistory=new Page();
	Page.item.articleHistory.name='articleHistory';
	Page.item.articleHistory.onload=function(_params){
		params=_params;
		
		new Moo().GET({
			URI: '/Articles',
			data: {id:params.id},
			success: function(data){
				$('#pageTitle').text(data[0].Article.Name+'的版本历史');
			}
		});
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回文章</a>')
					.click(function(){
						Page.item.article.load({id:params.id});
						return false;
					})));
		
		listTable=new ListTable();
		listTable.columns=
			[
				{title:'版本编号',type:'number',field:'ID'},
				{title:'创建时间',type:'date',field:'CreateTime'},
				{title:'创建者',type:'html',field:'CreatedBy'},
				{title:'修改原因',type:'text',field:'Reason'}
			];
		listTable.dataPicker=dataPicker;
		listTable.singleMenu=
			[
				{title:'查看',action:function(id){Page.item.article.load({'id':params.id,'revisionID':id})}},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号版本吗'))
						deleteRevision(id);
				}},
			];
		listTable.multipleMenu=
			[
				{title:'比较',action:function(ids){
					if(ids.length!=2){
						MsgBar.show('warning','请选择恰好两个版本');
						return;
					}
					Page.item.articleRevisionCompare.load({articleID:params.id,revisionID:ids});
				}},
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'个版本吗')){
						for(var i=0;i<ids.length;i++)
							deleteRevision(ids[i]);
					}
				}},
			];
		listTable.appendTo($('#main'));
		listTable.fillScreen();
	};
	Page.item.articleHistory.onunload=function(){
	};
	Page.item.articleHistory.metroBlock=MetroBlock.item.article;
})();