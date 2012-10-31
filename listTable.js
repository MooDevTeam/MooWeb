function ListTable(columns,dataPicker){
	var itemNumber=0;
	
	//Column Titles
	var titleRow=$('<tr/>');
	columns.forEach(function(desc){
		titleRow.append($('<th/>').text(desc.title));
	});
	
	//Show More
	var showMoreLink=$('<a href="#">Show More...</a>')
		.click(function(){
			$(this).hide();
			$('progress',showMore).show();
			dataPicker(itemNumber,function(data,haveMore){
				if(haveMore){
					$('a',showMore).css('display','inline-block');
				}else{
					$(showMore).hide();
				}
				$('progress',showMore).hide();
				
				data.forEach(function(row){
					itemNumber++;
					var tableRow=$('<tr/>');
					columns.forEach(function(column){
						if(column.type=='html')
							tableRow.append($('<td/>').html(row[column.field]));
						else if(column.type=='text')
							tableRow.append($('<td/>').text(row[column.field]));
						else if(column.type=='number')
							tableRow.append($('<td/>').text(String(row[column.field])));
					});
					$('tbody',table).append(tableRow.hide().fadeIn('slow'));
				});
			});
			
			return false;
		});
	var showMoreProgress=$('<progress/>');
	var showMore=$('<tr class="showMore"/>')
		.append($('<td/>')
			.attr('colspan',columns.length)
			.append(showMoreLink)
			.append(showMoreProgress));
	
	var table=$('<table class="listTable"/>')
		.append($('<thead/>')
			.append(titleRow))
		.append($('<tbody/>'))
		.append($('<tfoot/>')
			.append(showMore));
	
	showMoreLink.click();
	return table;
}