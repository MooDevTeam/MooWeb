"use strict";
(function(){
	var params;
	
	function compressAndUpload(callback){
		$('progress').removeAttr('max').removeAttr('value');
		readFile();
		
		function readFile(){
			$('#status').text('正在读取');
			var reader=new FileReader();
			reader.readAsArrayBuffer($('#fileUpload')[0].files[0]);
			reader.onload=function(){
				compressFile(new Uint8Array(reader.result));
			};
			reader.onerror=function(){
				new MsgBar('error','读取文件失败');
			};
		}
		
		function compressFile(fileContent){
			$('#status').text('正在压缩');
			$('progress').attr('value',0).attr('max',fileContent.length);
			
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
					$('progress').attr('value',msg.current);
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
			$('#status').text('压缩成功(压缩率'+Math.floor(compressRate*100)+'%)，正在上传');
			$('progress').attr('value',0).attr('max',compressed.size);
			new Moo().sendBlob({
				data: compressed,
				progress: function(evt){
					$('progress').attr('value',evt.loaded);
				},
				success: function(id){
					$('#status').text('上传成功，准备添加');
					callback(id);
				}
			});
		}
	}
	
	function onsubmit(){
		$('#btnSubmit').attr('disabled',true);
		var moo=new Moo();
		moo.restore=function(){
			$('#btnSubmit').attr('disabled',false);
		};
		
		compressAndUpload(function(id){
			moo.POST({
				URI: '/Files',
				data: {file:{
					Name: $('#txtName').val(),
					BlobID: id,
					Description: $('#txtDescription').val()
				}},
				success: function(data){
					Page.item.file.load({id:data});
				}
			});
		});
		return false;
	}
	
	Page.item.fileCreate=new Page();
	Page.item.fileCreate.name='fileCreate';
	Page.item.fileCreate.metroBlock=MetroBlock.item.file;
	Page.item.fileCreate.onload=function(_params){
		params=_params;
		
		$('#pageTitle').text('上传新文件');
		
		$('#main')
			.append($('<form/>')
				.css('margin','10px')
				.submit(onsubmit)
				.append($('<div/>')
					.append('<input id="txtName" type="text" requried="required" placeholder="名称，如：凤娘无码.avi" />')
					.append('<input id="fileUpload" type="file" required="requried"/>'))
				.append($('<div/>')
					.append(new WikiEditor({
						id: 'txtDescription',
						placeholder: '文件描述'
					}).html()))
				.append('<div><progress style="width: 80%;" value="0" max="1"/></div>')
				.append('<div id="status" style="font-size: small;">等待上传</div>')
				.append('<div><input id="btnSubmit" type="submit" value="上传"/></div>'));
		
		$('#fileUpload')
			.change(function(){
				if(this.files.length>0){
					var fileName=this.files[0].name;
					var extName=fileName.match(/\.([^.]+)$/)[1];
					if(extName=='ex_'){
						fileName=fileName.replace(/\.([^.]+)$/,'.exe');
					}
					$('#txtName').val(fileName);
				}
			});
	};
	Page.item.fileCreate.onunload=function(){
	};
})();