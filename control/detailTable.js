function DetailTable(){
}

DetailTable.prototype.getHTML=function(){
	var titleRow=$('<tr/>');
	var dataRow=$('<tr/>');
	
	this.columns.forEach(function(col){
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
	
	return $('<table class="detailTable"/>')
		.append($('<thead/>')
			.append(titleRow))
		.append($('<tbody/>')
			.append(dataRow));
};