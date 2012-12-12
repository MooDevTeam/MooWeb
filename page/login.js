(function(){
	var moo=new Moo();
	moo.restore=function(){
		$('#windowMain #btnSubmit').attr('disabled',false);
	};
	
	function checkUserName(){
		moo.GET({
			URI: '/Users/ByName',
			data: {'name': $('#windowMain #txtUserName').val()},
			success: doLogin
		});
	}
	
	function doLogin(userID){
		if(userID==null){
			new MsgBar('warning','用户名不存在');
			moo.restore();
			return;
		}
		
		var pwd=$('#windowMain #txtPassword').val();
		var rsa=new RSAKey();
		rsa.setPublic(Moo.publicKey.Modulus,Moo.publicKey.Exponent);
		pwd=rsa.encrypt_b64(pwd);
		moo.POST({
			URI: '/Login',
			data: {'userID': userID, 'password': pwd},
			success: afterLogin
		});
	}
	
	function afterLogin(token){
		if(token==null){
			new MsgBar('error','身份验证失败');
			moo.restore();
			return;
		}
		
		localStorage.removeItem('mooToken');
		sessionStorage.removeItem('mooToken');
		if($('#windowMain #chkKeepLoggedIn').attr('checked')){
			localStorage.mooToken=token;
		}else{
			sessionStorage.mooToken=token;
		}
		refreshUserInfo();
		PopPage.item.login.unload();
		new MsgBar('info','登录成功');
	}
	
	PopPage.item.login=new PopPage();
	PopPage.item.login.onload=function(params){
		$('#windowTitle').text('登录');
		$('#windowMain')
			.append($('<form id="loginForm"/>')
				.css({
					'text-align': 'left',
					'display': 'inline-block'
				})
				.append($('<div/>')
					.append($('<input id="txtUserName" type="text" placeholder="用户名" required="required"/>')
						.val(params.userName?params.userName:'')
						.change(function(){
							new Moo().GET({
								URI: '/Users/ByName',
								data: {name:$(this).val()},
								success: function(data){
									if(!data){
										$('#windowMain #txtUserName')[0].setCustomValidity('用户名不存在');
									}else{
										$('#windowMain #txtUserName')[0].setCustomValidity('');
									}
								}
							});
						})))
				.append('<div><input id="txtPassword" type="password" placeholder="密码" required="required"/></div>')
				.append('<div><input id="chkKeepLoggedIn" type="checkbox" checked="checked"/><label for="chkKeepLoggedIn">使我保持登录状态</label></div>')
				.append($('<div><input id="btnSubmit" type="submit" value="登录"/></div>')
					.css({
						'margin-top': '20px',
						'margin-bottom': '20px'
					}))
				.append('没有帐户?')
				.append($('<a href="#">立即注册!</a>')
					.click(function(){
						PopPage.currentPage.unload();
						Page.item.register.load();
						return false;
					})));
		
		if(params.userName)
			$('#windowMain #txtPassword').attr('autofocus','autofocus');
		else
			$('#windowMain #txtUserName').attr('autofocus','autofocus');
		
		$('#windowMain #loginForm').submit(function(){
			$('#windowMain #btnSubmit').attr('disabled',true);
			checkUserName();
			return false;
		});
	};
	PopPage.item.login.onunload=function(){
	};
})();