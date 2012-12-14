"use strict";
var MsgBox={};

MsgBox.mode='hidden';

MsgBox.msgs={};

MsgBox.show=function(){
	if(MsgBox.mode!='hidden')return;
	MsgBox.mode=undefined;
	$('#hideMsgBox').show();
	$('#showMsgBox').hide();
	$('#msgBox').removeClass('hidden','normal',function(){
		$('#msgBoxList').slideDown();
		MsgBox.mode='normal';
	});
};

MsgBox.hide=function(){
	if(MsgBox.mode!='normal')return;
	MsgBox.mode=undefined;
	$('#msgBoxList').slideUp(function(){
		$('#hideMsgBox').hide();
		$('#showMsgBox').show();
		$('#msgBox').addClass('hidden','normal');
		MsgBox.mode='hidden';
	});
};

MsgBox.add=function(text,href,uniqueID){
	if(uniqueID===undefined)
		uniqueID=Math.random();
	if(MsgBox.mode=='hidden')
		MsgBox.show();
	
	if(Object.keys(MsgBox.msgs).length==0){
		$('#msgBoxEmpty').slideUp();
	}
	
	if(uniqueID in MsgBox.msgs){
		MsgBox.msgs[uniqueID].number++;
		if(MsgBox.msgs[uniqueID].number==2){
			MsgBox.msgs[uniqueID].link
				.append(MsgBox.msgs[uniqueID].msgNumber=$('<span class="number"/>'));
		}
		MsgBox.msgs[uniqueID].msgNumber.text(String(MsgBox.msgs[uniqueID].number));
	}else{
		MsgBox.msgs[uniqueID]={};
		MsgBox.msgs[uniqueID].number=1;
		$('#msgBoxList')
			.append(MsgBox.msgs[uniqueID].htmlLi=$('<li/>')
				.append(MsgBox.msgs[uniqueID].link=$('<a href="#"/>')
					.html(text)
					.click(function(){
						if(href instanceof Function){
							href();
						}else{
							Page.item[href.page].load(href);
						}
						MsgBox.hide();
						MsgBox.remove(uniqueID);
						return false;
					})));
		MsgBox.msgs[uniqueID].htmlLi.hide().slideDown();
	}
};

MsgBox.setNumber=function(uniqueID,newNumber){
	if(MsgBox.msgs[uniqueID].number==newNumber)return;
	
	MsgBox.msgs[uniqueID].number=newNumber;
	if(MsgBox.msgs[uniqueID].number>1 && !MsgBox.msgs[uniqueID].msgNumber){
		MsgBox.msgs[uniqueID].link
			.append(MsgBox.msgs[uniqueID].msgNumber=$('<span class="number"/>'));
		MsgBox.msgs[uniqueID].msgNumber.text(String(MsgBox.msgs[uniqueID].number));
	}else if(newNumber==1 && MsgBox.msgs[uniqueID].msgNumber){
		MsgBox.msgs[uniqueID].msgNumber.remove();
		delete MsgBox.msgs[uniqueID].msgNumber;
	}
};

MsgBox.contains=function(uniqueID){
	return uniqueID in MsgBox.msgs;
};

MsgBox.remove=function(uniqueID){
	MsgBox.msgs[uniqueID].htmlLi.slideUp(function(){$(this).remove();});
	delete MsgBox.msgs[uniqueID];
	if(Object.keys(MsgBox.msgs).length==0){
		MsgBox.hide();
		$('#msgBoxEmpty').slideDown();
	}
};