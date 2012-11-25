"use strict";
function assert(condition){
	if(!condition){
		alert('Assertion Failed');
		throw new Error('Assertion Failed');
	}
}

$(function(){
	if(Navigator.tooOld()){
		$('body')
			.append('<h3>请原谅我们无法为您加载Moo</h3>')
			.append('Moo使用HTML 5，希望为您带来最佳的浏览体验。其间使用到了一些较为先进的浏览器特性。<br/>')
			.append('但由于您的浏览器较为落后，部分特性得不到良好的支持，如继续加载，可能会：<br/>')
			.append($('<ol/>')
				.append('<li>Moo的页面显示出现问题。例如文本、按钮、图片等出现错位。</li>')
				.append('<li>Moo的最基本功能无法正常使用。例如无法登陆、无法打开特定页面抑或页面切换出现问题。</li>'))
			.append('<h3>请您考虑更换您的浏览器</h3>')
			.append('换用最新版<a href="http://www.google.com/chrome">Google Chrome</a>您将会得到非凡的浏览体验。由于Moo的开发以Google Chrome为参照，它对于Google Chrome完全兼容。<br/>')
			.append('您也可以尝试最新版本的<a href="http://www.firefox.com/">Mozilla Firefox</a>、<a href="http://www.opera.com/">Opera</a>、<a href="http://www.apple.com/safari/">Safari</a>、<a href="http://windows.microsoft.com/zh-CN/internet-explorer/download-ie">Internet Explorer</a>等一系列优秀浏览器。')
		return;
	}
	
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
	
	$('#sidePanel')
		.append($('<a href="#">Debug</a>')
			.click(function(){
				Page.item.testCaseCreate.load({id:1});
				return false;
			}));
	
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
				
				if(Math.random()<0.5){
					$.get('tip.txt',function(data){
						var tips=data.split(/\r\n?|\n/g);
						var tip=tips[Math.floor(Math.random() * tips.length + 1)-1];
						MsgBar.show('tip','<b>你知道吗？</b>'+tip);
					});
				}
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
			}
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