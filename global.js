"use strict";
function assert(condition){
	if(!condition){
		alert('Assertion Failed');
		throw new Error('Assertion Failed');
	}
}

$(function(){
	Layout.init();
	MetroBlock.init();
	MsgBar.init();
	
	//TODO Debugging
	if(!Config.debug)
	$(document).bind('keydown',function(e) {
		if(e.which === 116 || e.which === 82 && e.ctrlKey) {//F5 || Ctrl-R
			if(Page.currentPage){
				Page.refresh();
				return false;
			}else
				return true;
		}
	});
	
	refreshUserInfo(function(){
		if(Moo.currentUser){ //Success
			var queryString={};
			if(window.location.search.length>1)
				queryString=parseURL(window.location.search.substring(1));
			
			if(queryString.page){
				Page.item[queryString.page].load(queryString);
			}else{
				Homepage.onload();
				$('#homepage').hide().fadeIn('slow');
			}
		}else{
			MsgBar.show('warning',$('<div/>')
				.append('您只有在登录后，才能使用Moo。需要现在')
				.append($('<a href="#">登录</a>')
					.click(function(){
						$('.close',$(this).parent().parent()).click();
						PopPage.item.login.load();
						return false;
					}))
				.append('吗？'));
			Homepage.onload();
			$('#homepage').hide().fadeIn('slow');
		}
	});
});

function refreshUserInfo(callback){
	var moo=new Moo();
	moo.restore=function(){
		if(callback instanceof Function)
			callback();
		clearUserInfo();
	};
	
	if(localStorage.mooToken || sessionStorage.mooToken){
		moo.GET({
			URI: '/CurrentUser',
			noMessage: true,
			success: function(userID){
				$('#loggedIn').show();
				$('#notLoggedIn').hide();
				moo.GET({
					URI: '/Users/'+userID,
					success: function(user){
						Moo.currentUser=user;
						$('#loggedUserName').text(user.Name);
						if(callback instanceof Function){
							callback();
						}
					}
				});
			},
		});
	}else{
		clearUserInfo();
		if(callback instanceof Function){
			callback();
		}
	}
}

function clearUserInfo(){
	localStorage.removeItem('mooToken');
	sessionStorage.removeItem('mooToken');
	$('#loggedIn').hide();
	$('#notLoggedIn').show();
	Moo.currentUser=null;
}

function URLEncode(x){
	if(typeof x=='string'){
		return encodeURIComponent(x);
	}else if(typeof x=='object'){
		var result=[];
		for(var name in x){
			var value=x[name];
			if(typeof value=='number' || typeof value=='string'){
				value=String(value);
			}else{
				value=JSON.stringify(value)
			}
			result.push(URLEncode(String(name)) + '=' + URLEncode(value));
		}
		return result.join('&');
	}else
		return '';
}

function parseURL(arg){
	var result={};
	arg.split('&').forEach(
		function(keyValuePair){
			var index=keyValuePair.indexOf('=');
			if(index!=-1){
				var key=keyValuePair.substring(0,index);
				var value=URLDecode(keyValuePair.substring(index+1));
				if(!isNaN(Number(value))){
					value=Number(value);
				}else if(value[0]=='{' && value[value.length-1]=='}' || value[0]=='[' && value[value.length-1]==']'){
					value=$.parseJSON(value,true);
				}
				result[URLDecode(key)]=value;
			}
		}
	);
	return result;
}

function URLDecode(str){
	return decodeURIComponent(str.replace('+','%20'));
}

Date.prototype.toString=function(){
	return this.getFullYear()+'-'+(this.getMonth()+1)+'-'+this.getDate()+' '+this.getHours()+':'+this.getMinutes()+':'+this.getSeconds();
};