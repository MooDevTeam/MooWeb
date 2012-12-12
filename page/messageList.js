"use strict";

(function(){
	
	var liMap;
	
	Message.item.list=new Message();
	Message.item.list.onload=function(){
		liMap={};
		$('#msgTitle').text('最近联系人');
		
		$('#msgMain')
			.append($('<ul id="contactList"/>')
				.append(liMap[null]=$('<li/>')
					.append($('<a href="#" style="color: yellow;"><img src="http://www.gravatar.com/avatar/?s=40&d=retro"  style="vertical-align: middle;" alt=""/> 所有人</a>')
						.click(function(){
							Message.item.main.load({id:null});
							return false;
						}))));
		
		new Moo().GET({
			URI: '/Messages/Contacts',
			success: function(data){
				data.forEach(function(line){
					var htmlLi=$('<li/>')
						.append($('<a href="#"/>')
							.append($('<img alt="" style="vertical-align: middle;"/>')
								.attr('src',Gravatar.get(line.Email,40)))
							.append(' '+htmlEncode(line.Name))
							.click(function(){
								Message.item.main.load({id:line.ID});
								return false;
							}));
					liMap[line.ID]=htmlLi;
					$('#contactList')
						.append(htmlLi);
				});
			}
		});
	};
	Message.item.list.onunload=function(){
	};
	Message.item.list.getLiMap=function(){
		return liMap;
	};
})();