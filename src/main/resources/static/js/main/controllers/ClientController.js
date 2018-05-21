/* global angular, controllers, baseURL, TL, bootbox */
//= require_self
'use strict';

/* Client Controllers */
controllers.controller('SearchClientCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http',
		function(BusyIndicator, LoadService, Prompt, $scope, $http){
	$scope.searchParams = { client: {} };
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
	
	$scope.findClients = function(tabCtrl, max, offset){
		if ($('*:invalid').length > 0){ return; }
		BusyIndicator.loading();
		delete $scope.clientErrMsg;
		$http({
			method: 'GET',
			url: '/client/find',
			params: angular.extend({ max: max, offset: offset }, $scope.searchParams.client)
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
}]);

controllers.controller('ShowClientCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$filter',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $filter){
	var timeline = $('#timeline-panel');
	function load(){
		BusyIndicator.loading();
		LoadService.push($http({
			method: 'GET',
			url: '/client/getClient',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.client = response.data;
			LoadService.data.services = $scope.client.services;
			LoadService.data.medications = $scope.client.medications;
			LoadService.data.queueEntries = $scope.client.queueEntries;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		}));
		
		LoadService.push($http({
			method: 'GET',
			url: '/client/getTimeLine',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data.timeline = response.data.items;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		}));
		LoadService.q(BusyIndicator.hide);
	}
	load();

	$scope.timeLine = function(data){
		var visible = timeline.is(':visible'), events = [], config = {
			start_at_end: true,
			initial_zoom: 0,
			scale_factor: 0.5
		};
		if (!visible){ timeline.show(); }
		data.forEach(function(service){
			var text = '<table style="width: 500px; white-space: nowrap;">';
			text += '<tr><th style="width: 120px;">Date: </th><td>' + $filter('date')(service.date, 'MM/dd/yyyy h:mma') + '</td></tr>';
			if (service.program ){ text += '<tr><th>Program: </th><td>' + service.program  + '</td></tr>'; }
			if (service.location){ text += '<tr><th>Location: </th><td>' + service.location + '</td></tr>'; }
			if (service.contactType){ text += '<tr><th>Contact Type: </th><td>' + service.contactType + '</td></tr>'; }
			if (service.dx){ text += '<tr><th>Diagnosis: </th><td>' + service.dx + '</td></tr>'; }
			if (service.service){ text += '<tr><th>Service: </th><td>' + service.service + '</td></tr>'; }
			if (service.outcome){ text += '<tr><th>Outcome: </th><td>' + service.outcome + '</td></tr>'; }
			if (service.details){ text += '<tr><th>Details: </th><td>' + service.details + '</td></tr>'; }
			if (service.description){ text += '<tr><th>Description: </th><td>' + service.description + '</td></tr>'; }
			text += '</table>';
			var start_date = new Date(service.date),
				end_date = new Date(start_date.getTime() + service.duration),
				event = {
					start_date: {
						year: start_date.getFullYear(),
						month: start_date.getMonth(),
						day: start_date.getDate(),
						hour: start_date.getHours(),
						minute: start_date.getMinutes(),
						second: start_date.getSeconds(),
						millisecond: start_date.getMilliseconds(),
						display_date: $filter('date')(start_date, 'MMMM dd, yyyy h:mma')
					},
					end_date: {
						year: end_date.getFullYear(),
						month: end_date.getMonth(),
						day: end_date.getDate(),
						hour: end_date.getHours(),
						minute: end_date.getMinutes(),
						second: end_date.getSeconds(),
						millisecond: end_date.getMilliseconds(),
						display_date: $filter('date')(end_date, 'MMMM dd, yyyy h:mma')
					},
					text: { headline: service.label, text: text },
					group: service.group
				};
			events.push(event);
		});
		
		window.timeline = new TL.Timeline('timeline', { events: events }, config);
		if (!visible){ timeline.hide(); }
	};
	
	$scope.showTimeLine = function(){ timeline.show(); };
	$scope.hideTimeLine = function(){ timeline.hide(); };
	
	$scope.updateDisplay = function(){
		window.timeline.updateDisplay();
	};
}]);

controllers.controller('ClientManualMatchCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http',
		function(LoadService, BusyIndicator, Prompt, $scope, $http){
	$scope.searchParams = { bookinClient: {}, client: {} };
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
	
	$scope.findClient = function(tabCtrl){
		if ($('*:invalid').length > 0){ return; }
		BusyIndicator.loading();
		delete $scope.client;
		delete $scope.clients;
		$http({
			method: 'GET',
			url: '/client/find',
			params: angular.extend({ createdOnly: true, notMatched: true, max: 1 }, $scope.searchParams.bookinClient)
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.client = response.data;
			tabCtrl.setTab(2);
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.findClients = function(tabCtrl, max, offset){
		if ($('*:invalid').length > 0){ return; }
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/client/find',
			params: angular.extend({ max: max, offset: offset, gender: $scope.client.gender, excludeCreated: true }, $scope.searchParams.client)
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			
			$scope.clients = response.data.clients;
			$scope.max = Number(response.data.max);
			$scope.offset = Number(response.data.offset);
			$scope.total = Number(response.data.total);
			tabCtrl.setTab(2);
			
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			delete $scope.clients;
			Prompt(response.data);
		});
	};

	$scope.loadNext = function(tabCtrl){
		var max = Number($scope.max);
		var offset = Number($scope.offset);
		if (offset + max < $scope.total){
			offset += max;
		}
		$scope.findClients(tabCtrl, max, offset);
	};

	$scope.loadPrev = function(tabCtrl){
		var max = $scope.max;
		var offset = $scope.offset;
		if (offset - max >= 0){
			offset -= max;
		}
		$scope.findClients(tabCtrl, max, offset);
	};

	$scope.match = function(client){
		if ($scope.client){
	        bootbox.confirm('Match ' + $scope.client.name + ' Number:' + $scope.client.number + ' with ' + client.name + ' Number:' + client.number + '?', function(result){
				if (result){
					BusyIndicator.show("Matching");
					$http({
						method: 'PUT',
						url: '/clientPotentialMatch/match',
						params: { id: $scope.client.id },
	                    data: { client: { id: client.id } }
					}).then(function successCallback(response){
						console.log('%s: %s', response.config.method, response.config.url, response);
						BusyIndicator.hide();
						delete $scope.client;
						delete $scope.clients;
						$scope.searchParams = { bookinClient: {}, client: {} };
					}, function errorCallback(response){
						console.error('%s: %s', response.config.method, response.config.url, response);
						Prompt(response.data);
					});
				}
			});
		}
		else {
			Prompt("You must find a Bookin Client before matching.");
		}
	};
}]);