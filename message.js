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

Message.sock;
Message.tryLogin=function(forceLogin){
	var sock;
	sock=Moo.newWebSocket(forceLogin);
	sock.onmessage=Message.onmessage;
	sock.onerror=Message.onerror;
	sock.onclose=Message.onclose;
	sock.onopen=Message.onopen;
	
	Message.sock=sock;
};

Message.logout=function(){
	if(Message.sock)
		Message.sock.send(JSON.stringify({
			type: 'Logout'
		}));
};

Message.onopen=function(){
	console.log('WebSocket Open');
};

Message.onerror=function(e){
	console.log('WebSocket Error');
	console.log(e);
};

Message.onclose=function(){
	console.log('WebSocket Close');
	$('#messagePanel').removeClass('online').addClass('offline');
	Message.sock=null;
};

Message.onmessage=function(e){
	var data=$.parseJSON(e.data);
	
	console.log('WebSocket Message');
	console.log(data);
	
	switch(data.type){
		case 'Login':
			if(data.ID==Moo.currentUser.ID){
				$('#messagePanel').removeClass('offline').addClass('online');
				Message.item.list.load();
			}
			break;
		case 'Kicked':
			new MsgBar('warning','由于某种原因，您被迫退出实时聊天');
			refreshUserInfo();
			break;
		case 'NotAuthenticated':
			new MsgBar('warning','登陆凭据不正确，无法登陆实时聊天');
			break;
		case 'AnotherLogin':
			var msgBar=new MsgBar('warning',$('<div/>')
				.append('您的实时聊天已在别处登陆，目前您已被迫下线。需要')
				.append($('<a href="#">重新登录</a>')
					.click(function(){
					    Message.tryLogin(true);
					    msgBar.close();
						return false;
					}))
				.append('吗？'));
			break;
		case 'AlreadyLogin':
			var msgBar=new MsgBar('warning',$('<div/>')
				.append('由于您已经在别处登陆了实时聊天，目前无法重复登陆。需要')
				.append($('<a href="#">强制登陆</a>')
					.click(function(){
					    Message.tryLogin(true);
					    msgBar.close();
						return false;
					}))
				.append('吗？'));
			break;
		case 'NewMessage':
			Message.notifyNewMessage(data.ID);
			break;
	}
};

Message.notifyNewMessage=function(id){
	if(Message.current==Message.item.list)
		Message.item.list.load();
	Message.startNotify(id);
};

Message.hNotify=null;
Message.notifyList={};
Message.startNotify=function(id){
	Message.notifyList[id]=true;
	if(Message.hNotify===null){
		Message.hNotify=setInterval(Message.singleNotify,1500);
	}
};

Message.stopNotify=function(id){
	delete Message.notifyList[id];
	if(Object.keys(Message.notifyList).length==0){
		clearInterval(Message.hNotify);
		Message.hNotify=null;
	}
};

Message.singleNotify=function(){
	if(Layout.messagePanelMode=='hidden'){
		$('#messagePanel').addClass('newMessage','normal',function(){
			$(this).removeClass('newMessage');
		});
	}else if(Message.current==Message.item.main){
		if(Message.item.main.withWho() in  Message.notifyList){
			Message.item.main.refresh();
			Message.stopNotify(Message.item.main.withWho());
			return;
		}
		$('#backToMsgList img').effect('highlight');
	}else if(Message.current==Message.item.list){
		for(var id in Message.notifyList){
			Message.item.list.getLiMap()[id].effect('highlight');
		}
	}
	
	var oldTitle=document.title;
	document.title='~~新消息~~';
	setTimeout(function(){
		document.title=oldTitle;
	},1000);
};