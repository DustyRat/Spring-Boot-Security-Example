/* global angular, baseURL, bootbox */
//= require main/app
//= require_self
'use strict';

/* Controllers */
var controllers = angular.module('controllers', []);

controllers.controller('LogOutController', ['Timeout', '$scope', function(Timeout, $scope){
	$scope.LogOut = function(){ Timeout.signOut(); };
}]);

controllers.controller('NavController', [/*'Timeout', */'tabService', 'focusService', '$scope', '$http', '$window',
		function(/*Timeout, */tabService, focusService, $scope, $http, $window){
	var permissions = [];
	function load(){
		getInfo();
		getCounts();
	}
//	load();
	
	function getInfo(){
		$http({
			method: 'GET',
			url: '/auth/getAuthenticationInfo '
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.directory = response.data.directory;
			$scope.currentUser = response.data.user;
			permissions = $scope.currentUser.permissions;
			if (response.data.warning && $window.location.pathname !== '/changePassword'){
				prompt(response.data.warning, removeWarnings);
			}
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		});
	}

	function getCounts(){
		$http({
			method: 'GET',
			url: '/navigation/getCounts'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.queueEntries = response.data.queueEntries;
			$scope.potentialMatches = response.data.potentialMatches;
			$scope.clients = response.data.clients;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		});
	}

	function removeWarnings(){
		$http({
			method: 'DELETE',
			url: '/auth/removePasswordWarning'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		});
	}

	function prompt(warning, callback){
		var message = '';
		if (warning.timeBeforeExperation){ message += 'Your password will expire at ' + warning.timeBeforeExperation + '.<br>Please update your password.'; }
		else if (warning.graceLoginsRemaining){ message += 'Your password has expired.<br>You have ' + warning.graceLoginsRemaining + ' more login attempts before your account is locked.<br>Please change your password.'; }
		else if (warning.chargeAfterReset){ message += 'Your password has been reset. <br>Please update your password.'; }
		
		var buttons = {
			ok: {
				label: "OK",
				className: "btn-primary",
				callback: function(){
					if (angular.isFunction(callback)){ callback(); }
				}
			}
		};
		
		if (!$scope.directory.readOnly && $scope.directory.pwdPolicyEnabled){
			buttons.changePassword = {
				label: "Change Password",
				className: "btn",
				callback: function(){
					$window.location.href = '/changePassword';
				}
			};
		}
		
		bootbox.dialog({
			message: '<span>' + message + '</span>',
			onEscape: function(){
				if (angular.isFunction(callback)){ callback(); }
			},
			buttons: buttons
		});
	};
	
	this.isPermitted = function(permission){
		return permissions.indexOf(permission) > -1;
	};
	
	this.isPermittedAny = function(permissionsList){
		for (var i in permissionsList){ if (this.isPermitted(permissionsList[i])){ return true; } }
		return false;
	};
	
	this.isPermittedAll = function(permissionsList){
		for (var i in permissionsList){ if (!this.isPermitted(permissionsList[i])){ return false; } }
		return true;
	};

	this.clickNewNote = function(){
		tabService.setTab(3);
		focusService('noteTextInput');
	};

	this.logout = function(){ Timeout.signOut(); };
}]);

controllers.controller('TabController', [function(){
	var callbacks = {};
	this.tab = 1;
	this.setTab = function(tab){
		this.tab = tab;
		if (angular.isFunction(callbacks[tab])){ callbacks[tab](); }
	};
	this.isSet = function(tab){ return this.tab === tab; };
	this.registerCallback = function(tab, callback){ callbacks[tab] = callback; };
}]);

controllers.controller('ToggleCtrl', [function(){
	this.show = false;
	this.setToggle = function(object){
		if (object){ object.show = !object.show; }
		this.show = !this.show;
	};

	this.toggleAll = function(objects){
		this.show = !this.show;
		for (var i in objects){
			if (typeof objects[i] === 'object'){ objects[i].show = this.show; }
		}
	};
}]);
