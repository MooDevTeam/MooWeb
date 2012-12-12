"use strict";
(function(){
	var params;
	var latestMsgID,earliestMsgID;
	var isOver;
	var loading;
	
	function buildMsgEntry(data){
		var divContent;
		var newEntry=$('<div class="msgEntry"/>')
				.addClass(data.From.ID==Moo.currentUser.ID?'fromMe':'fromOthers')
				.append($('<div/>')
					.append($('<div class="header"/>')
						.append(Link.user(data.From))
						.append(' ')
						.append(data.CreateTime.toString()))
					.append(divContent=$('<div class="content"/>')
						.text(data.Content)));
		new Moo().POST({
			URI: '/ParseWiki',
			data: {wiki:data.Content},
			success: function(data){
				divContent.html(data);
				$('pre code',divContent).each(function(i,e){hljs.highlightBlock(e);});
			}
		});
		
		if(latestMsgID===undefined)
			latestMsgID=data.ID;
		else
			latestMsgID=Math.max(latestMsgID,data.ID);
		
		if(earliestMsgID==undefined)
			earliestMsgID=data.ID;
		else
			earliestMsgID=Math.min(earliestMsgID,data.ID);
		
		return newEntry;
	}
	
	function refresh(){
		if(loading)return;
		loading=true;
	
		var query={
			order: 'asc'
		};
		if(params.id)
			query['with']=params.id;
		if(latestMsgID!==undefined)
			query['idGT']=latestMsgID;
		
		new Moo().GET({
			URI: '/Messages',
			data: query,
			success: function(data){
				data.forEach(function(data){
					var entry=buildMsgEntry(data);
					$('#msgs').prepend(entry);
					entry.hide().slideDown();
				});
				loading=false;
			}
		});
	};
	
	function showMore(callback){
		assert(!isOver);
		if(loading)return;
		loading=true;
	
		var query={
			top: 10
		};
		if(params.id)
			query['with']=params.id;
		if(earliestMsgID!==undefined)
			query.idLT=earliestMsgID;
		
		new Moo().GET({
			URI: '/Messages',
			data: query,
			success: function(data){
				data.forEach(function(data){
					var entry=buildMsgEntry(data);
					$('#msgs').append(entry);
					entry.hide().slideDown();
				});
				if(data.length==0){
					isOver=true;
				}
				loading=false;
				if(callback instanceof Function)
					callback();
			}
		});
	}
	
	function fillScreen(){
		if(!isOver && $('#msgWrapper').height()>=$('#frmNewMsg').outerHeight(true)+$('#msgs').outerHeight(true)){
			showMore(fillScreen);
		}
	}
	
	function postNew(){
		if($('#txtMessageContent').val().trim()!=''){
			new Moo().POST({
				URI: '/Messages',
				data: {message:{
					Content: $('#txtMessageContent').val(),
					ToID: params.id
				}},
				success: function(){
					refresh();
				}
			});
		}
		$('#txtMessageContent').val('');
		return false;
	}
	
	Message.item.main=new Message();
	Message.item.main.onload=function(_params){
		params=_params;
		
		latestMsgID=earliestMsgID=undefined;
		loading=false;
		isOver=false;
		
		if(params.id==null){
			$('#msgTitle')
				.append($('<a id="backToMsgList" href="#" title="返回联系人"><img src="image/arrow-left.png" alt="Back" style="width: 30px; vertical-align:middle;"/></a>')
					.click(function(){
						Message.item.list.load();
						return false;
					}))
				.append(' 公共版聊')
				.append($('<a href="#" style="color: skyblue; float: right;">清空记录</a>')
					.click(function(){
						if(confirm('确实要清空所有公共聊天记录吗?')){
							new Moo().DELETE({
								URI: '/Messages',
								success: function(){
									$('.msgEntry').slideUp(function(){
										$(this).remove();
									});
								}
							});
						}
						return false;
					}));
		}else{
			new Moo().GET({
				URI: '/Users/'+params.id,
				success: function(data){
					$('#msgTitle')
						.append($('<a id="backToMsgList" href="#" title="返回联系人"><img src="image/arrow-left.png" alt="Back" style="width: 30px; vertical-align:middle;"/></a>')
						.click(function(){
							Message.item.list.load();
							return false;
						}))
						.append(' '+htmlEncode(data.Name)+' ')
						.append($('<img alt="" style="margin-left: 10px; float: right; vertical-align: middle;"/>')
							.attr('src',Gravatar.get(data.Email,30)))
						.append($('<a href="#" style="float:right; color: skyblue;">删除会话</a>')
							.click(function(){
								if(confirm('确实要删除您与'+data.Name+'的所有聊天记录吗？')){
									new Moo().DELETE({
										URI: '/Messages?with='+params.id,
										success: function(){
											$('.msgEntry').slideUp(function(){
												$(this).remove();
											});
										}
									});
								}
								return false;
							}));
				}
			});
		}
		
		$('#msgMain')
			.append($('<div id="msgWrapper"/>')
				.css({
					'height':'100%',
					'overflow':'auto'
				})
				.append($('<form id="frmNewMsg"/>')
				.css({
					'padding':'10px'
				})
				.submit(postNew)
				.append($('<textarea id="txtMessageContent" rows="3" cols="0" autofocus="autofocus" required="required" placeholder="输入内容 Ctrl-Enter发送 支持Wiki格式"/>')
					.css({
						'display':'block',
						'width':'90%',
						'margin':'auto'
					})
					.keypress(function(e){
						if(e.ctrlKey && (e.keyCode==10 || e.keyCode==13)){
							$('#frmNewMsg').trigger('submit');
							return false;
						}
					}))
				.append($('<div/>')
					.css({
						'text-align':'right',
						'padding-right':'5%'
					})
					.append('<input id="btnSubmit" type="submit" class="small" value="发送"/>')))
				.append('<div id="msgs"/>'));
		
		$('#msgWrapper')
			.scroll(function(){
				if(!isOver){
					var leftHeight=$('#frmNewMsg').outerHeight(true)+$('#msgs').outerHeight(true)-$(this).height()-$(this).scrollTop();
					if(leftHeight<0.2*$(this).height())
						showMore();
				}
			});
		fillScreen();
	};
	Message.item.main.onunload=function(){
	};
	Message.item.main.withWho=function(){
		return params.id;
	};
	Message.item.main.refresh=refresh;
})();