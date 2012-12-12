var Navigator={};

(function(){
	var userAgent=window.navigator.userAgent;
	if(userAgent.match('MSIE'))
		Navigator.IE=userAgent.match(/MSIE ([\d.]+)/)[1];
	if(userAgent.match('Firefox'))
		Navigator.FireFox=userAgent.match(/Firefox\/([\d.]+)/)[1];
	if(userAgent.match('Opera'))
		Navigator.Opera=userAgent.match(/Opera.([\d.]+)/)[1];
	if(userAgent.match('Chrome'))
		Navigator.Chrome=userAgent.match(/Chrome\/([\d.]+)/)[1];
	else if(userAgent.match('Safari'))
		Navigator.Safari=userAgent.match(/Version\/([\d.]+)/)[1];
})();

Navigator.tooOld=function(){
	var tests=[
		function(){return window.localStorage && window.sessionStorage;},
		function(){return window.FileReader;},
		function(){return window.ArrayBuffer && window.Uint8Array;},
		function(){return window.Worker;},
		function(){return $('<input type="text"/>')[0].setCustomValidity;},
		function(){return window.WebSocket;}
	];
	return !tests.every(function(test){return !!test();});
};