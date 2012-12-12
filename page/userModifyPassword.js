"use strict";
(function(){
	var params;
	
	function onsubmit(){
		$('#btnSubmit').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){
			$('#btnSubmit').attr('disabled',false);
		};
		
		var rsa=new RSAKey();
		rsa.setPublic(Moo.publicKey.Modulus,Moo.publicKey.Exponent);
		moo.PUT({
			URI: '/Users/'+params.id,
			data: {user:{
				PasswordCheck: rsa.encrypt_b64($('#txtOldPassword').val()),
				Password: rsa.encrypt_b64($('#txtPassword').val())
			}},
			success: function(){
				Page.item.user.load({id:params.id});
				new MsgBar('info','修改密码成功');
			}
		});
		return false;
	}
	
	function comparePassword(){
		if($('#txtPassword').val()==$('#txtPassword2').val())
			$('#txtPassword2')[0].setCustomValidity('');
		else
			$('#txtPassword2')[0].setCustomValidity('两次密码不匹配');
	}
	
	Page.item.userModifyPassword=new Page();
	Page.item.userModifyPassword.name='userModifyPassword';
	Page.item.userModifyPassword.metroBlock=MetroBlock.item.user;
	Page.item.userModifyPassword.onload=function(_params){
		params=_params;
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回用户</a>')
					.click(function(){
						Page.item.user.load({id:params.id});
						return false;
					})));
		
		new Moo().GET({
			URI: '/Users/'+params.id,
			success: function(data){
				$('#pageTitle').text('修改'+data.Name+'的密码');
			}
		});
		
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(onsubmit)
				.append('<div><input id="txtOldPassword" type="password" placeholder="旧密码" autofocus="true" required="true"/></div>')
				.append($('<div/>')
					.append($('<input id="txtPassword" type="password" placeholder="新密码" required="true"/>')
						.change(comparePassword))
					.append(' ')
					.append($('<input id="txtPassword2" type="password" placeholder="再输一遍" required="true"/>')
						.change(comparePassword)))
				.append('<div><input id="btnSubmit" type="submit" value="修改"/></div>'));
	};
	Page.item.userModifyPassword.onunload=function(){
	};
})();