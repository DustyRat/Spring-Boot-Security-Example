/* global angular */
//= require main/app
//= require_self
'use strict';

/* Filters */
var filters = angular.module('filters', []);

filters.filter('yesNo', [function(){
    return function(input, nullValue){
    	if (typeof input === 'undefined' && typeof nullValue === 'undefined'){ return input; }
    	if ((typeof input === 'undefined' || input === null) && nullValue){ return nullValue; }
    	else if (typeof input === 'boolean'){ return input ? 'Yes' : 'No'; }
    	else if (typeof input === 'string'){ return input.toLowerCase() === 'true' ? 'Yes' : input.toLowerCase() === 'false' ? 'No' : input; }
    	else if (typeof input === 'number'){ return input === 1 ? 'Yes' : input === 0 ? 'No' : input; }
    	else { return input; }
    };
}]);

filters.filter('toBoolean', [function(){
    return function(input){
    	if (typeof input === 'undefined'){ return false; }
    	else if (typeof input === 'boolean'){ return input; }
    	else if (typeof input === 'string'){ return input.toLowerCase() === 'true' ? true : input.toLowerCase() === 'false' ? false : input; }
    	else if (typeof input === 'number'){ return input === 1 ? true : input === 0 ? false : input; }
    	else { return input; }
    };
}]);

filters.filter('capitalize', [function (){
	return function (input, format, separator){
		if (!input || (new RegExp(/[a-z]/).test(input) && new RegExp(/[A-Z]/).test(input))){
			return input;
		}
		else if (input.toUpperCase() === 'N/A' || input.toUpperCase() === 'NA'){
			return 'N/A';
		}
		
		format = format || 'all';
		separator = separator || ' ';
		if (format === 'first'){
			var output = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
			if (separator === ' '){
				return output;
			} else {
				return output.split(separator).join(' ');
			}
		} else {
			return input.split(separator).map(function(word){
				if (word.length === 2 && format === 'team'){
					return word.toUpperCase();
				} else {
					return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
				}
			}).join(' ');
		}
	};
}]);

filters.filter('startFrom', [function(){
    return function(input, start){
        if (input){
        	return input.slice(start);
		}
		return [];
    };
}]);

filters.filter('phone', [function (){
	return function (number){
		if (!number){ return ''; }

		number = String(number).replace(/\D+/g, '');

		// # (###) ###-#### ext.####+
		if (number.length === 10){
			return number.replace(/^(\d{3})(\d{3})(\d{4})$/g, "($1) $2-$3");
		}
		else if (number.length === 11){
			return number.replace(/^(\d{1})(\d{3})(\d{3})(\d{4})$/g, "$1 ($2) $3-$4");
		}
		else if (number.length === 14){
			return number.replace(/^(\d{3})(\d{3})(\d{4})(\d{4})$/g, "($1) $2-$3 ext. $4");
		}
		else if (number.length === 15){
			return number.replace(/^(\d{1})(\d{3})(\d{3})(\d{4})(\d{4})$/g, "$1 ($2) $3-$4 ext. $5");
		}
		else if (number.length > 15){
			return number.replace(/^(\d{1})(\d{3})(\d{3})(\d{4})(\d+)$/g, "$1 ($2) $3-$4 ext. $5");
		}
		else {
			return number;
		}
	};
}]);

filters.filter('fileSize', ['$filter', function ($filter) {
	return function (input) {
		if (!input){ return input; }
		var sufix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var count = 0;
		var number = input;
		while (number > 1024){
			number /= 1024;
			count++;
		}
		
		input = $filter('number')(number, 2).replace(/0+$/, '').replace(/\.$/,'') + ' ' + sufix[count];
		return input;
	};
}]);
