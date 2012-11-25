"use strict";
function AutoInput(params){
	var self=this;
	this.uniqueID=Math.random();
	
	this.container=$('<div class="autoInput"/>')
		.append(this.dataList=$('<datalist id="lst'+this.uniqueID+'"/>'))
		.append(this.textBox=$('<input type="text"/>')
			.attr('id',params.id?params.id:'txt'+this.uniqueID)
			.attr('required',params.required?true:false)
			.addClass(params['class']?params['class']:'')
			.val(params.value?params.value:'')
			.attr('list','lst'+this.uniqueID)
			.attr('placeholder',params.placeholder===undefined?AutoInput.types[params.type].name+'编号或名称':params.placeholder));
	
	this.textBox.bind('input',function(){
		AutoInput.types[params.type].startWith.call(self,$(this).val());
	});
	
	this.textBox.change(function(){
		if(!$(this).val().match(/^\d*$/g)){
			$('option',self.dataList).each(function(){
				if($(this).val()==self.textBox.val()){
					self.textBox.val($(this).attr('label'));
				}
			});
			if(!$(this).val().match(/^\d*$/g)){
				this.setCustomValidity('无此'+AutoInput.types[params.type].name+'，请尝试输入'+AutoInput.types[params.type].name+'编号');
			}else{
				this.setCustomValidity('');
			}
		}else{
			this.setCustomValidity('');
		}
	});
	AutoInput.types[params.type].startWith.call(this,'');
}

AutoInput.types={
	problem:{
		name: '题目',
		startWith: function(prefix){
			var self=this;
			new Moo().GET({
				URI: '/Problems',
				data: {top:10,nameStartWith:prefix},
				success: function(data){
					self.dataList.html('');
					data.forEach(function(line){
						self.dataList.append($('<option/>').val(line.Problem.Name).attr('label',line.ID));
					});
				}
			});
		}
	},
	tag:{
		name: '标签',
		startWith: function(prefix){
			var self=this;
			new Moo().GET({
				URI: '/Tags',
				data: {top:10,nameStartWith:prefix},
				success: function(data){
					self.dataList.html('');
					data.forEach(function(line){
						self.dataList.append($('<option/>').val(line.Name).attr('label',line.ID));
					});
				}
			});
		}
	}
};

AutoInput.prototype.html=function(){
	return this.container;
};