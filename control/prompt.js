"use strict";

(function(){
	var params;
	PopPage.item.prompt=new PopPage();
	PopPage.item.prompt.onload=function(_params){
		params=_params;
		
		if(!params.normalWindow){
			$('#popBox')
				.css({
					width: '40%',
					height: '40%',
					left: '30%',
					top: '30%'
				});
			PopPage.cssTrick();
		}
		
		//$('#windowTitle').text('请输入');
		$('#windowMain')
			.append($('<div/>')
				.append($('<div/>').html(params.text))
				.append(params.form));
	};
	PopPage.item.prompt.onunload=function(){
		if(params.cancel instanceof Function)
			params.cancel();
	};
})();

var Prompt={};

Prompt.problem=function(params){
	var input=new AutoInput({
			required: true,
			autofocus: true,
			type: 'problem'
		});
	
	params.form=$('<form/>')
		.submit(function(){
			params.success(Number(input.val()));
			PopPage.currentPage.unload();
			return false;
		})
		.append(input.html())
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.tag=function(params){
	var input=new AutoInput({
			required: true,
			autofocus: true,
			type: 'tag'
		});
	
	params.form=$('<form/>')
		.submit(function(){
			params.success(Number(input.val()));
			PopPage.currentPage.unload();
			return false;
		})
		.append(input.html())
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.date=function(params){
	var input=$('<input type="datetime" required="required" pattern="\\d{4}-\\d{1,2}-\\d{1,2} \\d{1,2}:\\d{1,2}:\\d{1,2}" title="YYYY-MM-DD HH:mm:ss" autofocus="autofocus" placeholder="YYYY-MM-DD HH:mm:ss"/>');
	
	params.form=$('<form/>')
		.submit(function(){
			var date=input.val();
			if(!(date instanceof Date))
				date=new Date(date);
			params.success(date);
			PopPage.currentPage.unload();
			return false;
		})
		.append(input)
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.string=function(params){
	var input=$('<input type="text" required="true" autofocus="autofocus"/>');
	
	if(params.value)
		input.val(params.value);
	params.form=$('<form/>')
		.submit(function(){
			params.success(input.val());
			PopPage.currentPage.unload();
			return false;
		})
		.append(input)
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.text=function(params){
	var input=new WikiEditor({
		placeholder: params.text,
		value: params.value
	});
	
	params.text='';
	params.normalWindow=true;
	params.form=$('<form/>')
		.submit(function(){
			params.success(input.val());
			PopPage.currentPage.unload();
			return false;
		})
		.append(input.html())
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.textWithReason=function(params){
	var text=new WikiEditor({
		placeholder: params.text,
		value: params.value
	});
	var reason=$('<input type="text" style="width:80%;" required="required" placeholder="修改理由"/>');
	
	params.text='';
	params.normalWindow=true;
	params.form=$('<form/>')
		.submit(function(){
			params.success(text.val(),reason.val());
			PopPage.currentPage.unload();
			return false;
		})
		.append(text.html())
		.append($('<div/>')
			.append(reason))
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.number=function(params){
	var input=$('<input type="number" required="true" autofocus="autofocus"/>');
	
	if(params.min!==undefined)
		input.attr('min',params.min);
	if(params.max)
		input.attr('max',params.max);
	if(params.value)
		input.val(params.value);
	params.form=$('<form/>')
		.submit(function(){
			params.success(Number(input.val()));
			PopPage.currentPage.unload();
			return false;
		})
		.append(input)
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.email=function(params){
	var input=$('<input type="email" required="true" autofocus="autofocus"/>');
	
	if(params.value)
		input.val(params.value);
	params.form=$('<form/>')
		.submit(function(){
			params.success(input.val());
			PopPage.currentPage.unload();
			return false;
		})
		.append(input)
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};

Prompt.select=function(params){
	var input=$('<select/>');
	
	params.options.forEach(function(option){
		console.log(option);
		input.append($('<option/>')
			.text(option.text)
			.val(option.value));
	});
	
	if(params.value)
		input.val(params.value);
	params.form=$('<form/>')
		.submit(function(){
			params.success(input.val());
			PopPage.currentPage.unload();
			return false;
		})
		.append(input)
		.append($('<div style="text-align: center;"/>')
			.append('<input type="submit" value="确定"/>')
			.append(' ')
			.append($('<input type="button" value="取消"/>')
				.click(function(){
					PopPage.currentPage.unload();
				})));
	PopPage.item.prompt.load(params);
};