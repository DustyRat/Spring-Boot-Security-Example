/* global angular, controllers, baseURL, bootbox */
//= require main/controllers/PermissionController
//= require_self
'use strict';

/* Status Controllers */
controllers.controller('StatusListCtrl', ['BusyIndicator', 'LoadService', 'Prompt', 'permissionService', '$scope', '$http', '$window',
		function(BusyIndicator, LoadService, Prompt, permissionService, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/status/getStatuses'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.statuses = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
   	
   	$scope.add = function(){
		$window.location.href = '/status/create';
	};
   	
   	$scope.edit = function(id){
   		$window.location.href = '/status/edit/' + id;
   	};
   	
   	$scope.toggle = function(status, key, bool){
		permissionService.toggleStatus(status, key, bool, function(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			load();
		}, function(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.delete = function(status){
		var name = $("<div>").text(status.name).html();
		bootbox.dialog({
			title: 'Delete Status Rule ' +  name + '?',
			message: 
				'<span>'+
					'Are you sure you want to remove ' + name + '?' +
				'</span>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					confirm: {
						label: "Delete",
						className: "btn-primary",
						callback: function(){
							$http({
								method: 'DELETE',
								url: '/status/delete',
								params: { id: status.id }
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
								load();
							}, function errorCallback(response){
								console.error('%s: %s', response.config.method, response.config.url, response);
								Prompt(response.data);
							});
						}
					}
				}
		});
	};
}]);

controllers.controller('NewStatusCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, Prompt, $scope, $http, $window){
	var href = document.referrer.toString().replace($window.location.origin, '').replace(/(\d+)/g, '');
	if (href.toUpperCase() !== String('/permission/list').toUpperCase()){
		href = '/status/list';
	}
	
   	$scope.status = {
   			name: '',
   			activities: [],
   			changeReasons: [],
   			permission: { isDefault: false, isEnabled: true },
   			multiple: false
   	};

	$scope.save = function(){
		var warning = false;
		if (!$scope.status.name){
			$("#warning2").show();
			warning = true;
		}
		else {
			$("#warning2").hide();
		}
		
		if (!warning){
			BusyIndicator.show("Saving");
			$http({
				method: 'POST',
				url: '/status/save',
				data: $scope.status,
				xsrfCookieName: 'xsrf_token',
				xsrfHeaderName : 'xsrf_token'
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				$window.location.href = href;
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				Prompt(response.data);
			});
		}
	};
	
	$scope.cancel = function(){
		$window.location.href = href;
	};
}]);

controllers.controller('EditStatusCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, Prompt, $scope, $http, $window){
	var href = document.referrer.toString().replace($window.location.origin, '').replace(/(\d+)/g, '');
	if (href.toUpperCase() !== String('/permission/list').toUpperCase()){
		href = '/status/list';
	}
	
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/status/getStatus',
			params: { id:  $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.status = response.data;
			$scope.disable = $scope.status.permission.isDefault;
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.save = function(){
		$http({
			method: 'PUT',
			url: '/status/update',
			params: { id:  $scope.status.id },
			data: $scope.status
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$window.location.href = href;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
	
	$scope.cancel = function(){
		$window.location.href = href;
	};
}]);
