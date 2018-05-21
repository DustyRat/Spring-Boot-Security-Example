/* global controllers, baseURL, bootbox */
//= require_self
'use strict';

/* Jimi Activity Controllers */
controllers.controller('MaintenanceCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http',
	function(BusyIndicator, LoadService, Prompt, $scope, $http){
	function load(){
		BusyIndicator.loading();
		LoadService.push($http({
			method: 'GET',
			url: '/maintenance/getCounts'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
//			LoadService.data.SSNByCount = $scope.SSNByCount = response.data;
			LoadService.data = $scope.counts = response.data;
			LoadService.notifyObservers();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		}));

//		LoadService.push($http({
//			method: 'GET',
//			url: '/maintenance/LCNToSSN'
//		}).then(function successCallback(response){
//			console.log('%s: %s', response.config.method, response.config.url, response);
//			LoadService.data.LCNToSSN = $scope.LCNToSSN = response.data;
//			LoadService.notifyObservers();
//		}, function errorCallback(response){
//			console.error('%s: %s', response.config.method, response.config.url, response);
//			Prompt(response.data);
//		}));
//		
//		LoadService.push($http({
//			method: 'GET',
//			url: '/maintenance/CreatedToCreated'
//		}).then(function successCallback(response){
//			console.log('%s: %s', response.config.method, response.config.url, response);
//			LoadService.data.CreatedToCreated = $scope.CreatedToCreated = response.data;
//			LoadService.notifyObservers();
//		}, function errorCallback(response){
//			console.error('%s: %s', response.config.method, response.config.url, response);
//			Prompt(response.data);
//		}));
	   
		LoadService.q(function(){
			BusyIndicator.hide();
		});
	}
	load();
	
	$scope.uncheck = function(obj, index){
		if (obj && obj[index]){ delete obj[index]; }
	}
	
	$scope.confirm = function(array, item){
		var id = [], action = this.dataKey;
		for (var i in item.merge){ id.push(item.merge[i].id); }
		console.log('confirm: %o', {action: action, array: array, item: item, master: item.master.id, id: id});
		if (item.clients.length - 1 !== id.length){
			bootbox.dialog({
				title: 'Ignore unselected clients?',
				message: 'There are ' +  (item.clients.length - 1 - id.length) + ' unselected clients, would you like to add them to the ignore list?',
				buttons: {
					cancel: {
						label: "No",
						className: "btn-danger",
						callback: function(){
							merge(array, item, item.master.id, id);
						}
					},
					confirm: {
						label: "Yes",
						className: "btn-success",
						callback: function(){
							var _ignore = [], clients = Object.values(item.clients);
							for (var i in clients){ _ignore.push(clients[i].id); }
							_ignore = _.difference(_ignore, id);
							var index = _ignore.indexOf(item.master);
							if (index > -1){ _ignore.splice(index , 1); }
							ignore(action, 'ssn', item.ssn, _ignore.length + 1, function(){
								merge(array, item, item.master, id);
							});
						}
					}
				}
			});
		}
		else { merge(array, item, item.master, id); }
	}
	
	function merge(array, item, master, id){
		console.log('merge: %o', {array: array, item: item, master: master, id: id});
//		$http({
//			method: 'POST',
//			url: '/maintenance/merge',
//			params: { master: master, id: id}
//		}).then(function successCallback(response){
//			console.log('%s: %s', response.config.method, response.config.url, response);
			remove(array, item);
//			removeAll(id);
			refresh();
//		}, function errorCallback(response){
//			console.error('%s: %s', response.config.method, response.config.url, response);
//			Prompt(response.data);
//		});
	}
	
	function refresh(){
//		LoadService.data.CreatedToCreated = $scope.CreatedToCreated;
//		LoadService.data.LCNToSSN = $scope.LCNToSSN;
//		LoadService.data.SSNByCount = $scope.SSNByCount;
		LoadService.data = $scope.counts;
		LoadService.notifyObservers();
		$scope.$applyAsync();
	}
	
	function remove(array, item){
		var index = array.indexOf(item);
		if (index > -1){ array.splice(index, 1); }
	}
	
	function removeAll(id){
//		for (var i = $scope.CreatedToCreated.length - 1; i >= 0; i--){
//			for (var k = id.length - 1; k >= 0; k--){
//				var index = indexOf($scope.CreatedToCreated[i].clients, { id: id[k] }, 'id');
//				if (index > -1){ $scope.CreatedToCreated[i].clients.splice(index, 1); }
//			}
//			if ($scope.CreatedToCreated[i].clients.length < 2){ $scope.CreatedToCreated.splice(i ,1); }
//		}
//		for (var i = $scope.LCNToSSN.length - 1; i >= 0; i--){
//			for (var k = id.length - 1; k >= 0; k--){
//				var index = indexOf($scope.LCNToSSN[i].clients, { id: id[k] }, 'id');
//				if (index > -1){ $scope.LCNToSSN[i].clients.splice(index, 1); }
//			}
//			if ($scope.LCNToSSN[i].clients.length < 2){ $scope.LCNToSSN.splice(i ,1); }
//		}
//		for (var i = $scope.SSNByCount.length - 1; i >= 0; i--){
//			for (var k = id.length - 1; k >= 0; k--){
//				var index = indexOf($scope.SSNByCount[i].clients, { id: id[k] }, 'id');
//				if (index > -1){ $scope.SSNByCount[i].clients.splice(index, 1); }
//			}
//			if ($scope.SSNByCount[i].clients.length < 2){ $scope.SSNByCount.splice(i ,1); }
//		}
	}
	
	function ignore(type, field, value, count, callback){
		console.log('ignore: %o', {type: type, field: field, value: value, count: count, callback: callback});
//		$http({
//			method: 'POST',
//			url: '/maintenance/ignore',
//			data: { type: type, field: field, value: value, count: count || 0 }
//		}).then(function successCallback(response){
//			console.log('%s: %s', response.config.method, response.config.url, response);
			if (angular.isFunction(callback)){ callback(); }
//		}, function errorCallback(response){
//			console.error('%s: %s', response.config.method, response.config.url, response);
//			Prompt(response.data);
//		});
	}
	
	$scope.ignore = function(array, item){
		ignore(this.dataKey, 'ssn', item.ssn, item.clients.length, function(response){
			remove(array, item);
			refresh();
		});
	}
	
	$scope.resetMatch = function(item){
		delete item.merge;
		delete item.master;
	}
}]);
