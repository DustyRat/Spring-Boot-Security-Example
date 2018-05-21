/* global angular, jQuery, Side, Momentum */
//= require_self
'use strict';

if (typeof jQuery !== 'undefined'){
	(function($){
		$('#spinner').ajaxStart(function(){
			$(this).fadeIn();
		}).ajaxStop(function(){
			$(this).fadeOut();
		});
	})(jQuery);
}

var browser = (function(){
	var userAgent = window.navigator.userAgent,
		temp,
		match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
	if (/trident/i.test(match[1])){
		temp =  /\brv[ :]+([\d\.]+)/g.exec(userAgent) || [];
		return { name: 'IE', version: temp[1] || '' };
	}
	if (match[1] === 'Chrome'){
		temp = userAgent.match(/\b(OPR|Edge)\/([\d\.]+)/);
		if (temp !== null){ return temp.slice(1).join(' ').replace('OPR', 'Opera'); }
	}
	match = match[2] ? [match[1], match[2]] : [window.navigator.appName, window.navigator.appVersion, '-?'];
	if ((temp = userAgent.match(/version\/([\d\.]+)/i)) !== null){ match.splice(1, 1, temp[1]); }
	return { name: match[0], version: match[1] };
})();
console.log(browser);

function setCookie(name, value, expiration, path){
    var date = new Date();
    date.setTime(date.getTime() + expiration);
    var expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=' + path ? path : '/';
};

function getCookie(name){
	name = name + "=";
    var cookies = document.cookie.split(';');
    for(var i in cookies) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' '){ cookie = cookie.substring(1); }
        if (cookie.indexOf(name) === 0){ return cookie.substring(name.length, cookie.length); }
    }
    return "";
};

function generateUUID(){
	var time = typeof performance !== 'undefined' && typeof performance.now === 'function' ? new Date().getTime() + performance.now() : new Date().getTime();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char){
		var rand = (time + Math.random() * 16) % 16 | 0;
		time = Math.floor(time / 16);
		return (char === 'x' ? rand : (rand & 0x3 | 0x8)).toString(16);
	});
};

function logTime(func){
	function getTime(){ return typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : new Date().getTime(); }
	var time = getTime();
	try { return func.apply(this, Array.prototype.slice.call(arguments, 1)); }
	finally { console.trace('%s(%o): %.2f ms', arguments[0].name, Array.prototype.slice.call(arguments, 1), getTime() - time); }
};

function indexOf(array, obj, key){
	if (!array || array.lenth === 0){ return -1; }
	for(var i = 0; i < array.length; i++){
		if (key && array[i].hasOwnProperty(key) && obj.hasOwnProperty(key) && angular.equals(array[i][key], obj[key])){ return i; }
		else if (angular.equals(array[i], obj)){ return i; }
	}
	return -1;
};

//Side._stopMetisMenu = function(){
//	$('.side-nav').find('li.active').toggleClass('active-mini');
//	$('.side-nav').find('li').removeClass('active');
//	$('.side-nav').find('a').attr('aria-expanded', false);
//	$('.side-nav').find('ul.collapse').removeClass('in').attr('aria-expanded', false);
//};

Momentum.clock($('[data-momentum="clock"]'));