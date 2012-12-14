"use strict";
var ServerConn={};

ServerConn.sock=undefined;
ServerConn.tryLogin=function(forceLogin){
	var url=Moo.WEBSOCKETS_API+'?Auth='+(localStorage.mooToken || sessionStorage.mooToken);
	if(forceLogin)
		url+='&forceLogin=true';
	var sock=new WebSocket(url);
	sock.onmessage=ServerConn.onmessage;
	sock.onerror=ServerConn.onerror;
	sock.onclose=ServerConn.onclose;
	sock.onopen=ServerConn.onopen;
	
	ServerConn.sock=sock;
};

ServerConn.logout=function(){
	if(ServerConn.sock)
		ServerConn.sock.send(JSON.stringify({
			type: 'Logout'
		}));
};

ServerConn.onopen=function(){
	console.log('WebSocket Open');
};

ServerConn.onerror=function(e){
	console.log('WebSocket Error');
	console.log(e);
};

ServerConn.onclose=function(){
	console.log('WebSocket Close');
	Message.setOffline();
	ServerConn.sock=null;
};

ServerConn.onmessage=function(e){
	var data=$.parseJSON(e.data);
	
	console.log('WebSocket Message');
	console.log(data);
	
	switch(data.type){
		case 'Login':
			if(data.ID==Moo.currentUser.ID){
				Message.setOnline();
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
					    ServerConn.tryLogin(true);
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
					    ServerConn.tryLogin(true);
					    msgBar.close();
						return false;
					}))
				.append('吗？'));
			break;
		case 'NewMessage':
			if(Message.current==Message.item.main && Message.current.withWho()===data.ID){//Right on the page
				Message.current.refresh();
			}else{//Let's notify him
				var avatar=data.ID===null?Gravatar.nobody(40):Gravatar.get(data.Email,40);
				var name=data.ID===null?'公共版聊':data.Name;
				MsgBox.add($('<span/>')
					.append($('<img alt="" style="vertical-align:middle;"/>')
						.attr('src',avatar))
					.append($('<span/>').text(name)),function(){
						Message.item.main.load({id:data.ID});
					},'MessageFrom'+data.ID);
			}
			break;
		case 'TestComplete':
			if(Page.currentPage==Page.item.record && Page.currentPage.getID()==data.ID){
				Page.refresh();
			}else{
				MsgBox.add('您的第<b>'+data.ID+'</b>号记录评测完毕',{page:'record',id:data.ID},'TestComplete'+data.ID);
			}
			break;
		default:
			console.log('未知的消息类型');
			console.log(data);
			break;
	}
};