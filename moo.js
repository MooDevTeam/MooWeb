/**
	params:{
		URI: xxxx
		data: toSend
		noMessage: bool
		success: function(data)
		unauthorized: function()
		error: function(errObj)
	}
	restore: function()
*/
function Moo(){
}

Moo.API_URL='http://localhost:52590/JsonAPI.svc';

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
	try{
		this.params.success(data);
	}catch(e){
		if(this.restore && this.restore instanceof Function){
			this.restore();
		}
		throw e;
	}
}

Moo.whenUnauthorized=function(jqXHR,textStatus,errorThrown){
	if(!this.params.noMessage){
		MsgBar.show('warning',$('<div/>')
			.append('您尚未登录或登录凭据失效，是否需要')
			.append($('<a href="#">重新登录</a>')
				.click(function(){
					PopPage.item.login.load();
					$('.close',$(this).parent().parent()).click();
					return false;
				}))
			.append('?'));
	}
	if(this.params.unauthorized && this.params.unauthorized instanceof Function){
		this.params.unauthorized();
	}
};

Moo.whenServerError=function(jqXHR,textStatus,errorThrown){
	var errorObject=$.parseJSON(jqXHR.responseText);
	if(!this.params.noMessage){
		if(errorObject.Type=='UnauthorizedAccessException'){
			MsgBar.show('warning',$('<div/>')
				.append('需要<b>'+errorObject.Message+'</b>权限，但目前您并不具备。需要')
				.append($('<a href="#">更换用户</a>')
					.click(function(){
						PopPage.item.login.load();
						$('.close',$(this).parent().parent()).click();
						return false;
					}))
				.append('吗？'));
		}else{
			MsgBar.show('error','服务器返回类型为<b>'+errorObject.Type+'</b>的异常，原因为<b>'+errorObject.Message+'</b>');
		}
	}
	if(this.params.error && this.params.error instanceof Function){
		this.params.error(errorObject);
	}
};

Moo.whenUnknown=function(jqXHR,textStatus,errorThrown){
	if(!this.params.noMessage){
		MsgBar.show('error','与服务器通信产生未知致命错误，HTTP状态码为<b>'+jqXHR.status+'</b>');
	}
}

Moo.whenTimeout=function(jqXHR,textStatus,errorThrown){
	if(!this.params.noMessage){
		MsgBar.show('warning','与服务器通信超时');
	}
}

Moo.whenAbort=function(jqXHR,textStatus,errorThrown){
	if(!this.params.noMessage){
		MsgBar.show('error','与服务器通信中断');
	}
}

Moo.whenParserError=function(jqXHR,textStatus,errorThrown){
	if(!this.params.noMessage){
		MsgBar.show('error','服务器返回了无法理解的信息');
	}
}

Moo.prototype.GET=function(params){
	this.params=params;
	$.ajax({
		type: 'GET',
		url: Moo.API_URL+params.URI,
		cache: false,
		data: params.data,
		dataType: 'json',
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler,
	});
};

Moo.prototype.POST=function(params){
	this.params=params;
	$.ajax({
		type: 'POST',
		url: Moo.API_URL+params.URI,
		contentType: 'text/json',
		cache: false,
		data: JSON.stringify(params.data),
		dataType: 'json',
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler,
	});
};

Moo.prototype.PUT=function(params){
	this.params=params;
	$.ajax({
		type: 'PUT',
		url: Moo.API_URL+params.URI,
		contentType: 'text/json',
		cache: false,
		data: JSON.stringify(params.data),
		dataType: 'json',
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler,
	});
};

Moo.prototype.DELETE=function(params){
	this.params=params;
	$.ajax({
		type: 'DELETE',
		url: Moo.API_URL+params.URI,
		cache: false,
		dataType: 'json',
		headers: { 'Auth': localStorage.mooToken || sessionStorage.mooToken },
		context: this,
		success: Moo.whenSuccess,
		error: Moo.errorHandler,
	});
}