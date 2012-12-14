"use strict";
function assert(condition){
	if(!condition){
		alert('Assertion Failed');
		throw new Error('Assertion Failed');
	}
}

$(function(){
	if(Navigator.tooOld()){
		$.get('resources/fallback.txt',function(data){
			$('body').html(data);
		});
		return;
	}
	
	Layout.init();
	MetroBlock.init();
	MsgBar.init();
	Page.recentHash=location.hash;
	
	new Moo().GET({
		URI: '/PublicKey?format=hex',
		success: function(data){
			Moo.publicKey=data;
		}
	});
	
	//TODO Debugging
	//if(!Config.debug)
	$(document).bind('keydown',function(e) {
		if(e.which === 116 || e.which === 82 && e.ctrlKey) {//F5 || Ctrl-R
			if(Page.currentPage){
				Page.refresh();
				return false;
			}else
				return true;
		}
	});
	/*
	$('#sidePanel')
		.append($('<a href="#">Debug</a>')
			.click(function(){
				Page.item.debug.load();
				return false;
			}));
	
	*/
	
	refreshUserInfo(function(){
		if(Moo.currentUser){ //Success
		
			var queryString={};
			if(window.location.hash.length>2)
				queryString=parseURL(window.location.hash.substring(2));
			
			if(queryString.page){
				Page.item[queryString.page].load(queryString);
			}else{
				Homepage.onload();
				$('#homepage').hide().fadeIn('slow');
				
				if(Math.random()<0.5){
					$.get('resources/tip.txt',function(data){
						var tips=data.split(/\r\n?|\n/g);
						var tip=tips[Math.floor(Math.random() * tips.length + 1)-1];
						new MsgBar('tip','<b>你知道吗？</b>'+tip);
					});
				}
			}
		}else{
			var msgBar=new MsgBar('warning',$('<div/>')
				.append('您只有在登录后，才能使用Moo。需要现在')
				.append($('<a href="#">登录</a>')
					.click(function(){
						PopPage.item.login.load();
						msgBar.close();
						return false;
					}))
				.append('吗？'));
			Homepage.onload();
			$('#homepage').hide().fadeIn('slow');
		}
	});
	
	setInterval(Page.pollHash,500);
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
			success: function(userID){
				moo.GET({
					URI: '/Users/'+userID,
					success: function(user){
						Moo.currentUser=user;
						
						$('#loggedIn').show();
						$('#notLoggedIn').hide();
						$('#loggedUserName').text(user.Name);
						$('#loggedUserImg').attr('src',Gravatar.get(user.Email,30));
						if(user.Role=='Worker' || user.Role=='Organizer'){
							$('#manageLink').show();
						}else{
							$('#manageLink').hide();
						}
						
						ServerConn.tryLogin(false);
						
						if(callback instanceof Function){
							callback();
						}
					}
				});
			},
			unauthorized: function(){return false;}
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
	ServerConn.logout();
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

function htmlEncode(str){
	return $('<div/>').text(str).html();
}

/**
	[randNumMin,randNumMax)
*/
function randInt(randNumMin,randNumMax){
	return Math.floor(Math.random() * (randNumMax - randNumMin)) + randNumMin;
}

Date.prototype.toString=function(){
	return this.getFullYear()+'-'+(this.getMonth()+1)+'-'+this.getDate()+' '+this.getHours()+':'+this.getMinutes()+':'+this.getSeconds();
};

Date.prototype.toMS=function(){
	return "\/Date(" + this.getTime() + "+0000)\/";
};