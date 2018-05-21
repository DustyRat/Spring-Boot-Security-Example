/* global angular, controllers, baseURL, bootbox, _ */
//= require_self
'use strict';

/* Controllers */
controllers.factory('AgencyService', ['BusyIndicator', 'Prompt', '$http',
		function(BusyIndicator, Prompt, $http){
	var program = {
			name: '',
			silo: '',
			permission: { name: '', permissionString: '' },
			_name: function(newValue) {
				this.permission.name = arguments.length ? (this.name = newValue) : this.name;
				return arguments.length ? (this.name = newValue) : this.name;
			},
			_silo: function(newValue) {
				this.permission.permissionString = arguments.length ? (this.silo = newValue) : this.silo;
				return arguments.length ? (this.silo = newValue) : this.silo;
			}
	};
	
	function checkAgency(agency, callback){
		BusyIndicator.show("Checking Agency");
		$http({
			method: 'GET',
			url: '/agency/check',
			params: { name: agency.name, npi: agency.npi }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			checkPrograms(agency.programs, callback);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	
	function checkPrograms(programs, callback){
		BusyIndicator.show("Checking Programs");
		for (var i in programs){
			if (programs[i].name === '' || programs[i].silo === ''){
				Prompt('Please fill out all feilds under each program.');
				return;
			}
		}
		
		$http({
			method: 'GET',
			url: '/agency/checkPrograms',
			params: {
				name: programs.map(function(item){ return item.name; }),
				silo: programs.map(function(item){ return item.silo; })
			}
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			if (angular.isFunction(callback)){ callback(response); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	
	function setAgency(agency){
		program = angular.extend({ agency: { id: agency.id } }, program);
	}
	
	function addProgram(array){
		if (array === undefined){ array = []; }
		array.push(angular.copy(program));
	}

	function removeProgram(array, index){
		array.splice(index, 1);
	}

	function markForDelete(array, id){
		var index = array.indexOf(id);
		if (index > -1){ array.splice(index, 1); }
		else array.push(id);
	}
	
	function isMarked(array, item){
		return array.indexOf(item.id) > -1;
	}

	function isDirty(program1, program2){
		return !angular.equals(program1, program2);
	};
	
	return {
		checkAgency: checkAgency,
		checkPrograms: checkPrograms,
		setAgency: setAgency,
		addProgram: addProgram,
		removeProgram: removeProgram,
		markForDelete: markForDelete,
		isMarked: isMarked,
		isDirty: isDirty 
	};
}]);

controllers.controller('AgencyListCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/agency/getAgencies/'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.agencies = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.addAgency = function(){
		$window.location.href = '/agency/create';
	};

	$scope.editAgency = function(id){
		$window.location.href = '/agency/edit/' + id;
	};

	$scope.deleteAgency = function(agency){
		var name = $("<div>").text(agency.name ).html();
		bootbox.dialog({
			title: 'Delete Agency ' +  name + '?',
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
							BusyIndicator.show("Deleting");
							$http({
								method: 'DELETE',
								url: '/agency/delete',
								params: { id:  agency.id }
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

controllers.controller('NewAgencyCtrl', ['AgencyService', 'BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(AgencyService, BusyIndicator, Prompt, $scope, $http, $window){
	$scope.agency = {
			name: '',
			npi: '',
			contactName: '',
			contactPhone: '',
			contactEmail: '',
			address: '',
			city: '',
			state: '',
			zip: '',
			programs: []
	};
	
	$scope.users = [];
	var avalibleUsers;
	
	function load(){
		$http({
			method: 'GET',
			url: '/agency/getAvalibleUsers'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.avalibleUsers = response.data;
			avalibleUsers = angular.copy(response.data);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
	
	$scope.addProgram = function(){
		AgencyService.addProgram($scope.agency.programs);
	};

	$scope.removeProgram = function(index){
		AgencyService.removeProgram($scope.agency.programs, index);
	};

	$scope.saveAgency = function(){
		var agency = angular.copy($scope.agency);
		agency.programs = agency.programs.filter(function(elem) { return elem.name !== '' || elem.silo !== ''; });
		AgencyService.checkAgency(agency, function(){
			BusyIndicator.show("Saving");
			$http({
				method: 'POST',
				url: '/agency/save',
				data: agency,
				params: { addUsers: $scope.users.map(function(item) { return item.id; }) },
				xsrfCookieName: 'xsrf_token',
				xsrfHeaderName : 'xsrf_token'
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				$window.location.href = '/agency/list';
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				Prompt(response.data);
			});
		});
	};

	$scope.cancel = function(){
		$window.location.href = '/agency/list';
	};
}]);

controllers.controller('EditAgencyCtrl', ['AgencyService', 'BusyIndicator', 'Prompt', '$scope', '$http', '$q', '$window', '$filter',
		function(AgencyService, BusyIndicator, Prompt, $scope, $http, $q, $window, $filter){
	$scope.newPrograms = [];
	var deletePrograms = [], agency, users, avalibleUsers;
	function load(){
		$http({
			method: 'GET',
			url: '/agency/getAgency',
			params: { id:  $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.agency = response.data.agency;
			$scope.agency.programs = $filter('orderBy')($scope.agency.programs, 'name', false);
			$scope.users = response.data.users;
			$scope.avalibleUsers = response.data.avalibleUsers;

			agency = angular.copy(response.data.agency);
			users = angular.copy(response.data.users);
			avalibleUsers = angular.copy(response.data.avalibleUsers);
			
			AgencyService.setAgency($scope.agency);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.addProgram = function(){
		AgencyService.addProgram($scope.newPrograms);
		console.log($scope.newPrograms);
	};

	$scope.removeProgram = function(index){
		AgencyService.removeProgram($scope.newPrograms, index);
	};

	$scope.markForDelete = function(id){
		AgencyService.markForDelete(deletePrograms, id);
	};
	
	$scope.isMarked = function(item){
		return AgencyService.isMarked(deletePrograms, item);
	};

	$scope.isDirty = function(program, index){
		return AgencyService.isDirty(agency.programs[index], program);
	};

	$scope.save = function(){
		var agency = angular.copy($scope.agency);
		agency.programs = _.difference(agency.programs, deletePrograms);
		Array.prototype.push.apply(agency.programs, $scope.newPrograms);
		agency.programs = agency.programs.filter(function(elem) { return elem.name !== '' && elem.silo !== ''; });
		BusyIndicator.show("Saving");
		$http({
			method: 'PUT',
			url: '/agency/update',
			params: { 
				id: $scope.agency.id,
				addUsers: _.difference($scope.users, users, 'id').map(function(item) { return item.id; }),
				removeUsers: _.difference($scope.avalibleUsers, avalibleUsers, 'id').map(function(item) { return item.id; }),
				removePrograms: deletePrograms
			},
			data: agency
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$window.location.href = '/agency/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.cancel = function(){
		$window.location.href = '/agency/list';
	};
}]);

controllers.controller('AgencyManageCtrl', ['AgencyService', 'BusyIndicator', 'Prompt', '$scope', '$q', '$http', '$window', '$filter',
		function(AgencyService, BusyIndicator, Prompt, $scope, $q, $http, $window, $filter){
	$scope.newPrograms = [];
	var deletePrograms = [], agency, users, avalibleUsers;
	function load(){
		$http({
			method: 'GET',
			url: '/agency/getCurrentAgency'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.agency = response.data.agency;
			$scope.agency.programs = $filter('orderBy')($scope.agency.programs, 'name', false);
			$scope.users = response.data.users;
			$scope.avalibleUsers = response.data.avalibleUsers;

			agency = angular.copy(response.data.agency);
			users = angular.copy(response.data.users);
			avalibleUsers = angular.copy(response.data.avalibleUsers);

			AgencyService.setAgency($scope.agency);

			$scope.newPrograms = [];
			deletePrograms = [];
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.addProgram = function(){
		AgencyService.addProgram($scope.newPrograms);
	};

	$scope.removeProgram = function(index){
		AgencyService.removeProgram($scope.newPrograms, index);
	};

	$scope.markForDelete = function(id){
		AgencyService.markForDelete(deletePrograms, id);
	};
	
	$scope.isMarked = function(item){
		return AgencyService.isMarked(deletePrograms, item);
	};

	$scope.isDirty = function(program, index){
		return AgencyService.isDirty(agency.programs[index], program);
	};
	
	$scope.save = function(){
		var agency = angular.copy($scope.agency);
		agency.programs = _.difference(agency.programs, deletePrograms);
		Array.prototype.push.apply(agency.programs, $scope.newPrograms);
		agency.programs = agency.programs.filter(function(elem) { return elem.name !== '' && elem.silo !== ''; });
		BusyIndicator.show("Saving");
		$http({
			method: 'PUT',
			url: '/agency/update',
			params: { 
				id: $scope.agency.id,
				addUsers: _.difference($scope.users, users, 'id').map(function(item) { return item.id; }),
				removeUsers: _.difference($scope.avalibleUsers, avalibleUsers, 'id').map(function(item) { return item.id; }),
				removePrograms: deletePrograms
			},
			data: agency
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
		BusyIndicator.hide();
		var dialog = bootbox.dialog({
			size: 'small',
			backdrop: true,
			closeButton: false,
			message: '<span style="display: block; width: 22%; margin: 0 auto">Saved</span>'
		});
		$window.setTimeout(function(){ dialog.modal('hide'); }, 3000);
	}

	$scope.cancel = function(){
		$window.location.href = baseURL;
	};
}]);
