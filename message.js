"use strict";
function Message(){}
Message.loading=false;
Message.current=null;
Message.item={};

Message.prototype.load=function(params){
	var self=this;
	
	if(Message.loading)return;
	Message.loading=true;
	
	if(Message.current){
		if(Layout.messagePanelMode=='hidden'){
			Layout.showMessagePanel(function(){
				$('#msgMain').fadeOut(function(){
					Message.current.unload();
					self.doLoad(params);
				});
			});
		}else{
			$('#msgMain').fadeOut(function(){
				Message.current.unload();
				self.doLoad(params);
			});
		}
	}else{
		self.doLoad(params);
	}
};

Message.prototype.doLoad=function(params){
	Message.current=this;
	
	this.onload(params);
	$('#msgMain').fadeIn();
	Message.loading=false;
};

Message.prototype.unload=function(){
	this.onunload();
	$('#msgMain').html('');
	$('#msgTitle').html('');
};

Message.onlineStatus='offline';

Message.setOnline=function(){
	if(Message.onlineStatus=='online')return;
	Message.onlineStatus='online';
	$('#messagePanel').removeClass('offline').addClass('online');
	Message.item.list.load();
};

Message.setOffline=function(){
	if(Message.onlineStatus=='offline')return;
	Message.onlineStatus='offline';
	$('#messagePanel').removeClass('online').addClass('offline');
};
