/* global angular, controllers, baseURL, bootbox//= require_self */
//= require main/app
'use strict';

/* Route Controllers */
controllers.controller('RouteListCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
        $http({
        	method: 'GET',
        	url: '/route/getRoutes'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.routes = response.data;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	}
	load();
	
	$scope.startRoute = function(route){
		BusyIndicator.loading();
        $http({
        	method: 'POST',
        	url: '/route/startRoute',
			params: { id: route.id },
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
			var index = indexOf($scope.routes, route, 'id');
			$scope.routes[index] = response.data;
			LoadService.data = $scope.routes;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	};
	
	$scope.startAllRoutes = function(){
		BusyIndicator.loading();
        $http({
        	method: 'POST',
        	url: '/route/startAllRoutes',
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.routes = response.data;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	};
	
	$scope.suspendRoute = function(route){
		BusyIndicator.loading();
        $http({
        	method: 'POST',
        	url: '/route/suspendRoute',
			params: { id: route.id },
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
			var index = indexOf($scope.routes, route, 'id');
			$scope.routes[index] = response.data;
			LoadService.data = $scope.routes;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	};
	
	$scope.stopRoute = function(route){
		BusyIndicator.loading();
        $http({
        	method: 'POST',
        	url: '/route/stopRoute',
			params: { id: route.id },
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
			var index = indexOf($scope.routes, route, 'id');
			$scope.routes[index] = response.data;
			LoadService.data = $scope.routes;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	};
	
	$scope.suspend = function(){
		BusyIndicator.loading();
        $http({
        	method: 'POST',
        	url: '/route/suspend',
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.routes = response.data;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	};
	
	$scope.stop = function(){
		BusyIndicator.loading();
        $http({
        	method: 'POST',
        	url: '/route/stop',
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.routes = response.data;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	};
}]);