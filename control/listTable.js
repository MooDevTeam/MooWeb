/**
	columns: [{title:'Title',type:'html|text|number',field:'FieldName'}],
	dataPicker: function(start,callback)
		callback: function([{fieldName:xxxx}],bool haveMore)
	singleMenu: [{title:xxx,action:function(data)}]
	multipleMenu: [{title:xxx,action:function(datas)}]
*/
function ListTable(){
	this.itemNumber=0;
	this.loadOver=false;
	this.loading=false;
	this.rowMap={};
}

ListTable.prototype.showMore=function(callback){
	$('.showMore a',this.table).hide();
	$('.showMore progress',this.table).show();
	this.loading=true;
	this.dataPicker(this.itemNumber,this.addData.bind(this,callback));
};

ListTable.prototype.fillScreen=function(){
	if(!this.loadOver && this.table.parent().height()-this.table.outerHeight(true)>0){
		setTimeout(this.showMore.bind(this,this.fillScreen.bind(this)),500);
	}
}

ListTable.prototype.addData=function(callback,data,haveMore){
	var self=this;
	this.loading=false;
	if(haveMore){
		$('.showMore a',this.table).css('display','inline-block');
		$('.showMore progress',this.progress).hide();
	}else{
		$('.showMore',this.table).remove();
		this.loadOver=true;
	}
	
	data.forEach(function(dataRow){
		self.itemNumber++;
		var tableRow=$('<tr/>');
		self.bindRow(tableRow,dataRow);
		tableRow
			.click(self.onclick.bind(self,tableRow))
			.contextmenu(self.oncontextmenu.bind(self,tableRow))
			.data('ID',dataRow.ID);
		self.rowMap[dataRow.ID]=tableRow;
		$('tbody',self.table).append(tableRow.hide().fadeIn('slow'));
	});
	
	if(callback && callback instanceof Function){
		callback();
	}
};

ListTable.prototype.bindRow=function(row,data){
	var self=this;
	row.html('');
	this.columns.forEach(function(column){
		row.append(self.dataToTD(data[column.field],column.type));
	});
}

ListTable.prototype.dataToTD=function(data,type){
	switch(type){
		case 'html':
			return $('<td/>').html(data);
		case 'text':
			return $('<td/>').text(data);
		case 'date':
			return $('<td/>').text(data.toString());
		case 'link':
			return $('<td/>')
					.append($('<a href="#"/>')
						.click(function(){
							Page.item[data.href.page].load(data.href);
							return false;
						})
						.text(data.text));
		case 'number':
			return $('<td/>').text(data===null?'':String(data));
	}
};

ListTable.prototype.appendTo=function(dom){
	var self=this;
	//Column Titles
	var titleRow=$('<tr/>');
	this.columns.forEach(function(desc){
		titleRow.append($('<th/>').text(desc.title));
	});
	
	this.table=$('<table class="listTable"/>')
		.append($('<thead/>')
			.append(titleRow))
		.append($('<tbody/>'))
		.append($('<tfoot/>')
			.append($('<tr class="showMore"/>')
				.append($('<td/>')
					.attr('colspan',this.columns.length)
					.append($('<a href="#">Show More...</a>')
						.click(function(){
							self.showMore();
							return false;
						}))
					.append($('<progress/>')
						.hide()))));
	//Menu
	this.singleContextMenu=$('<ul class="menu"/>');
	this.singleMenu.forEach(function(menu){
		$('<li/>')
			.append($('<a href="#"/>')
				.text(menu.title)
				.click(function(){
					$(document).unbind('click',self.singleContextMenuHider);
					self.singleContextMenu.fadeOut('normal',function(){
						menu.action($('tbody > tr.selected',self.table).data('ID'));
					});
					return false;
				}))
			.appendTo(self.singleContextMenu);
	});
	
	this.multipleContextMenu=$('<ul class="menu"/>');
	this.multipleMenu.forEach(function(menu){
		$('<li/>')
			.append($('<a href="#"/>')
				.text(menu.title)
				.click(function(){
					$(document).unbind('click',self.multipleContextMenuHider);
					self.multipleContextMenu.fadeOut('normal',function(){
						var selected=$('tbody > tr.selected',self.table);
						var datas=[];
						for(var i=0;i<selected.length;i++){
							datas.push($(selected[i]).data('ID'));
						}
						menu.action(datas);
					});
					return false;
				}))
			.appendTo(self.multipleContextMenu);
	});
	
	dom.append($('<div class="listTableWrapper"/>')
		.scroll(function(){
			if(!self.loadOver && !self.loading){
				var leftHeight=self.table.outerHeight(true)-$(this).height()-$(this).scrollTop();
				if(leftHeight<0.2*$(this).height())
					self.showMore();
			}
			$('thead',self.table).css('top',$(this).scrollTop());
		})
		.append(this.singleContextMenu.hide())
		.append(this.multipleContextMenu.hide())
		.append(this.table));
	
	this.table.disableSelection();
};

ListTable.prototype.showSingleContextMenu=function(offset){
	this.singleContextMenu.show();
	this.singleContextMenu.offset(offset);
	this.singleContextMenu.hide().fadeIn();
	
	this.singleContextMenuHider=this.hideSingleContextMenu.bind(this);
	$(document).bind('click',this.singleContextMenuHider);
};

ListTable.prototype.hideSingleContextMenu=function(){
	$(document).unbind('click',this.singleContextMenuHider);
	this.singleContextMenu.fadeOut();
	return false;
};

ListTable.prototype.showMultipleContextMenu=function(offset){
	this.multipleContextMenu.show();
	this.multipleContextMenu.offset(offset);
	this.multipleContextMenu.hide().fadeIn();
	
	this.multipleContextMenuHider=this.hideMultipleContextMenu.bind(this);
	$(document).bind('click',this.multipleContextMenuHider);
};

ListTable.prototype.hideMultipleContextMenu=function(){
	$(document).unbind('click',this.multipleContextMenuHider);
	this.multipleContextMenu.fadeOut();
	return false;
};

ListTable.prototype.onclick=function(row,e){
	if(e.ctrlKey){
		row.toggleClass('selected');
	}else if(e.shiftKey){
		var allRow=$('tbody > tr',this.table);
		var allSelected=$('tbody > tr.selected',this.table);
		if(allSelected.length==0){
			row.addClass('selected');
		}else{
			var firstSelected=$('tbody > tr.selected:first',this.table);
			var lastSelected=$('tbody > tr.selected:last',this.table);
			var gt,lt;
			if(allRow.index(row) > allRow.index(firstSelected)){
				gt=allRow.index(firstSelected);
				lt=allRow.index(row);
			}else{
				gt=allRow.index(row);
				lt=allRow.index(lastSelected);
			}
			lt=lt-gt+1;
			gt=gt-1;
			
			var needSelect='tbody > tr';
			if(gt>=0)
				needSelect+=':gt('+gt+')';
			needSelect+=':lt('+lt+')';
			
			allRow.removeClass('selected');
			$(needSelect,this.table).addClass('selected');
		}
	}else{
		if(row.hasClass('selected')){
			if($('tbody > tr.selected',this.table).length==1){
				row.removeClass('selected');
			}else{
				$('tbody > tr',this.table).removeClass('selected');
				row.addClass('selected');
			}
		}else{
			$('tbody > tr',this.table).removeClass('selected');
			row.addClass('selected');
		}
	}
}

ListTable.prototype.oncontextmenu=function(row,e){
	if(!row.hasClass('selected')){
		$('tbody > tr',this.table).removeClass('selected');
		row.addClass('selected');
	}
	
	if($('tbody > tr.selected').length>1){
		this.showMultipleContextMenu({
			left: e.pageX+Math.min(0,$(window).width()-e.clientX-this.multipleContextMenu.outerWidth(true)),
			top: e.pageY+Math.min(0,$(window).height()-e.clientY-this.multipleContextMenu.outerHeight(true))
		});
	}else{
		this.showSingleContextMenu({
			left: e.pageX+Math.min(0,$(window).width()-e.clientX-this.singleContextMenu.outerWidth(true)),
			top: e.pageY+Math.min(0,$(window).height()-e.clientY-this.singleContextMenu.outerHeight(true))
		});
	}
	return false;
}