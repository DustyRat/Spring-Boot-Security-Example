/* global angular, controllers, baseURL */
//= require_self
'use strict';

/* Activity Log Controllers */
controllers.controller('ActivityLogCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(LoadService, BusyIndicator, Prompt , $scope, $http, $window){
	function init(){
		var min =  new Date();
		var max = new Date();
		min.setYear(max.getFullYear() - 2);
		
		var start = new Date();
		start.setDate(start.getDate() - 14);
		var end = new Date();
		
		if (document.getElementById("from").value !== ""){
			start.setTime(new Date(document.getElementById("from").value));
		}
		
		if (document.getElementById("to").value !== ""){
			end.setTime(new Date(document.getElementById("to").value));
		}

		$("#from").datepicker({
			defaultDate: "-2w",
			minDate: min,
			maxDate: end,
			showButtonPanel: true,
			onClose: function(selectedDate){
				var date = new Date(selectedDate);
				if (end.getTime() - date.getTime() > 1000*60*60*24*15 - 1){
					start.setTime(date.getTime());
					end.setTime(date.getTime() + 1000*60*60*24*15 - 1);
				}
				$("#to").datepicker("option", "minDate", selectedDate);
				$("#to").datepicker("setDate", end);
			}
		});
		
		$("#to").datepicker({
			defaultDate: "",
			minDate: start,
			maxDate: max,
			showButtonPanel: true,
			onClose: function(selectedDate){
				var date = new Date(selectedDate);
				if (date.getTime() - start.getTime() > 1000*60*60*24*15 - 1){
					start.setTime(date.getTime() - 1000*60*60*24*14);
					end.setTime(date.getTime() + 1000*60*60*24 - 1);
				}
				$("#from").datepicker("option", "maxDate", selectedDate);
				$("#from").datepicker("setDate", start);
			}
		});
		
		$("#from").datepicker("setDate", start);
		$("#to").datepicker("setDate", end);
		load();
	}
	init();
	
	function load(max, offset){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/activityLog/getLogs',
			params: { max: max, offset: offset, start: $("#from").datepicker().val(), end: $("#to").datepicker().val() }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			
			$scope.max = response.data.max ;
			$scope.offset = response.data.offset;
			$scope.total = response.data.total;
			
			LoadService.data = $scope.logs = response.data.logs;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		});
	}
	
	$scope.findBookin = function(number){
		$http({
			method: 'GET',
			url: '/bookin/find',
			params: { hasQueueEntry: true, max: 1, number: number }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$window.location.href = '/show/' + response.data.queueEntry.id;
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
	
	$scope.findClient = function(number){
		$http({
			method: 'GET',
			url: '/client/find',
			params: { max: 1, number: number }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$window.location.href = '/client/show/' + response.data.id;
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.loadNext = function(){
		var max = Number($scope.max);
		var offset = Number($scope.offset);
		if (offset + max < $scope.total){
			offset += max;
		}
		load(max, offset);
	};

	$scope.loadPrev = function(){
		var max = $scope.max;
		var offset = $scope.offset;
		if (offset - max >= 0){
			offset -= max;
		}
		load(max, offset);
	};

	$scope.refresh = function(){
		load($scope.max, $scope.offset);
	};
}]);
