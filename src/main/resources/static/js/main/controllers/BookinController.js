/*  global angular, controllers, baseURL, bootbox */
//= require_self
'use strict';

/* Bookin Controllers */
controllers.controller('BookinManualMatchCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$window', '$filter',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $window, $filter){
	$scope.searchParams = { bookin: {}, client: {} };
	function init(){
		var max = new Date();
		max.setYear(max.getFullYear() - 18);
		
		$("#from").datepicker({
			defaultDate: "-18y",
			maxDate: max,
			showButtonPanel: true,
			onClose: function(selectedDate){
				$("#to").datepicker("option", "minDate", selectedDate);
			}
		});
		
		$("#to").datepicker({
			defaultDate: "-18y",
			maxDate: max,
			showButtonPanel: true,
			onClose: function(selectedDate){
				$("#from").datepicker("option", "maxDate", selectedDate !== '' ? selectedDate : null);
			}
		});
	}
	
	function load(){
		$http({
			method: 'GET',
			url: '/navigation/getDropDownValues'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.genders = response.data.gender;
			$scope.ethnicities = response.data.ethnicity;
			init();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		});
	}
	load();
	
	$scope.findBookin = function(tabCtrl){
		if ($('*:invalid').length > 0){ return; }
		BusyIndicator.loading();
		delete $scope.bookin;
		delete $scope.clients;
		$http({
			method: 'GET',
			url: '/bookin/find',
			params: angular.extend({ hasQueueEntry: false, max: 1 }, $scope.searchParams.bookin)
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.bookin = response.data;
			BusyIndicator.hide();
			tabCtrl.setTab(2);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.findClients = function(tabCtrl, max, offset){
		if ($('*:invalid').length > 0){ return; }
		BusyIndicator.loading();
		delete $scope.clientErrMsg;
		$http({
			method: 'GET',
			url: '/client/find',
			params: angular.extend({ max: max, offset: offset, gender: $scope.bookin.gender}, $scope.searchParams.client)
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			
			$scope.max = Number(response.data.max);
			$scope.offset = Number(response.data.offset);
			$scope.total = Number(response.data.total);

			LoadService.data = $scope.clients = response.data.clients;
			LoadService.notifyObservers(BusyIndicator.hide);
			tabCtrl.setTab(2);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			delete $scope.clients;
			Prompt(response.data);
		});
	};

	$scope.loadNext = function(tabCtrl){
		var max = Number($scope.max);
		var offset = Number($scope.offset);
		if (offset + max < $scope.total){ offset += max; }
		$scope.findClients(tabCtrl, max, offset);
	};

	$scope.loadPrev = function(tabCtrl){
		var max = $scope.max;
		var offset = $scope.offset;
		if (offset - max >= 0){ offset -= max; }
		$scope.findClients(tabCtrl, max, offset);
	};

	$scope.createClient = function(){
		$http({
			method: 'POST',
			url: '/client/save',
			data: { bookin: $scope.bookin.id, id: $scope.id },
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/show/' + response.data.number;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.match = function(client){
		if ($scope.bookin){
			bootbox.confirm('Match ' + $filter('capitalize')($scope.bookin.name) + ' with ' + $filter('capitalize')(client.name) + '?', function(result){
				if (result){
					BusyIndicator.show("Matching");
					$http({
						method: 'POST',
						url: '/queueEntry/save',
						data: { bookin: $scope.bookin, client: client },
						params: { match: 'manual'},
						xsrfCookieName: 'xsrf_token',
						xsrfHeaderName : 'xsrf_token'
					}).then(function successCallback(response){
						console.log('%s: %s', response.config.method, response.config.url, response);
						BusyIndicator.hide();
						$window.location.href = '/show/' + response.data.id;
					}, function errorCallback(response){
						console.error('%s: %s', response.config.method, response.config.url, response);
						Prompt(response.data);
					});
				}
			});
		}
		else {
			Prompt("You must find a bookin before matching.");
		}
	};
}]);

controllers.controller('RematchCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$filter', '$window',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $filter, $window){
	$scope.searchParams = { bookin: {}, client: {} };
	function init(){
		var max = new Date();
		max.setYear(max.getFullYear() - 18);
		
		$("#from").datepicker({
			defaultDate: "-18y",
			maxDate: max,
			showButtonPanel: true,
			onClose: function(selectedDate){
				$("#to").datepicker("option", "minDate", selectedDate);
			}
		});
		
		$("#to").datepicker({
			defaultDate: "-18y",
			maxDate: max,
			showButtonPanel: true,
			onClose: function(selectedDate){
				$("#from").datepicker("option", "maxDate", selectedDate !== '' ? selectedDate : null);
			}
		});
	}
	
	function load(){
		BusyIndicator.loading();
		console.log($scope.number);
		$http({
			method: 'GET',
			url: '/navigation/getDropDownValues'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.genders = response.data.gender;
			$scope.ethnicities = response.data.ethnicity;
			init();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		});
		
		$http({
			method: 'GET',
			url: '/queueEntry/getQueueEntry',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.queueEntry = response.data;
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		});
	}
	load();
	
	$scope.findClients = function(tabCtrl, max, offset){
		if ($('*:invalid').length > 0){ return; }
		BusyIndicator.loading();
		delete $scope.clientErrMsg;
		$http({
			method: 'GET',
			url: '/client/find',
			params: angular.extend({ max: max, offset: offset, gender: $scope.queueEntry.bookin.gender, notID: $scope.queueEntry.client.id }, $scope.searchParams.client)
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			
			$scope.max = Number(response.data.max);
			$scope.offset = Number(response.data.offset);
			$scope.total = Number(response.data.total);

			LoadService.data = $scope.clients = response.data.clients;
			LoadService.notifyObservers(BusyIndicator.hide);
			tabCtrl.setTab(2);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			delete $scope.clients;
			Prompt(response.data);
		});
	};

	$scope.loadNext = function(tabCtrl){
		var max = Number($scope.max);
		var offset = Number($scope.offset);
		if (offset + max < $scope.total){ offset += max; }
		$scope.findClients(tabCtrl, max, offset);
	};

	$scope.loadPrev = function(tabCtrl){
		var max = $scope.max;
		var offset = $scope.offset;
		if (offset - max >= 0){ offset -= max; }
		$scope.findClients(tabCtrl, max, offset);
	};

	$scope.match = function(client){
		bootbox.confirm('Match ' + $filter('capitalize')($scope.queueEntry.bookin.name) + ' with ' + $filter('capitalize')(client.name) + '?', function(result){
			if (result){
				BusyIndicator.show("Matching");
				$http({
					method: 'PUT',
					url: '/bookin/updateMatch',
					params: { id: $scope.queueEntry.id },
					data: { client: client.id }
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					BusyIndicator.hide();
					$window.location.href = '/show/' + $scope.queueEntry.bookin.number;
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					Prompt(response.data);
				});
			}
		});
	};
}]);
