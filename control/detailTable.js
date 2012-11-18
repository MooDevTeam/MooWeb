/**
	columns:[type:xxx,title:xxx,data:xxx]
*/
function DetailTable(params){
	var titleRow=$('<tr/>');
	var dataRow=$('<tr/>');
	
	params.columns.forEach(function(col){
		titleRow.append($('<th/>').text(col.title));
		switch(col.type){
			case 'text':
				dataRow.append($('<td/>').text(col.data));
				break;
			case 'html':
				dataRow.append($('<td/>').html(col.data));
				break;
			case 'number':
				dataRow.append($('<td/>').text(String(col.data)));
				break;
			case 'date':
				dataRow.append($('<td/>').text(col.data.toString()));
				break;
		}
	});
	
	this.table=$('<table class="detailTable"/>')
		.append($('<thead/>')
			.append(titleRow))
		.append($('<tbody/>')
			.append(dataRow));
}

DetailTable.prototype.html=function(){
	return this.table;
};