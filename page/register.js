"use strict";
(function(){
	function register(){
		var moo=new Moo();
		moo.restore=function(){
			$('#btnSubmit').attr('disabled',false);
		};
		$('#btnSubmit').attr('disabled',true);
		
		moo.POST({
			URI: '/Users',
			data: {user:{
				Name: $('#txtUserName').val(),
				Password: $('#txtPassword').val(),
				Email: $('#txtEmail').val()
			}},
			success: function(){
				Page.backToHomepage();
				PopPage.item.login.load({userName:$('#txtUserName').val()});
				new MsgBar('info','注册成功，请登录');
			}
		});
		return false;
	}

	Page.item.register=new Page();
	Page.item.register.name='register';
	Page.item.register.metroBlock=MetroBlock.item.user;
	Page.item.register.onload=function(){
		$('#pageTitle').text('注册用户');
		$('#main')
			.append($('<form/>')
				.css('padding','10px')
				.submit(register)
				.append($('<div/>')
					.append($('<input id="txtUserName" type="text" placeholder="用户名" required="required"/>')
						.change(function(){
							new Moo().GET({
								URI: '/Users/ByName',
								data: {name:$(this).val()},
								success: function(data){
									if(data){
										$('#txtUserName')[0].setCustomValidity('用户名已被抢注');
									}else{
										$('#txtUserName')[0].setCustomValidity('');
									}
								}
							});
						})))
				.append($('<div/>')
					.append($('<input id="txtPassword" type="password" placeholder="密码" required="required"/>')
						.change(function(){
							$('#txtPasswordCheck').change();
						}))
					.append(' ')
					.append($('<input id="txtPasswordCheck" type="password" placeholder="重复密码" required="required"/>')
						.change(function(){
							if($(this).val()!=$('#txtPassword').val())
								this.setCustomValidity('两次输入的密码不匹配');
							else
								this.setCustomValidity('');
						})))
				.append('<div><input id="txtEmail" type="email" placeholder="电子邮箱" required="required"/></div>')
				.append('<div><textarea id="txtTOS" readonly="readonly" rows="20" cols="0" style="width: 80%;"/></div>')
				.append('<div><input id="btnSubmit" type="submit" value="同意以上服务条款并注册"/></div>'));
		$.get('resources/terms.txt',function(data){
			$('#txtTOS').text(data);
		});
	};
	Page.item.register.onunload=function(){
	};
})();