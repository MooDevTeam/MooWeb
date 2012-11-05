"use strict";
function assert(condition){
	if(!condition){
		alert('Assertion Failed');
		throw new Error('Assertion Failed');
	}
}

$(function(){
	Layout.init();
	
	$('#loginLink')
		.click(function(){
			PopPage.item.login.load();
			return false;
		});
	
	$('#logoutLink')
		.click(function(){
			clearUserInfo();
			MsgBar.show('info','已登出');
			return false;
		});
	
	$('#homepage')
		.append('The Moo Online Judge long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long');
	
	MetroBlock.init();
	MsgBar.init();
	
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
			result.push(String(name) + '=' + String(x[name]));
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
				var value=keyValuePair.substring(index+1);
				result[URLDecode(key)]=URLDecode(value);
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