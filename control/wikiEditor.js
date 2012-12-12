"use strict";
/**
	id,
	placeholder,
	value
*/
function WikiEditor(params){
	var self=this;
	this.editor=$('<div class="wikiEditor"/>')
		.append($('<div class="wikiEditorToolBar"/>')
			.append($('<a href="#" tabIndex="-1" title="粗体">B</a>')
				.click(function(){
					self.warpText('*','Bold','*');
					self.textarea.trigger('input');
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="斜体" style="font-style: italic;">I</a>')
				.click(function(){
					self.warpText('_','Italic','_');
					self.textarea.trigger('input');
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="下划线" style="text-decoration: underline;">U</a>')
				.click(function(){
					self.warpText('+','Underline','+');
					self.textarea.trigger('input');
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="删除线" style="text-decoration: line-through;">S</a>')
				.click(function(){
					self.warpText('--','Strikethrough','--');
					self.textarea.trigger('input');
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="颜色" style="color: red;">A</a>')
				.click(function(){
					self.savedSelStart=self.textarea.selectionStart;
					self.savedSelEnd=self.textarea.selectionEnd;
					self.colorPicker.trigger('click');
					return false;
				}))
			.append(this.colorPicker=$('<input type="color" style="visibility: hidden; position: absolute;"/>')
				.change(function(){
					self.warpText('<color:'+$(this).val()+'>','Color','</color>',self.savedSelStart,self.savedSelEnd);
					self.textarea.trigger('input');
				}))
			.append('|')
			.append($('<a href="#" tabIndex="-1" title="上标">x<sup style="font-size: x-small;">2</sup></a>')
				.click(function(){
					self.warpText('^^','Superscript','^^');
					self.textarea.trigger('input');
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="下标">x<sub style="font-size: x-small;">2</sub></a>')
				.click(function(){
					self.warpText(',,','Subscript',',,');
					self.textarea.trigger('input');
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="数学公式">&Sigma;</a>')
				.click(function(){
					self.warpText('<math>','\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}','</math>');
					self.textarea.trigger('input');
					return false;
				}))
			.append('|')
			.append($('<a href="#" tabIndex="-1" title="源代码">#</a>')
				.click(function(){
					self.warpText('{code: c++}\n','#include <iostream>','\n{code: c++}');
					self.textarea.trigger('input');
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="图片">P</a>')
				.click(function(){
					if(!self.selectImage){
						var off=$(this).offset();
						off.top+=$(this).outerHeight(true);
						self.showSelectImage(off,self.textarea.selectionStart,self.textarea.selectionEnd);
					}
					return false;
				}))
			.append($('<a href="#" tabIndex="-1" title="更多Wiki格式">…</a>')
				.click(function(){
					//TODO Name it
					Page.item.wikixxx.load();
					return false;
				})))
		.append($('<div class="wikiEditorTextAreaWrapper"/>')
			.append(this.textarea=$('<textarea'
					+(params.id?' id="'+params.id+'"':'')
					+(params.placeholder?' placeholder="'+params.placeholder+'"':'')
					+' cols="0" rows="20"/>')
				.bind('input',this.autoPreview.bind(this))
				.val(params.value?params.value:'')
				.keydown(function(evt){
					if(evt.keyCode==9){//Tab
						var start = this.selectionStart;
						var end = this.selectionEnd;

						var $this = $(this);
						var value = $this.val();

						// set textarea value to: text before caret + tab + text after caret
						$this.val(value.substring(0, start)
									+ "\t"
									+ value.substring(end));

						// put caret at right position again (add one for the tab)
						this.selectionStart = this.selectionEnd = start + 1;

						// prevent the focus lose
						return false;
					}
				})))
		.append($('<div class="wikiEditorPreview"/>'));
}

WikiEditor.prototype.html=function(){
	return this.editor;
};

WikiEditor.prototype.val=function(text){
	if(text==undefined)
		return this.textarea.val();
	else{
		this.textarea.val(text);
		return this;
	}
};

WikiEditor.prototype.autoPreview=function(){
	var self=this;
	if(this.hAutoRefresh!==undefined)
		clearTimeout(this.hAutoRefresh);
	this.hAutoRefresh=setTimeout(function(){
		self.hAutoRefresh=undefined;
		
		new Moo().POST({
			URI: '/ParseWiki',
			data: {wiki: self.textarea.val()},
			success: function(data){
				$('.wikiEditorPreview',self.editor).html(data);
				$('.wikiEditorPreview pre code',self.editor).each(function(i,e){hljs.highlightBlock(e);});
			}
		});
	},2000);
};

WikiEditor.prototype.warpText=function(prefix,tip,suffix,selectionStart,selectionEnd){
	var selStart=this.textarea[0].selectionStart,
		selEnd=this.textarea[0].selectionEnd;
	if(selectionStart!==undefined)
		selStart=selectionStart;
	if(selectionEnd!==undefined)
		selEnd=selectionEnd;
		
	var textBefore=this.textarea.val().substring(0,selStart),
		textAfter=this.textarea.val().substring(selEnd),
		textSelected=this.textarea.val().substring(selStart,selEnd);
	
	if(selEnd-selStart==0){//Nothing
		this.textarea.val(textBefore+prefix+tip+suffix+textAfter);
		this.textarea[0].selectionStart=selStart+prefix.length;
		this.textarea[0].selectionEnd=selStart+prefix.length+tip.length;
	}else{
		this.textarea.val(textBefore+prefix+textSelected+suffix+textAfter);
		this.textarea[0].selectionStart=selStart;
		this.textarea[0].selectionEnd=selStart+prefix.length+textSelected.length+suffix.length;
	}
}

WikiEditor.prototype.showSelectImage=function(offset,selSt,selEd){
	var self=this;
	this.editor
		.append(this.selectImage=$('<form class="selectImage"/>')
			.submit(function(){
				var imageWiki='[image:'+self.selectImageID.val();
				if(self.selectImageWidth.val())
					imageWiki+=',width='+self.selectImageWidth.val();
				if(self.selectImageHeight.val())
					imageWiki+=',height='+self.selectImageHeight.val();
				imageWiki+=']';
				self.warpText(imageWiki,'','',selSt,selEd);
				
				self.selectImage.fadeOut(function(){$(this).remove();});
				delete self.selectImage;
				return false;
			})
			.append($('<a class="close" href="#">×</a>')
				.click(function(){
					self.selectImage.fadeOut(function(){$(this).remove();});
					delete self.selectImage;
					return false;
				}))
			.append($('<div/>')
				.append(this.selectImageID=new AutoInput({
					type: 'file',
					placeholder: '图片文件',
					required: true
				}).html()))
			.append($('<div/>')
				.append(this.selectImageWidth=$('<input type="number" placeholder="宽度(可选)"/>'))
				.append(this.selectImageHeight=$('<input type="number" placeholder="高度(可选)"/>')))
			.append($('<div/>')
				.append(this.selectImageSubmit=$('<input type="submit" value="插入图片"/>'))));
	this.selectImage.offset(offset);
	
};