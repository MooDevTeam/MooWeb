/**
	columns: [{title:'Title',type:'html|text|number',field:'FieldName'}],
	dataPicker: function(start,callback)
		callback: function([{fieldName:xxxx}],bool haveMore)
	singleMenu: [{title:xxx,action:function(data)}]
	multipleMenu: [{title:xxx,action:function(datas)}]
*/
function ListTable(params){
	var self=this;
	this.itemNumber=0;
	this.loadOver=false;
	this.loading=false;
	this.rowMap={};
	
	this.dataPicker=params.dataPicker;
	this.columns=params.columns;
	
	//Column Titles
	var titleRow=$('<tr/>');
	params.columns.forEach(function(desc){
		titleRow.append($('<th/>').text(desc.title));
	});
	
	this.table=$('<table class="listTable"/>')
		.append($('<thead/>')
			.append(titleRow))
		.append($('<tbody/>'))
		.append($('<tfoot/>')
			.append($('<tr class="notAny"/>')
				.hide()
				.append($('<td/>')
					.attr('colspan',params.columns.length)
					.text('这里没东西，别看了，洗洗睡吧。')))
			.append($('<tr class="showMore"/>')
				.append($('<td/>')
					.attr('colspan',params.columns.length)
					.append($('<a href="#">Show More...</a>')
						.click(function(){
							self.showMore();
							return false;
						}))
					.append($('<progress/>')
						.hide()))));
	//Menu
	if(params.singleMenu)
		this.singleMenu=this.buildMenu(params.singleMenu);
	if(params.multipleMenu)
		this.multipleMenu=this.buildMenu(params.multipleMenu);
	if(params.doubleMenu)
		this.doubleMenu=this.buildMenu(params.doubleMenu);
	
	this.wrapper=$('<div class="listTableWrapper"/>')
		.disableSelection()
		.scroll(function(){
			if(!self.loadOver && !self.loading){
				var leftHeight=self.table.outerHeight(true)-$(this).height()-$(this).scrollTop();
				if(leftHeight<0.2*$(this).height())
					self.showMore();
			}
			$('thead',self.table).css('top',$(this).scrollTop());
		})
		.append(this.singleMenu)
		.append(this.multipleMenu)
		.append(this.doubleMenu)
		.append(this.table);
}

ListTable.prototype.buildMenu=function(menus){
	var self=this;
	var htmlMenu=$('<ul class="menu"/>').hide();
	
	function show(e){
		htmlMenu.show();
		htmlMenu.offset({
			left: e.pageX+Math.min(0,$(window).width()-e.clientX-htmlMenu.outerWidth(true)),
			top: e.pageY+Math.min(0,$(window).height()-e.clientY-htmlMenu.outerHeight(true))
		});
		htmlMenu.hide().fadeIn();
		
		$(document).bind('click',hide);
	}
	
	htmlMenu.data('show',show);
	
	function hide(){
		$(document).unbind('click',hide);
		htmlMenu.fadeOut();
		return false;
	}
	
	menus.forEach(function(menu){
		htmlMenu
			.append($('<li/>')
				.append($('<a href="#"/>')
					.text(menu.title)
					.click(function(){
						$(document).unbind('click',hide);
						htmlMenu.fadeOut('normal',function(){
							var selected=$('tbody > tr.selected',self.table);
							var datas=selected.map(function(){return $(this).data('ID');}).get();
							menu.action(datas);
						});
						return false;
					})));
	});
	
	return htmlMenu;
};

ListTable.prototype.html=function(){
	return this.wrapper;
};

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
		if($('tbody > tr',this.table).length+data.length==0){
			$('.notAny',this.table).show();
		}
	}
	
	data.forEach(function(dataRow){
		self.itemNumber++;
		var tableRow=$('<tr/>');
		self.bindRow(tableRow,dataRow);
		tableRow
			.click(self.onclick.bind(self,tableRow))
			.contextmenu(self.oncontextmenu.bind(self,tableRow))
			.dblclick(function(){
				if($(this).data('dblclick') instanceof Function)
					$(this).data('dblclick')();
			})
			.data('ID',dataRow.ID)
			.data('dblclick',dataRow.dblclick);
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
	
	if($('tbody > tr.selected').length==1){
		if(this.singleMenu)
			this.singleMenu.data('show')(e);
	}else if($('tbody > tr.selected').length==2){
		if(this.doubleMenu)
			this.doubleMenu.data('show')(e);
		else if(this.multipleMenu)
			this.multipleMenu.data('show')(e);
	}else if(this.multipleMenu)
		this.multipleMenu.data('show')(e);
	return false;
}