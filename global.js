var queryString={};

function assert(condition){
	if(!condition){
		alert('Assertion Failed');
		throw new Error('Assertion Failed');
	}
}

$(function(){
	(function parseQueryString(){
		var arg=window.location.search;
		if(arg.length>0){
			arg.substring(1).split('&').forEach(
				function(keyValuePair){
					var index=keyValuePair.indexOf('=');
					if(index!=-1){
						var key=keyValuePair.substring(0,index);
						var value=keyValuePair.substring(index+1);
						queryString[URLDecode(key)]=URLDecode(value);
					}
				}
			);
		}
	})();
	
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
		.append('The Moo Online Judge');
	
	$('#mainTopBarRight').text('There Should Be Sth.');
	
	MetroBlock.init();
	MsgBar.init();
	
	$(document).bind('keydown',function(e) {
		if(e.which === 116 || e.which === 82 && e.ctrlKey) {//F5 || Ctrl-R
			if(Page.currentPage){
				Page.currentPage.load();
				return false;
			}else
				return true;
		}
	});
	
	refreshUserInfo();
	
	if(queryString.page){
		Page.item[queryString.page].load(queryString);
	}else{
		$('#homepage').hide().fadeIn('slow');
	}
});

function refreshUserInfo(){
	var moo=new Moo();
	moo.restore=clearUserInfo;
	
	if(localStorage.mooToken || sessionStorage.mooToken){
		moo.GET({
			URI: '/CurrentUser',
			noMessage: true,
			success: function(userID){
				$('#loggedIn').show();
				$('#notLoggedIn').hide();
				Moo.currentUser={};
				Moo.currentUser.userID=userID;
				moo.GET({
					URI: '/Users/'+userID,
					success: function(user){
						Moo.currentUser.userName=user.Name;
						$('#loggedUserName').text(user.Name);
					}
				});
			},
		});
	}else{
		clearUserInfo();
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

function URLDecode(str){
	return decodeURIComponent(str.replace('+','%20'));
}

Date.prototype.toString=function(){
	return this.getFullYear()+'-'+(this.getMonth()+1)+'-'+this.getDate()+' '+this.getHours()+':'+this.getMinutes()+':'+this.getSeconds();
};