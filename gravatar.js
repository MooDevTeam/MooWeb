var Gravatar={};

Gravatar.get=function(email,size){
	email=email.replace(/\s/g,'').toLowerCase();
	var md5=MD5.hex_md5(email);
	var url='http://www.gravatar.com/avatar/'+md5+'.jpg?d=mm';
	if(size!==undefined){
		url+='&s='+size;
	}
	return url;
};

Gravatar.nobody=function(size){
	var url= "http://www.gravatar.com/avatar/?d=retro";
	if(size!==undefined){
		url+='&s='+size;
	}
	return url;
};