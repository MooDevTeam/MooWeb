"use strict";
//This is a Web Worker
importScripts('jszip/jszip.js','jszip/jszip-deflate.js');

function string2ArrayBuffer(str){
	var res=new Uint8Array(str.length);
	for(var i=0;i<str.length;i++)
		res[i]=str.charCodeAt(i);
	return res.buffer;
}

function arrayBuffer2String(buf){
	var res=new Array(buf.byteLength);
	var byteArr=new Uint8Array(buf);
	for(var i=0;i<byteArr.length;i++)
		res[i]=String.fromCharCode(byteArr[i]);
	return res.join("");
}

onmessage=function(evt){
	var uncompressed=evt.data;
	var compressed=JSZip.compressions.DEFLATE.compress(arrayBuffer2String(uncompressed));
	compressed=string2ArrayBuffer(compressed);
	//compressed=JSZipBase64.encode(compressed);
	postMessage(compressed);
};