(function(){
	var moo=new Moo();
	moo.restore=function(){
		$('#btnSubmit').attr('disabled',false);
	};
	
	function checkUserName(){
		moo.GET({
			URI: '/Users/ByName',
			data: {'name': $('#txtUserName').val()},
			success: doLogin,
		});
	}
	
	function doLogin(userID){
		if(userID==null){
			MsgBar.show('warning','用户名不存在');
			throw ''; 
		}
		moo.POST({
			URI: '/Login',
			data: {'userID': userID, 'password': $('#txtPassword').val()},
			success: afterLogin
		});
	}
	
	function afterLogin(token){
		if(token==null){
			MsgBar.show('error','身份验证失败');
			throw '';
		}
		
		localStorage.removeItem('mooToken');
		sessionStorage.removeItem('mooToken');
		if($('#chkKeepLoggedIn').attr('checked')){
			localStorage.mooToken=token;
		}else{
			sessionStorage.mooToken=token;
		}
		refreshUserInfo();
		PopPage.item.login.unload();
		MsgBar.show('info','登录成功');
	}
	
	PopPage.item.login=new PopPage();
	PopPage.item.login.onload=function(params){
		$('#windowTitle').text('登录');
		$('#windowBody')
			.append($('<div/>')
				.css({
					'display': 'table-cell',
					'vertical-align': 'middle',
					'text-align': 'center'
				})
				.append($('<form id="loginForm"/>')
					.css({
						'text-align': 'left',
						'display': 'inline-block'
					})
					.append('<div><input id="txtUserName" type="text" placeholder="用户名"/></div>')
					.append('<div><input id="txtPassword" type="password" placeholder="密码"/></div>')
					.append('<div><input id="chkKeepLoggedIn" type="checkbox" checked="checked"/><label for="chkKeepLoggedIn">使我保持登录状态</label></div>')
					.append($('<div><input id="btnSubmit" type="submit" value="登录"/></div>')
						.css({
							'margin-top': '20px',
							'margin-bottom': '20px'
						}))
					.append('没有帐户?<a href="#">立即注册!</a>')));
		
		$('#loginForm').submit(function(){
			$('#btnSubmit').attr('disabled',true);
			checkUserName();
			return false;
		});
		
		$('#txtUserName').focus();
	};
	PopPage.item.login.onunload=function(){
	};
})();