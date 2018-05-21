/* global angular, baseURL */
//= require bootstrap/js/ui-bootstrap-pagination-1.1.0.min
//= require main/controllers
//= require main/directives
//= require main/filters
//= require main/services
//= require_self
'use strict';

/* App Module */
var app = angular.module('stella', ['ui.bootstrap', 'ngRoute', 'controllers' , 'directives', 'filters', 'services']);

app.config(function($locationProvider, $httpProvider){
	$locationProvider.html5Mode({enabled: true, requireBase: false, rewriteLinks: false});
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.interceptors.push(function($q){
		return {
			'request': function(config) {
				// do something on success
				return config;
			},
			// optional method
			'requestError': function(rejection) {
				// do something on error
				return $q.reject(rejection);
			},
			// optional method
			'response': function(response) {
				// do something on success
//				console.log('%s: %s', response.config.method, response.config.url, response);
				return response;
			},
			// optional method
			'responseError': function(rejection) {
				// do something on error
//				console.error('%s: %s', rejection.config.method, rejection.config.url, rejection);
				return $q.reject(rejection);
			}
		};
	});
});

app.provider('apiUrl', {
	$get: function(){
		return '/api';
	}
});

app.provider('assetUrl', {
	$get: function(){
		return '/snippets';
	}
});

app.provider('validateUrl', {
	$get: function(){
		return '/validateLogin';
	}
});

app.provider('refreshUrl', {
	$get: function(){
		return '/refresh';
	}
});

app.provider('signOutUrl', {
	$get: function(){
		return '/signOut';
	}
});

app.provider('timeOutUrl', {
	$get: function(){
		return '/timeOut';
	}
});
