"use strict";
(function(){
	var params;
	
	function doUpload(input,answer,callback){
		var counter=0,inputBlobID,answerBlobID;
		$('progress',input).removeAttr('max').removeAttr('value');
		$('progress',answer).removeAttr('max').removeAttr('value');
		readFile(input,input.data().file);
		readFile(answer,answer.data().file);
		
		function readFile(htmlLi,file){
			$('.status',htmlLi).text('正在读取');
			var reader=new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload=function(){
				compressFile(htmlLi,reader.result);
			};
		}
		
		function compressFile(htmlLi,fileContent){
			$('.status',htmlLi).text('正在压缩');
			var compressor=new Worker('compressor.js');
			compressor.onmessage=function(evt){
				compressor.terminate();
				uploadFile(htmlLi,evt.data,evt.data.byteLength/fileContent.byteLength);
			};
			compressor.postMessage(fileContent);
		}
		
		function uploadFile(htmlLi,compressed,compressRate){
			$('.status',htmlLi).text('压缩成功(压缩率'+Math.floor(compressRate*100)+'%)，正在上传');
			$('progress',htmlLi).attr('value',0).attr('max',compressed.byteLength);
			new Moo().sendBlob({
				data: compressed,
				progress: function(evt){
					$('progress',htmlLi).attr('value',evt.loaded);
				},
				success: function(id){
					$('.status',htmlLi).text('上传成功，准备添加');
					if(htmlLi==input)
						inputBlobID=id;
					else
						answerBlobID=id;
					
					if(++counter==2){
						addTestCase();
					}
				}
			});
		}
		
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
	
	function onsubmit(){
		if($('#lstInput li').length!=$('#lstAnswer li').length){
			MsgBar.show('warning','输入文件与答案文件个数不匹配，请加入所有输入与答案文件，并对齐属于相同测试点的两个文件');
			return false;
		}
		if($('#lstInput li').length==0){
			MsgBar.show('warning','请加入至少一组输入与答案文件');
			return false;
		}
		
		$('#btnSubmit').attr('disabled',true);
		
		var total=$('#lstInput li').length;
		var counter=0;
		for(var i=0;i<total;i++)
			doUpload($($('#lstInput li')[i]),$($('#lstAnswer li')[i]),function(){
				if(++counter==total){
					MsgBar.show('info','成功添加'+total+'组测试数据');
					Page.item.testCaseList.load({id:params.id});
				}
			});
		return false;
	}
	
	Page.item.testCaseCreate=new Page();
	Page.item.testCaseCreate.name='testCaseCreate';
	Page.item.testCaseCreate.metroBlock=MetroBlock.item.problem;
	Page.item.testCaseCreate.onload=function(_params){
		params=_params;
		new Moo().GET({
			URI: '/Problems',
			data: {id:params.id},
			success: function(data){
				$('#pageTitle').text('为'+data[0].Problem.Name+'添加测试数据');
			}
		});
		
		$('#toolbar')
			.append($('<li/>')
				.append($('<a href="#">返回数据列表</a>')
					.click(function(){
						Page.item.testCaseList.load({id:params.id});
						return false;
					})));
		
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(onsubmit)
				.append($('<fieldset/>')
					.append('<legend>基本参数</legend>')
					.append($('<div style="float:right; font-size: small; font-family: sans-serif;"/>')
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
					.append('<legend>相关文件</legend>')
					.append($('<div class="fileList"/>')
						.append($('<div class="title">输入文件</div>'))
						.append($('<ul id="lstInput"/>')))
					.append($('<div class="fileList"/>')
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
	};
	Page.item.testCaseCreate.onunload=function(){
	};
})();