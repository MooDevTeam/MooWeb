"use strict";
(function(){
	var params;
	
	function compressAndUpload(htmlLi,callback){
		$('progress',htmlLi).removeAttr('max').removeAttr('value');
		readFile(htmlLi.data('file'));
		
		function readFile(file){
			$('.status',htmlLi).text('正在读取');
			var reader=new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload=function(){
				compressFile(new Uint8Array(reader.result));
			};
			reader.onerror=function(){
				new MsgBar('error','读取文件失败');
			};
		}
		
		function compressFile(fileContent){
			$('.status',htmlLi).text('正在压缩');
			$('progress',htmlLi).attr('value',0).attr('max',fileContent.length);
			
			var mainPart,leftPart;
			var deflator=new Worker('zip.js/deflate.js');
			deflator.onmessage=function(evt){
				var msg=evt.data;
				if(msg.oninit){
					deflator.postMessage({append:true,data: fileContent});
				}else if(msg.onappend){
					mainPart=msg.data;
					deflator.postMessage({flush:true});
				}else if(msg.progress){
					$('progress',htmlLi).attr('value',msg.current);
				}else if(msg.onflush){
					deflator.terminate();
					leftPart=msg.data;
					var result=new Blob([mainPart,leftPart]);
					uploadFile(result,result.size/fileContent.length);
				}
			};
			deflator.postMessage({init:true});
		}
		
		function uploadFile(compressed,compressRate){
			$('.status',htmlLi).text('压缩成功(压缩率'+Math.floor(compressRate*100)+'%)，正在上传');
			$('progress',htmlLi).attr('value',0).attr('max',compressed.size);
			new Moo().sendBlob({
				data: compressed,
				progress: function(evt){
					$('progress',htmlLi).attr('value',evt.loaded);
				},
				success: function(id){
					$('.status',htmlLi).text('上传成功，准备添加');
					callback(id);
				}
			});
		}
	}
	
	function traditionalUpload(input,answer,callback){
		var inputBlobID,answerBlobID;
		
		compressAndUpload(input,function(id){
			inputBlobID=id;
			if(answerBlobID!==undefined)
				addTestCase();
		});
		
		compressAndUpload(answer,function(id){
			answerBlobID=id;
			if(inputBlobID!==undefined)
				addTestCase();
		});
		
		function addTestCase(){
			$('.status',input).text('正在添加');
			$('.status',answer).text('正在添加');
			new Moo().POST({
				URI: '/Problems/'+params.id+'/TestCases/Traditional',
				data: {testCase:{
					InputBlobID: inputBlobID,
					AnswerBlobID: answerBlobID,
					Score: Number($('#txtScore').val()),
					TimeLimit: Number($('#txtTimeLimit').val()),
					MemoryLimit: Number($('#txtMemoryLimit').val())
				}},
				success: function(){
					$('.status',input).text('添加成功');
					$('.status',answer).text('添加成功');
					callback();
				}
			});
		}
	}
	
	function specialJudgedUpload(input,answer,callback){
		var inputBlobID,answerBlobID;
		
		compressAndUpload(input,function(id){
			inputBlobID=id;
			if(answerBlobID!==undefined)
				addTestCase();
		});
		
		compressAndUpload(answer,function(id){
			answerBlobID=id;
			if(inputBlobID!==undefined)
				addTestCase();
		});
		
		function addTestCase(){
			$('.status',input).text('正在添加');
			$('.status',answer).text('正在添加');
			new Moo().POST({
				URI: '/Problems/'+params.id+'/TestCases/SpecialJudged',
				data: {testCase:{
					InputBlobID: inputBlobID,
					AnswerBlobID: answerBlobID,
					JudgerID: Number($('#txtJudger').val()),
					TimeLimit: Number($('#txtTimeLimit').val()),
					MemoryLimit: Number($('#txtMemoryLimit').val())
				}},
				success: function(){
					$('.status',input).text('添加成功');
					$('.status',answer).text('添加成功');
					callback();
				}
			});
		}
	}
	
	function interactiveJudgedUpload(testData,callback){
		compressAndUpload(testData,function(id){
			addTestCase(id);
		});
		
		function addTestCase(id){
			$('.status',testData).text('正在添加');
			new Moo().POST({
				URI: '/Problems/'+params.id+'/TestCases/Interactive',
				data: {testCase:{
					TestDataBlobID: id,
					InvokerID: Number($('#txtInvoker').val()),
					TimeLimit: Number($('#txtTimeLimit').val()),
					MemoryLimit: Number($('#txtMemoryLimit').val())
				}},
				success: function(){
					$('.status',testData).text('添加成功');
					callback();
				}
			});
		}
	}
	
	function answerOnlyUpload(testData,callback){
		compressAndUpload(testData,function(id){
			addTestCase(id);
		});
		
		function addTestCase(id){
			$('.status',testData).text('正在添加');
			new Moo().POST({
				URI: '/Problems/'+params.id+'/TestCases/AnswerOnly',
				data: {testCase:{
					TestDataBlobID: id,
					JudgerID: Number($('#txtJudger').val()),
				}},
				success: function(){
					$('.status',testData).text('添加成功');
					callback();
				}
			});
		}
	}
	
	function addTraditional(){
		if($('#lstInput li').length!=$('#lstAnswer li').length){
			new MsgBar('warning','输入文件与答案文件个数不匹配，请加入所有输入与答案文件，并对齐属于相同测试点的两个文件');
			return false;
		}
		if($('#lstInput li').length==0){
			new MsgBar('warning','请加入至少一组输入与答案文件');
			return false;
		}
		
		$('#btnSubmit').attr('disabled',true);
		
		var total=$('#lstInput li').length;
		var counter=0;
		for(var i=0;i<total;i++)
			traditionalUpload($($('#lstInput li')[i]),$($('#lstAnswer li')[i]),function(){
				if(++counter==total){
					new MsgBar('info','成功添加'+total+'组测试数据');
					Page.item.testCaseList.load({id:params.id});
				}
			});
		return false;
	}
	
	function addSpecialJudged(){
		if($('#lstInput li').length!=$('#lstAnswer li').length){
			new MsgBar('warning','输入文件与答案文件个数不匹配，请加入所有输入与答案文件，并对齐属于相同测试点的两个文件');
			return false;
		}
		if($('#lstInput li').length==0){
			new MsgBar('warning','请加入至少一组输入与答案文件');
			return false;
		}
		
		$('#btnSubmit').attr('disabled',true);
		
		var total=$('#lstInput li').length;
		var counter=0;
		for(var i=0;i<total;i++)
			specialJudgedUpload($($('#lstInput li')[i]),$($('#lstAnswer li')[i]),function(){
				if(++counter==total){
					new MsgBar('info','成功添加'+total+'组测试数据');
					Page.item.testCaseList.load({id:params.id});
				}
			});
		return false;
	}
	
	function addInteractive(){
		if($('#lstTestData li').length==0){
			new MsgBar('warning','请加入至少一份测评资料文件');
			return false;
		}
		
		$('#btnSubmit').attr('disabled',true);
		
		var total=$('#lstTestData li').length;
		var counter=0;
		for(var i=0;i<total;i++)
			interactiveJudgedUpload($($('#lstTestData li')[i]),function(){
				if(++counter==total){
					new MsgBar('info','成功添加'+total+'组测试数据');
					Page.item.testCaseList.load({id:params.id});
				}
			});
		return false;
	}
	
	function addAnswerOnly(){
		if($('#lstTestData li').length==0){
			new MsgBar('warning','请加入至少一份测评资料文件');
			return false;
		}
		
		$('#btnSubmit').attr('disabled',true);
		
		var total=$('#lstTestData li').length;
		var counter=0;
		for(var i=0;i<total;i++)
			answerOnlyUpload($($('#lstTestData li')[i]),function(){
				if(++counter==total){
					new MsgBar('info','成功添加'+total+'组测试数据');
					Page.item.testCaseList.load({id:params.id});
				}
			});
		return false;
	}
	
	function loadTraditional(){
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(addTraditional)
				.append($('<fieldset/>')
					.append('<legend>基本参数</legend>')
					.append($('<div style="float:right; font-size: small;"/>')
						.append('1 s=1000 ms<br/>')
						.append('1 MB=1024 KB=1048576 bytes<br/>')
						.append('64 MB=67108864 bytes<br/>')
						.append('128 MB=134217728 bytes<br/>')
						.append('256 MB=268435456 bytes<br/>')
						.append('512 MB=536870912 bytes<br/>'))
					.append($('<div/>')
						.append('<input id="txtTimeLimit" type="number" min="0" max="60000" required="true" placeholder="时间限制(ms)"/>')
						.append(' ')
						.append('<input id="txtMemoryLimit" type="number" min="0" max="2147483647" required="true" placeholder="内存限制(bytes)"/>'))
					.append($('<div/>')
						.append('<input id="txtScore" type="number" min="0" max="1000" required="true" placeholder="单点分数"/>'))
					.append('<div class="clear"/>'))
				.append($('<fieldset/>')
					.append('<legend>输入与输出文件</legend>')
					.append($('<div class="fileList half"/>')
						.append($('<div class="title">输入文件</div>'))
						.append($('<ul id="lstInput"/>')))
					.append($('<div class="fileList half"/>')
						.append($('<div class="title">答案文件</div>'))
						.append($('<ul id="lstAnswer"/>')))
					.append($('<div class="clear"/>'))
					.append('<div style="color: green; text-align: center; font-weight: bold; font-size: large;">请对齐属于同一测试点的文件</div>')
					.append($('<div style="text-align: center;"/>')
						.append($('<input type="button" value="添加多个文件"/>')
							.click(function(){
								$('#fileUpload').trigger('click');
								return false;
							}))
						.append($('<input type="button" value="清除所有文件"/>')
							.click(function(){
								$('.fileList ul li').fadeOut(function(){
									$(this).remove();
								});
								return false;
							}))
						.append('<input id="fileUpload" style="display:none;" type="file" multiple="multiple"/>')))
				.append('<div><input id="btnSubmit" type="submit" value="开始添加"/></div>'));
		
		$('#lstInput').sortable({connectWith:'#lstAnswer'});
		$('#lstAnswer').sortable({connectWith:'#lstInput'});
		$('.fileList').disableSelection();
		
		$('#fileUpload').change(function(){
			Array.prototype.forEach.call(this.files,function(file){
				var htmlLi=$('<li/>')
					.append($('<div class="fileImg"/>'))
					.append($('<div class="info"/>')
						.append($('<div/>')
							.text(file.name+'('+file.size+' bytes)')
							.append($('<a class="delete" href="#">×</a>')
								.click(function(){
									$(this).parent().parent().parent().slideUp(function(){
										$(this).remove();
									});
									return false;
								})))
						.append($('<progress value="0" max="100"/>'))
						.append($('<div class="status"/>').text('等待上传')))
					.data({file:file});
				if(file.name.match(/\.out?|\.ans/)){
					$('#lstAnswer')
						.append(htmlLi);
				}else{
					$('#lstInput')
						.append(htmlLi);
				}
			});
			this.value="";
		});
	}
	
	function loadSpecialJudged(){
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(addSpecialJudged)
				.append($('<fieldset/>')
					.append('<legend>基本参数</legend>')
					.append($('<div style="float:right; font-size: small;"/>')
						.append('1 s=1000 ms<br/>')
						.append('1 MB=1024 KB=1048576 bytes<br/>')
						.append('64 MB=67108864 bytes<br/>')
						.append('128 MB=134217728 bytes<br/>')
						.append('256 MB=268435456 bytes<br/>')
						.append('512 MB=536870912 bytes<br/>'))
					.append($('<div/>')
						.append('<input id="txtTimeLimit" type="number" min="0" max="60000" required="true" placeholder="时间限制(ms)"/>')
						.append(' ')
						.append('<input id="txtMemoryLimit" type="number" min="0" max="2147483647" required="true" placeholder="内存限制(bytes)"/>'))
					.append($('<div/>')
						.append(new AutoInput({
							id: 'txtJudger',
							required: true,
							type: 'file',
							placeholder: '测评程序文件'
						}).html()))
					.append('<div class="clear"/>'))
				.append($('<fieldset/>')
					.append('<legend>输入与输出文件</legend>')
					.append($('<div class="fileList half"/>')
						.append($('<div class="title">输入文件</div>'))
						.append($('<ul id="lstInput"/>')))
					.append($('<div class="fileList half"/>')
						.append($('<div class="title">答案文件</div>'))
						.append($('<ul id="lstAnswer"/>')))
					.append($('<div class="clear"/>'))
					.append('<div style="color: green; text-align: center; font-weight: bold; font-size: large;">请对齐属于同一测试点的文件</div>')
					.append($('<div style="text-align: center;"/>')
						.append($('<input type="button" value="添加多个文件"/>')
							.click(function(){
								$('#fileUpload').trigger('click');
								return false;
							}))
						.append($('<input type="button" value="清除所有文件"/>')
							.click(function(){
								$('.fileList ul li').fadeOut(function(){
									$(this).remove();
								});
								return false;
							}))
						.append('<input id="fileUpload" style="display:none;" type="file" multiple="multiple"/>')))
				.append('<div><input id="btnSubmit" type="submit" value="开始添加"/></div>'));
		
		$('#lstInput').sortable({connectWith:'#lstAnswer'});
		$('#lstAnswer').sortable({connectWith:'#lstInput'});
		$('.fileList').disableSelection();
		
		$('#fileUpload').change(function(){
			Array.prototype.forEach.call(this.files,function(file){
				var htmlLi=$('<li/>')
					.append($('<div class="fileImg"/>'))
					.append($('<div class="info"/>')
						.append($('<div/>')
							.text(file.name+'('+file.size+' bytes)')
							.append($('<a class="delete" href="#">×</a>')
								.click(function(){
									$(this).parent().parent().parent().slideUp(function(){
										$(this).remove();
									});
									return false;
								})))
						.append($('<progress value="0" max="100"/>'))
						.append($('<div class="status"/>').text('等待上传')))
					.data({file:file});
				if(file.name.match(/\.out?|\.ans/)){
					$('#lstAnswer')
						.append(htmlLi);
				}else{
					$('#lstInput')
						.append(htmlLi);
				}
			});
			this.value="";
		});
	}
	
	function loadInteractive(){
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(addInteractive)
				.append($('<fieldset/>')
					.append('<legend>基本参数</legend>')
					.append($('<div style="float:right; font-size: small;"/>')
						.append('1 s=1000 ms<br/>')
						.append('1 MB=1024 KB=1048576 bytes<br/>')
						.append('64 MB=67108864 bytes<br/>')
						.append('128 MB=134217728 bytes<br/>')
						.append('256 MB=268435456 bytes<br/>')
						.append('512 MB=536870912 bytes<br/>'))
					.append($('<div/>')
						.append('<input id="txtTimeLimit" type="number" min="0" max="60000" required="true" placeholder="时间限制(ms)"/>')
						.append(' ')
						.append('<input id="txtMemoryLimit" type="number" min="0" max="2147483647" required="true" placeholder="内存限制(bytes)"/>'))
					.append($('<div/>')
						.append(new AutoInput({
							id: 'txtInvoker',
							required: true,
							type: 'file',
							placeholder: '调用程序文件'
						}).html()))
					.append('<div class="clear"/>'))
				.append($('<fieldset/>')
					.append('<legend>测评资料文件</legend>')
					.append($('<div class="fileList"/>')
						.append($('<ul id="lstTestData"/>')))
					.append($('<div style="text-align: center;"/>')
						.append($('<input type="button" value="添加多个文件"/>')
							.click(function(){
								$('#fileUpload').trigger('click');
								return false;
							}))
						.append($('<input type="button" value="清除所有文件"/>')
							.click(function(){
								$('.fileList ul li').fadeOut(function(){
									$(this).remove();
								});
								return false;
							}))
						.append('<input id="fileUpload" style="display:none;" type="file" multiple="multiple"/>')))
				.append('<div><input id="btnSubmit" type="submit" value="开始添加"/></div>'));
		
		$('#lstTestData').sortable();
		$('.fileList').disableSelection();
		
		$('#fileUpload').change(function(){
			Array.prototype.forEach.call(this.files,function(file){
				var htmlLi=$('<li/>')
					.append($('<div class="fileImg"/>'))
					.append($('<div class="info"/>')
						.append($('<div/>')
							.text(file.name+'('+file.size+' bytes)')
							.append($('<a class="delete" href="#">×</a>')
								.click(function(){
									$(this).parent().parent().parent().slideUp(function(){
										$(this).remove();
									});
									return false;
								})))
						.append($('<progress value="0" max="100"/>'))
						.append($('<div class="status"/>').text('等待上传')))
					.data({file:file});
				$('#lstTestData')
					.append(htmlLi);
			});
			this.value="";
		});
	}
	
	function loadAnswerOnly(){
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(addAnswerOnly)
				.append($('<fieldset/>')
					.append('<legend>基本参数</legend>')
					.append($('<div/>')
						.append(new AutoInput({
							id: 'txtJudger',
							required: true,
							type: 'file',
							placeholder: '测评程序文件'
						}).html()))
					.append('<div class="clear"/>'))
				.append($('<fieldset/>')
					.append('<legend>测评资料文件</legend>')
					.append($('<div class="fileList"/>')
						.append($('<ul id="lstTestData"/>')))
					.append($('<div style="text-align: center;"/>')
						.append($('<input type="button" value="添加多个文件"/>')
							.click(function(){
								$('#fileUpload').trigger('click');
								return false;
							}))
						.append($('<input type="button" value="清除所有文件"/>')
							.click(function(){
								$('.fileList ul li').fadeOut(function(){
									$(this).remove();
								});
								return false;
							}))
						.append('<input id="fileUpload" style="display:none;" type="file" multiple="multiple"/>')))
				.append('<div><input id="btnSubmit" type="submit" value="开始添加"/></div>'));
		
		$('#lstTestData').sortable();
		$('.fileList').disableSelection();
		
		$('#fileUpload').change(function(){
			Array.prototype.forEach.call(this.files,function(file){
				var htmlLi=$('<li/>')
					.append($('<div class="fileImg"/>'))
					.append($('<div class="info"/>')
						.append($('<div/>')
							.text(file.name+'('+file.size+' bytes)')
							.append($('<a class="delete" href="#">×</a>')
								.click(function(){
									$(this).parent().parent().parent().slideUp(function(){
										$(this).remove();
									});
									return false;
								})))
						.append($('<progress value="0" max="100"/>'))
						.append($('<div class="status"/>').text('等待上传')))
					.data({file:file});
				$('#lstTestData')
					.append(htmlLi);
			});
			this.value="";
		});
	}
	
	Page.item.testCaseCreate=new Page();
	Page.item.testCaseCreate.name='testCaseCreate';
	Page.item.testCaseCreate.metroBlock=MetroBlock.item.problem;
	Page.item.testCaseCreate.onload=function(_params){
		params=_params;
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回数据列表</a>')
					.click(function(){
						Page.item.testCaseList.load({id:params.id});
						return false;
					})));
		
		new Moo().GET({
			URI: '/Problems',
			data: {id:params.id},
			success: function(data){
				$('#pageTitle')
					.append($('<span/>').text('为'+data[0].Problem.Name+'添加'))
					.append($('<span style="color:red;"/>').text(
						{
							Traditional: '传统型',
							SpecialJudged: '自定义测评型',
							Interactive: '交互式型',
							AnswerOnly: '提交答案型',
						}[data[0].Type]))
					.append($('<span/>').text('测试数据'));
				
				switch(data[0].Type){
					case 'Traditional':
						loadTraditional();
						break;
					case 'SpecialJudged':
						loadSpecialJudged();
						break;
					case 'Interactive':
						loadInteractive();
						break;
					case 'AnswerOnly':
						loadAnswerOnly();
				}
			}
		});
	};
	Page.item.testCaseCreate.onunload=function(){
	};
})();