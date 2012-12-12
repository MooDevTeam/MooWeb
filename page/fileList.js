"use strict";
(function(){
	var listTable,params;
	
	function translate(line){
		return {
			ID: line.ID,
			File: Link.file(line.File),
			CreatedBy: Link.user(line.CreatedBy),
			dblclick: function(){
				Page.item.file.load({id:line.ID});
			}
		};
	}
	
	function dataPicker(start,callback){
		var moo=new Moo();
		moo.restore=callback.bind(null,[],false);
		
		var query={skip:start,top:Config.itemNumberEachTime};
		
		moo.GET({
			URI: '/Files',
			data: query,
			success: function(data){
				data=data.map(translate);
				callback(data,data.length==Config.itemNumberEachTime);
			}
		});
	}
	
	function deleteFile(id){
		var moo=new Moo();
		moo.DELETE({
			URI: '/Files/'+id,
			success: function(){
				listTable.rowMap[id].fadeOut('slow',function(){$(this).remove();});
			}
		});
	}
	
	Page.item.fileList=new Page();
	Page.item.fileList.name='fileList';
	Page.item.fileList.onload=function(_params){
		params=_params;
		$('#pageTitle').text('文件列表');
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">上传新文件</a>')
					.click(function(){
						Page.item.fileCreate.load();
						return false;
					})));
		
		listTable=new ListTable({
			columns: [
				{title:'文件编号',type:'number',field:'ID'},
				{title:'名称',type:'html',field:'File'},
				{title:'创建者',type:'html',field:'CreatedBy'},
			],
			dataPicker: dataPicker,
			singleMenu: [
				{title:'查看',action:function(id){Page.item.file.load({'id':id})}},
				{title:'删除',action:function(id){
					if(confirm('确实要删除'+id+'号文件吗'))
						deleteFile(id);
				}},
			],
			multipleMenu: [
				{title:'删除',action:function(ids){
					if(confirm('确实要删除'+ids.length+'份文件吗')){
						for(var i=0;i<ids.length;i++)
							deleteFile(ids[i]);
					}
				}},
			]
		});
		
		$('#main').append(listTable.html());
		listTable.fillScreen();
	};
	Page.item.fileList.onunload=function(){
	};
	Page.item.fileList.metroBlock=MetroBlock.item.file;
})();