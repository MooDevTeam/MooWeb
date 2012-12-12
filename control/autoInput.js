"use strict";
/**
	id
	requried
	autofocus
	value
	placeholder
	type
*/
function AutoInput(params){
	var self=this;
	
	this.textBox=$('<input type="text"/>');
	
	if(params.id)
		this.textBox.attr('id',params.id);
	if(params.required)
		this.textBox.attr('required',true);
	if(params.autofocus)
		this.textBox.attr('autofocus',true);
	if(params.value)
		this.textBox.val(params.value);
	if(params.placeholder)
		this.textBox.attr('placeholder',params.placeholder);
	else
		this.textBox.attr('placeholder',AutoInput.types[params.type].name+'编号或名称');
	
	this.textBox.autocomplete({
		appendTo: $('#main'),
		source: function(request,response){
			AutoInput.types[params.type].nameContains(request.term,function(data){
				response(data.map(function(line){
					var regEx=new RegExp('('+$.ui.autocomplete.escapeRegex(htmlEncode(request.term))+')','gi');
					return {
						label: htmlEncode(line.name).replace(regEx,'<b>$1</b>'),
						text: line.name,
						value: line.id
					};
				}));
			});
		},
		change: function(evt,ui){
			if(ui.item){
				$(this).val(ui.item.value);
				this.setCustomValidity('');
			}else if(!$(this).val().match(/^\d*$/g)){
				var items=$('li',$(this).data('autocomplete').menu.element).map(function(){
					return $(this).data('item.autocomplete');
				}).each(function(){
					if(this.text==self.textBox.val()){
						self.textBox.val(this.value);
					}
				});
				if(!$(this).val().match(/^\d*$/g)){
					this.setCustomValidity('无此'+AutoInput.types[params.type].name+'，请尝试输入'+AutoInput.types[params.type].name+'编号');
				}else{
					this.setCustomValidity('');
				}
			}else{
				this.setCustomValidity('正在检查，请稍等');
				AutoInput.types[params.type].checkID(Number(self.textBox.val()),function(isOK){
					if(isOK){
						self.textBox[0].setCustomValidity('');
					}else{
						self.textBox[0].setCustomValidity(AutoInput.types[params.type].name+'编号无效');
					}
				});
			}
		},
	});
	
	this.textBox.data("autocomplete" )._renderItem = function( ul, item ) {
		return $( "<li>" )
			.data( "item.autocomplete", item )
			.append( "<a>" + item.label + "</a>" )
			.appendTo( ul );
	};
}

AutoInput.prototype.html=function(){
	return this.textBox;
};

AutoInput.prototype.val=function(){
	return this.textBox.val();
};

AutoInput.types={
	problem:{
		name: '题目',
		nameContains: function(text,callback){
			new Moo().GET({
				URI: '/Problems',
				data: {top:10,nameContains:text},
				success: function(data){
					callback(data.map(function(line){return {id:line.ID,name:line.Problem.Name};}));
				},
				error: callback.bind(null,[])
			});
		},
		checkID: function(id,callback){
			new Moo().GET({
				URI: '/Problems',
				data: {id:id},
				success: function(data){
					callback(data.length>0);
				}
			});
		}
	},
	tag:{
		name: '标签',
		nameContains: function(text,callback){
			new Moo().GET({
				URI: '/Tags',
				data: {top:10,nameContains:text},
				success: function(data){
					callback(data.map(function(line){return {id:line.ID,name:line.Name};}));
				},
				error: callback.bind(null,[])
			});
		},
		checkID: function(id,callback){
			new Moo().GET({
				URI: '/Tags',
				data: {id:id},
				success: function(data){
					callback(data.length>0);
				}
			});
		}
	},
	file:{
		name: '文件',
		nameContains: function(text,callback){
			new Moo().GET({
				URI: '/Files',
				data: {top:10,nameContains:text},
				success: function(data){
					callback(data.map(function(line){return {id:line.ID,name:line.File.Name};}));
				},
				error: callback.bind(null,[])
			});
		},
		checkID: function(id,callback){
			new Moo().GET({
				URI: '/Files',
				data: {id:id},
				success: function(data){
					callback(data.length>0);
				}
			});
		}
	},
};
