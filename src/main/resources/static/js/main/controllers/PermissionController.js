/* global angular, controllers, baseURL, _, bootbox */
//= require_self
'use strict';

/* Permission Controllers */
controllers.factory('permissionService', ['BusyIndicator', 'Prompt', '$http',
		function(BusyIndicator, Prompt, $http){
	this.permissions = [];
	this.siloPermissions = [];
	this.statusPermissions = [];
	this.notFound = [];
	var $this = this;

	this.toggleStatus = function(permission, key, bool, successCallback, errorCallback){
		var perm= {};
		perm[key] = bool;
		$http({
			method: 'PUT',
			url: '/status/update',
			params: { id: permission.status.id },
			data: { permission: perm }
		}).then(angular.isFunction(successCallback) ? successCallback : function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
		}, angular.isFunction(errorCallback) ? errorCallback : function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		});
	};

	this.checkPermission = function(permission, callback){
		BusyIndicator.show("Checking");
		$http({
			method: 'GET',
			url: '/permission/checkPermission/',
			params: { id: permission.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			if (angular.isFunction(callback)){ callback(response.data); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
	
	function mergePermission(oldPermissionID, newPermissionID, callback){
		BusyIndicator.setMessage("Merging");
		$http({
			method: 'POST',
			url: '/permission/merge/' + oldPermissionID,
			params: { newPermissionID: newPermissionID },
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			if (angular.isFunction(callback)){ callback(); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}

	function remove(permission, callback){
		BusyIndicator.setMessage("Deleting");
		$http({
			method: 'DELETE',
			url: '/permission/delete',
			params: { id:  permission.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			if (angular.isFunction(callback)){ callback(); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}

	this.mergePermission = function(permission, callback){
		function confirm(){
			var options = [], name = $("<div>").text(permission.name).html();
			var permissions = _.groupBy(_.sortBy($this.permissions, 'type'), 'type');
			for (var type in permissions){
				var perms = _.sortBy(permissions[type], 'name');
				options += '<optgroup label="' + $("<div>").text(type).html() + '">';
				for (var i in perms){
					options += '<option name="permission" value="' + perms[i].id + '">' + $("<div>").text(perms[i].name).html() + '</option>';
				}
				options += '</optgroup>';
			}
			bootbox.dialog({
				title: 'Merge ' +  name,
				message:
					'<div style="padding: 10px; display: inline-block;  width: 100%;">' +
						'<label class="col-md-3 control-label" for="permission">Permissions:</label>' +
						'<select class="col-md-9">' +
							'<option name="permission" value="">-Select-</option>' +
							options +
						'</select>' +
					'</div>',
					buttons: {
						cancel: {
							label: "Cancel",
							className: "btn-cancel"
						},
						confirm: {
							label: "Merge",
							className: "btn-primary",
							callback: function(){
								var newPerm= {}, selection = $("select>optgroup>option[name=permission]:selected");
								for (var i in $this.permissions){
									if ($this.permissions[i].id === selection.val()){
										newPerm = $this.permissions[i];
										break;
									}
								}
								
								bootbox.confirm("Are you sure? <br>"+ 
										'<table class="table table-striped">'+
											'<thead>'+
												'<tr><td></td><th>Name</th><th>permissionString</th></tr>'+
											'</thead>'+
											'<tbody>'+
												'<tr><th>Old Permission</th><td>' + $("<div>").text(permission.name).html() + '</td><td>' + $("<div>").text(permission.permissionString).html() + '</td></tr>'+
												'<tr><th>New Permission</th><td>' + $("<div>").text(newPerm.name).html() + '</td><td>' + $("<div>").text(newPerm.permissionString).html() + '</td></tr>'+
											'</tbody>'+
										'</table>', 
										function(result){
									if (result){
										BusyIndicator.show("Checking");
										mergePermission(permission.id, newPerm.id, callback);
									}
									else {
										confirm();
									}
								}); 
							}
						}
					}
			});
		}
		confirm();
	};
	
	this.deletePermission = function(permission, callback){
		$this.checkPermission(permission, function(data){
			permission = data;
			var assignedRoles = '';
			function confirm(){
				var name = $("<div>").text(permission.name).html();
				if (assignedRoles !== ''){
					bootbox.dialog({
						title: 'Delete ' + name + ' is currently assigned to:',
						message: 
							assignedRoles,
							buttons: {
								cancel: {
									label: "Cancel",
									className: "btn-cancel"
								},
								confirm: {
									label: "Unassign and Delete",
									className: "btn-primary",
									callback: function(){
										BusyIndicator.show();
										remove(permission, callback);
									}
								}
							}
					});
				}
				else {
					bootbox.dialog({
						title: name,
						message: "Delete this permission?",
						buttons: {
							cancel: {
								label: "Cancel",
								className: "btn-cancel"
							},
							confirm: {
								label: "Delete",
								className: "btn-primary",
								callback: function(){
									BusyIndicator.show();
									remove(permission, callback);
								}
							}
						}
					});
				}
			}
			
			for (var i in permission.roles){
				assignedRoles += $("<div>").text(permission.roles[i].name).html();
				if (i < permission.roles.length - 1){ assignedRoles += ', '; }
			}

			confirm();
		});
	};
	
	return this;
}]);

controllers.controller('permissionListCtrl', ['BusyIndicator', 'LoadService', 'onLoadService', 'Prompt', 'permissionService', '$scope', '$http', '$window', '$filter',
		function(BusyIndicator, LoadService, onLoadService, Prompt, permissionService, $scope, $http, $window, $filter){
	function load(){
		$http({
			method: 'GET',
			url: '/permission/getPermissions/'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.permissions = $filter('orderBy')(response.data.permissions, "name", false);
			for (var i in $scope.permissions){
				$scope.permissions[i].roleNames = $scope.permissions[i].roles.map(function(item) { return item.name; });
			}
			
			$scope.siloPermissions = $filter('orderBy')(response.data.siloPermissions, "name", false);
			for (var i in $scope.siloPermissions){
				$scope.siloPermissions[i].roleNames = $scope.siloPermissions[i].roles.map(function(item) { return item.name; });
			}
			
			$scope.statusPermissions = $filter('orderBy')(response.data.statusPermissions, "name", false);
			for (var i in $scope.statusPermissions){
				$scope.statusPermissions[i].roleNames = $scope.statusPermissions[i].roles.map(function(item) { return item.name; });
			}
			
			$scope.notFound = $filter('orderBy')(response.data.notFound, "name", false);
			for (var i in $scope.notFound){
				$scope.notFound[i].roleNames = $scope.notFound[i].roles.map(function(item) { return item.name; });
			}

			LoadService.data.permissions = permissionService.permissions = $scope.permissions;
			LoadService.data.siloPermissions = permissionService.siloPermissions = $scope.siloPermissions;
			LoadService.data.statusPermissions = permissionService.statusPermissions = $scope.statusPermissions;
			LoadService.data.notFound = permissionService.notFound = $scope.notFound;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}

	onLoadService.addLoadEvent(function(){
		BusyIndicator.loading();
		load();
	});
	
	$scope.mergePermission = function(permission){
		permissionService.mergePermission(permission, load);
	};
	
	$scope.deletePermission = function(permission){
		permissionService.deletePermission(permission, load);
	};
	
	$scope.toggleStatus = function(status, key, bool){
		BusyIndicator.show("Updating");
		permissionService.toggleStatus(status, key, bool, function(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			load();
		}, function(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
	
	$scope.addStatus = function(){
		$window.location.href = '/status/create';
	};

	$scope.editStatus = function(permission){
		$window.location.href = '/status/edit/' + permission.status.id;
	};
}]);
