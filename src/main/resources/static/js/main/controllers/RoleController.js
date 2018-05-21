/* global angular, controllers, baseURL, bootbox */
//= require_self
'use strict';

/* Role Controllers */
controllers.controller('RoleListCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$window', '$location',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $window, $location){
	function load(){
		BusyIndicator.loading();
        $http({
        	method: 'GET',
        	url: '/role/list'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
        	for (var i in response.data){
        		if (response.data[i].name === 'User Administration'){
        			response.data[i].admin = true;
        			break;
        		}
        	}
        	LoadService.data = $scope.roles = response.data;
        	LoadService.notifyObservers(BusyIndicator.hide);
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	}
	load();

	$scope.listUsers = function(id){
		$window.location.href = '/role/listUsers/' + id;
	};

	$scope.addRole = function(){
		$window.location.href = '/role/create';
	};

	$scope.editRole = function(id){
//		$location.url('/role/edit').search('id', id).url();
		$window.location.href = '/role/edit?id=' + id;
	};

	$scope.deleteRole = function(role){
		var name = $("<div>").text(role.name).html();
		bootbox.dialog({
			title: 'Delete Role ' +  name + '?',
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
						className: "btn-danger",
						callback: function(){
							BusyIndicator.setMessage("Deleting");
							$http({
								method: 'DELETE',
								url: '/role/delete',
								params: { id:  role.id }
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
								BusyIndicator.hide();
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

controllers.controller('NewRoleCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http', '$window', function(BusyIndicator, Prompt, $scope, $http, $window){
	$scope.role = {};
	$scope.users = [];
	
	function load(){
		$http({
			method: 'GET',
			url: '/user/getUsers'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.avalibleUsers = response.data;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
	
	$scope.save = function(){
		BusyIndicator.show("Saving");
		$http({
			method: 'POST',
			url: '/role/save',
			data: $scope.role,
			params: { addUsers: $scope.users.map(function(item) { return item.id; }) },
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$window.location.href = '/role/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.cancel = function(){
		$window.location.href = '/role/list';
	};
}]);

controllers.controller('EditRoleCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http', '$q', '$window', '$location',
		function(LoadService, BusyIndicator, Prompt, $scope, $http, $q, $window, $location){
	var href = document.referrer.toString().replace($window.location.origin, '').replace(/(\d+)/g, ''), users = [], avalibleUsers = [];
	if (href.toUpperCase() !== String('/permission/list').toUpperCase()){ href = '/role/list'; }
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/role',
			params: { id:  $location.search().id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.role = response.data.role;
			$scope.users = response.data.users;
			$scope.avalibleUsers = response.data.avalibleUsers;
			
			angular.copy($scope.users, users);
			angular.copy($scope.avalibleUsers, avalibleUsers);
			
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
	
	$scope.save = function(){
		var tempUsers = [], tempAvalibleUsers = [];
		angular.copy($scope.users, tempUsers);
		angular.copy($scope.avalibleUsers, tempAvalibleUsers);
		
		for (var i = tempUsers.length - 1; i  >= 0; i--){
			if (indexOf(users, tempUsers[i]) > -1){ tempUsers.splice(i, 1); }
		}

		for (var i = tempAvalibleUsers.length - 1; i  >= 0; i--){
			if (indexOf(avalibleUsers, tempAvalibleUsers[i]) > -1){ tempAvalibleUsers.splice(i, 1); }
		}

		BusyIndicator.show("Saving");
		$http({
			method: 'PUT',
			url: '/role/update',
			params: {
				id:  $scope.id,
				addUsers: tempUsers.map(function(item) { return item.id; }),
				removeUsers: tempAvalibleUsers.map(function(item) { return item.id; })
			},
			data: $scope.role
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

controllers.controller('ListUserRoleCtrl', ['LoadService', 'Prompt', '$scope', '$http', '$window',
		function(LoadService, Prompt, $scope, $http, $window){
	var users = [], avalibleUsers = [];
	function load(){
		$http({
			method: 'GET',
			url: '/role/getRole',
			params: { id:  $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.role = response.data.role;
			$scope.users = response.data.users;
			$scope.avalibleUsers = response.data.avalibleUsers;
			
			angular.copy($scope.users, users);
			angular.copy($scope.avalibleUsers, avalibleUsers);
			LoadService.notifyObservers();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
	
	$scope.save = function(){
		var tempUsers = [], tempAvalibleUsers = [];
		angular.copy($scope.users, tempUsers);
		angular.copy($scope.avalibleUsers, tempAvalibleUsers);
		
		for (var i = tempUsers.length - 1; i  >= 0; i--){
			if (indexOf(users, tempUsers[i]) > -1){ tempUsers.splice(i, 1); }
		}

		for (var i = tempAvalibleUsers.length - 1; i  >= 0; i--){
			if (indexOf(avalibleUsers, tempAvalibleUsers[i]) > -1){ tempAvalibleUsers.splice(i, 1); }
		}
			
		$http({
			method: 'PUT',
			url: '/role/update',
			params: {
				id:  $scope.id ,
				addUsers: tempUsers.map(function(item) { return item.id; }),
				removeUsers: tempAvalibleUsers.map(function(item) { return item.id; })
			}
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			load();
			saved();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
	
	function saved(){
		var dialog = bootbox.dialog({
			size: 'small',
			backdrop: true,
			closeButton: false,
			message: '<div style="text-align: center;"><span>Saved</span></div>'
		});
		$window.setTimeout(function(){
			dialog.modal('hide');
			location.reload();
		}, 3000);
	}
	
	$scope.cancel = function(){
		$window.location.href = '/role/list';
	};
}]);
