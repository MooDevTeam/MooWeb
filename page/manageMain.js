"use strict";
(function(){
	function getMemoryUsage(){
		$('#btnRefreshMemoryUsage').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){$('#btnRefreshMemoryUsage').attr('disabled',false);};
		moo.GET({
			URI: '/MemoryUsage',
			success: function(data){
				moo.restore();
				$('#memoryUsage')
					.text((Math.floor(data/1024/1024*100)/100)+' MB');
			}
		});
	}
	
	function garbageCollect(){
		$('#btnGarbageCollect').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){$('#btnGarbageCollect').attr('disabled',false);};
		moo.POST({
			URI: '/GarbageCollect',
			success: function(){
				moo.restore();
				new MsgBar('info','整理内存成功');
				getMemoryUsage();
			}
		});
	}

	Page.item.manageMain=new Page();
	Page.item.manageMain.name='manageMain';
	Page.item.manageMain.metroBlock=MetroBlock.item.help;
	Page.item.manageMain.onload=function(){
		$('#pageTitle').text('Moo控制台');
		
		$('#main')
			.append($('<div id="manageTip"/>')
				.css({
					'font-size':'small',
					'margin':'20px',
					'background':'whitesmoke',
					'border':'lightgray dashed 1px'
				}))
			.append($('<fieldset id="memory"/>')
				.css('margin','10px')
				.append('<legend>服务器内存占用</legend>')
				.append('<span id="memoryUsage"/>')
				.append($('<input id="btnRefreshMemoryUsage" type="button" value="刷新"/>')
					.click(getMemoryUsage))
				.append($('<input id="btnGarbageCollect" type="button" value="整理"/>')
					.click(garbageCollect)))
			.append($('<div id="modules"/>')
				.css('margin','10px'))
				.append($('<div class="metroBlock big" style="background: blue;"><div class="title">Tag</div></div>')
					.click(function(){
						Page.item.tagList.load();
						return;
					}))
				.append('<div class="metroBlock big" style="background: red;"><div class="title">Parameter</div></div>');
		
		$.get('resources/manageTip.txt',function(data){
			var tips=data.split(/\r\n?|\n/g);
			var tip=tips[Math.floor(Math.random() * tips.length + 1)-1];
			$('#manageTip').html(tip);
		});
		
		getMemoryUsage();
	};
	Page.item.manageMain.onunload=function(){
	};
})();