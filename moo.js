/**
	params:{
		URI: xxxx
		data: toSend
		success: function(data)
		unauthorized: function()return false?
		error: function(errObj)return false?
	}
	restore: function()
*/
function Moo(){
}

Moo.URL='http://localhost:52590';
Moo.JSON_API=Moo.URL+'/JsonAPI.svc';
Moo.WEBSOCKETS_API=Moo.URL.replace('http','ws')+'/WebSockets/WebSocketsAPI.ashx';

Moo.currentUser=null;

Moo.errorHandler=function(jqXHR,textStatus,errorThrown){
	if(this.restore && this.restore instanceof Function){
		this.restore();
	}
	switch(textStatus){
		case 'error':
			switch(jqXHR.status){
				case 401:
					Moo.whenUnauthorized.call(this,jqXHR,textStatus,errorThrown);
					break;
				case 500:
					Moo.whenServerError.call(this,jqXHR,textStatus,errorThrown);
					break;
				default:
					Moo.whenUnknown.call(this,jqXHR,textStatus,errorThrown);
					break;
			}
			break;
		case 'timeout':
			Moo.whenTimeout.all(this,jqXHR,textStatus,errorThrown);
			break;
		case 'abort':
			Moo.whenAbort.call(this,jqXHR,textStatus,errorThrown);
			break;
		case 'parsererror':
			Moo.whenParserError.call(this,jqXHR,textStatus,errorThrown);
			break;
		default:
			Moo.whenUnknown.call(this,jqXHR,textStatus,errorThrown);
	}
};

Moo.whenSuccess=function(data,textStatus,jqXHR){
	this.params.success(data);
}

Moo.whenUnauthorized=function(jqXHR,textStatus,errorThrown){
	if(this.params.unauthorized instanceof Function){
		var ret=this.params.unauthorized();
		if(ret===false)return;
	}
	if(Moo.currentUser){
		var msgBar=new MsgBar('warning',$('<div/>')
			.append('您的登录凭据失效，这可能是由于您的帐号被其他人非法登录所致。请问您是否需要')
			.append($('<a href="#">重新登录</a>')
				.click(function(){
					PopPage.item.login.load();
					msgBar.close();
					return false;
				}))
			.append('?'));
	}else{
		var msgBar= new MsgBar('warning',$('<div/>')
			.append('您尚未登录，无法执行此操作。请问您是否现在')
			.append($('<a href="#">登录</a>')
				.click(function(){
					PopPage.item.login.load();
					msgBar.close();
					return false;
				}))
			.append('?'));
	}
};

Moo.whenServerError=function(jqXHR,textStatus,errorThrown){
	var errorObject=$.parseJSON(jqXHR.responseText);
	if(this.params.error instanceof Function){
		var ret=this.params.error(errorObject);
		if(ret===false)return;
	}
	if(errorObject.Type=='UnauthorizedAccessException'){
		var msgBar=new MsgBar('warning',$('<div/>')
			.append('需要<b>'+errorObject.Message+'</b>权限，但目前您并不具备。需要')
			.append($('<a href="#">更换用户</a>')
				.click(function(){
					PopPage.item.login.load();
					msgBar.close();
					return false;
				}))
			.append('吗？'));
	}else{
		new MsgBar('error','服务器返回类型为<b>'+errorObject.Type+'</b>的异常，原因为<b>'+errorObject.Message+'</b>');
	}
};

Moo.whenUnknown=function(jqXHR,textStatus,errorThrown){
	new MsgBar('error','与服务器通信产生未知致命错误，HTTP状态码为<b>'+jqXHR.status+'</b>');
}

Moo.whenTimeout=function(jqXHR,textStatus,errorThrown){
	new MsgBar('warning','与服务器通信超时');
}

Moo.whenAbort=function(jqXHR,textStatus,errorThrown){
	new MsgBar('error','与服务器通信中断');
}

Moo.whenParserError=function(jqXHR,textStatus,errorThrown){
	new MsgBar('error','服务器返回了无法理解的信息');
}

Moo.prototype.GET=function(params){
	this.params=params;
	$.ajax({
		type: 'GET',
		url: Moo.JSON_API+params.URI,
		//cache: false,
		data: params.data,
		dataType: 'json',//Server To Me
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler
	});
};

Moo.prototype.POST=function(params){
	this.params=params;
	$.ajax({
		type: 'POST',
		url: Moo.JSON_API+params.URI,
		contentType: 'text/json',
		//cache: false,
		data: JSON.stringify(params.data),
		dataType: 'json',
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler
	});
};

Moo.prototype.PUT=function(params){
	this.params=params;
	$.ajax({
		type: 'PUT',
		url: Moo.JSON_API+params.URI,
		contentType: 'text/json',
		//cache: false,
		data: JSON.stringify(params.data),
		dataType: 'json',
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler
	});
};

Moo.prototype.DELETE=function(params){
	this.params=params;
	$.ajax({
		type: 'DELETE',
		url: Moo.JSON_API+params.URI,
		//cache: false,
		dataType: 'json',
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler
	});
};

Moo.prototype.sendBlob=function(params){
	this.params=params;
	
	var xhr=new XMLHttpRequest();
	if(params.progress instanceof Function)
		xhr.upload.addEventListener('progress',params.progress);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==XMLHttpRequest.DONE){
			params.success(xhr.response);
		}
	};
	
	xhr.open('post',Moo.URL+'/Blob.ashx',true);
	xhr.setRequestHeader('Content-Type','application/octet-stream');
	xhr.setRequestHeader('Content-Encoding','deflate');
	//xhr.send(new Blob([new Uint8Array(params.data)]));
	xhr.send(params.data);
};
/*
Moo.prototype.getBlob=function(params){
	this.params=params;
	
	var xhr=new XMLHttpRequest();
	if(params.progress instanceof Function)
		xhr.upload.addEventListener('progress',params.progress);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==XMLHttpRequest.DONE){
			console.log(xhr.response);
		}
	};
	
	xhr.open('get',Moo.URL+'/Blob.ashx?id='+params.id,true);
	xhr.responseType='arraybuffer';
	xhr.send();
};
*/