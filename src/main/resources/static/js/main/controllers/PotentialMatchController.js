/* global angular, controllers, baseURL */
//= require_self
'use strict';

/* Bookin Potential Match Controllers */
controllers.controller('BookinPotentialMatchListCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http',
		function(LoadService, BusyIndicator, Prompt, $scope, $http){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/bookin/potentialMatch/getPotentialMatches'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.potentialMatches = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
}]);

controllers.controller('BookinPotentialMatchShowCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(LoadService, BusyIndicator, Prompt, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/bookin/potentialMatch/getPotentialMatch',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.potentialMatch = response.data.potentialMatch;
			$scope.bookin = response.data.bookin;
			LoadService.data = $scope.candidates = response.data.candidates;
			LoadService.notifyObservers(BusyIndicator.hide());
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.compare = function(client){
		$window.location.href = '/bookin/potentialMatch/show/' + $scope.id + "&" + client.id;
	};

	$scope.match = function(client){
		BusyIndicator.show("Matching");
		$http({
			method: 'POST',
			url: '/queueEntry/save',
			data: { bookin: $scope.bookin, client: client },
			params: { match: 'potential'},
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/bookin/potentialMatch/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
	
	$scope.noMatches = function(){
		BusyIndicator.show("Flagging No Match");
		$http({
			method: 'PUT',
			url: '/bookin/potentialMatch/noMatches',
			params: {id: $scope.potentialMatch.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/bookin/potentialMatch/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
}]);

controllers.controller('BookinPotentialMatchCompareCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, Prompt, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/bookin/potentialMatch/getMatchDetails',
			params: { id: $scope.id, candidateID: $scope.candidateID }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.potentialMatch = response.data.potentialMatch;
			$scope.bookin = response.data.bookin;
			$scope.client = response.data.client;
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.match = function(){
		BusyIndicator.show("Matching");
		$http({
			method: 'POST',
			url: '/queueEntry/save',
			data: { bookin: $scope.bookin, client: $scope.client },
			params: { match: 'potential'},
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/bookin/potentialMatch/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
}]);

controllers.controller('ClientPotentialMatchListCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http',
		function(LoadService, BusyIndicator, Prompt, $scope, $http){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/client/potentialMatch/getPotentialMatches'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.potentialMatches = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
}]);

controllers.controller('ClientPotentialMatchShowCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(LoadService, BusyIndicator, Prompt, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/client/potentialMatch/getPotentialMatch',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.potentialMatch = response.data.potentialMatch;
			$scope.bookin = response.data.bookin;
			LoadService.data = $scope.candidates = response.data.candidates;
			LoadService.notifyObservers(BusyIndicator.hide());
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.match = function(candidate){
		var message = 'Match with ' + candidate.source + ' Client ' + candidate.number + ': ' + candidate.name + '?';
		bootbox.confirm(message, function(result){
			if (result){
				BusyIndicator.show("Matching");
				$http({
					method: 'PUT',
					url: '/client/potentialMatch/match',
					params: { id: $scope.potentialMatch.id },
					data: { client: candidate.id }
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					BusyIndicator.hide();
					$window.location.href = '/client/potentialMatch/list';
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					Prompt(response.data);
				});
			}
		});
	};
	
	$scope.noMatches = function(){
		BusyIndicator.show("Flagging No Match");
		$http({
			method: 'PUT',
			url: '/client/potentialMatch/noMatches',
			params: {id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/client/potentialMatch/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
}]);

controllers.controller('ClientPotentialMatchCompareCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, Prompt, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/client/potentialMatch/getMatchDetails',
			params: { id: $scope.id, candidateID: $scope.params.candidateID }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.potentialMatch = response.data.potentialMatch;
			$scope.bookin = response.data.bookin;
			$scope.client = response.data.client;
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.match = function(){
		BusyIndicator.show("Matching");
		$http({
			method: 'PUT',
			url: '/client/potentialMatch/match',
			params: { id: $scope.potentialMatch.id },
			data: { client: $scope.client.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/client/potentialMatch/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
}]);
