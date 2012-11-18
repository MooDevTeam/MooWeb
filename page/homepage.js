"use strict";
var Homepage={};
(function(){
	var lastPostItemID;
	var hInterval;
	
	function addPostItem(item){
		var divContent;
		var newItem=$('<div/>')
			.append($('<div/>')
				.css({
					'margin-top':'5px',
					'margin-bottom':'5px',
					'display':'inline-block',
					'width':'80%',
					'text-align':'left',
					'padding': '10px',
					'background':'white',
					'box-shadow':'2px 2px 7px gray'
				})
				.append($('<div class="postHeader"/>')
					.css({
						'color':'gray',
						'font-size':'small'
					})
					.append(Link.user(item.CreatedBy))
					.append(' '+item.CreateTime.toString()))
				.append(divContent=$('<div/>').text(item.Content)));
		
		if(Moo.currentUser && Moo.currentUser.ID==item.CreatedBy.ID){
			$(':first',newItem).css({
				'background':'lightcyan'
			});
			$('.postHeader',newItem).css('text-align','right');
			newItem.css('text-align','right');
		}
		
		$('#postItems').prepend(newItem);
		newItem.hide().slideDown();
		
		new Moo().POST({
			URI: '/ParseWiki',
			data: {wiki:item.Content},
			success: function(data){
				divContent.html(data);
				$('pre code').each(function(i,e){hljs.highlightBlock(e);});
			}
		});
	}
	
	function refresh(){
		if(lastPostItemID===undefined)return;
		new Moo().GET({
			URI: '/Posts/'+Config.homepagePostID+'/Items',
			data: {idGT:lastPostItemID,order:'asc'},
			success: function(data){
				data.forEach(function(item){
					if(item.ID>lastPostItemID){
						addPostItem(item);
						lastPostItemID=item.ID;
					}
				});
			}
		});
	}
	
	function addInitialPostItems(){
		new Moo().GET({
			URI: '/Posts/'+Config.homepagePostID+'/Items',
			data: {top:6,order:'desc'},
			success: function(data){
				for(var i=data.length-1;i>=0;i--)
					addPostItem(data[i]);
				lastPostItemID=data[0].ID;
			}
		});
	}
	
	function createPostItem(){
		var postContent=$.trim($('#txtPostContent').val());
		if(!postContent.length) return false;
		$('#txtPostContent').val('');
		new Moo().POST({
			URI: '/Posts/'+Config.homepagePostID+'/Items',
			data: {postItem:{Content:postContent}},
			success: function(){
				refresh();
			}
		});
		return false;
	}
	
	Homepage.onload=function(){
		lastPostItemID=undefined;
		hInterval=setInterval(refresh,3000);
		$('#homepage')
			.append($('<form id="frmChat"/>')
				.submit(createPostItem)
				.append($('<textarea id="txtPostContent" rows="5" cols="0" requried="requried" placeholder="写入您想说的内容。Ctrl-Enter发送。"/>')
					.css({
						'border':'none',
						'box-shadow':'2px 2px 10px gray',
						'display':'block',
						'margin':'auto',
						'width':'95%',
					}))
					.keypress(function(e){
						if(e.ctrlKey && (e.keyCode==10 || e.keyCode==13)){
							$('#frmChat').trigger('submit');
							return false;
						}
					}))
			.append('<div id="postItems"/>');
		addInitialPostItems();
	};
	Homepage.onunload=function(){
		$('#homepage').html('');
		clearInterval(hInterval);
	};
})();