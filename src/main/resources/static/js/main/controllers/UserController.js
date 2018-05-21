/* global angular, controllers, baseURL, bootbox */
//= require_self
'use strict';

/* User Controllers */
controllers.controller('UserListCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $window){
	function load(){
		window.BusyIndicator = BusyIndicator;
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/user/list'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data.users = $scope.users = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.add = function(){
		$window.location.href = '/user/create';
	};

	$scope.search = function(){
		$window.location.href = '/user/search';
	};

	$scope.edit = function(id){
		$window.location.href = '/user/edit?id=' + id;
	};

	$scope.unlock = function(user){
		BusyIndicator.show("Unlocking");
		$http({
			method: 'PUT',
			url: '/directory/unlock',
			params: { id:  user.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			load();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.delete = function(user){
		var message = '<span>Are you sure you want to remove ';
		if (user.lastName && user.firstName){ message += user.lastName + ', ' + user.firstName; }
		else if (user.lastName){ message += user.lastName; }
		else if (user.firstName){ message += user.firstName; }
		else { message += user.username; }
		message += '?</span>';
		bootbox.dialog({
			title: 'Delete User ' +  user.username + '?',
			message: message,
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
							url: '/user/delete',
							params: { id:  user.id }
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

controllers.controller('SessionListCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http',
		function(BusyIndicator, LoadService, Prompt, $scope, $http){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/session/getSessions'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data.sessions = $scope.sessions = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.refresh = function(){
		load();
	};

	$scope.delete = function(session){
		bootbox.dialog({
			title: 'Remove User ' + session.username + "'s Session?",
			message: 
				'<span>'+
					'Are you sure you want to remove session ' + session.username + "'s Session?" +
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
								url: '/session/removeSession/',
								params: {
									username: session.username
								}
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
								$scope.sessions = response.data;
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

controllers.controller('NewUserCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http', '$window',
		function(BusyIndicator, Prompt, $scope, $http, $window){
	$scope.user = {};
	function load(){
		BusyIndicator.loading();
		$http({
            method: 'GET',
            url: '/agency/getAgencyList/'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
        	$scope.agencies = response.data;
        	BusyIndicator.hide();
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        });
	}
	load();

	$scope.save = function(){
		if (typeof $scope.user === 'undefined'){ return; }
		$scope.checkUsername(function(){
			BusyIndicator.show("Creating");
			if (typeof $scope.user.username === 'undefined' || $scope.user.username === ''){
				Prompt('Please enter a Username.');
			}
			else if (typeof $scope.usernameAvailable === 'undefined' || !$scope.usernameAvailable){
				Prompt('Please choose a different Username or Search for the user.');
			}
			else {
				$http({
					method: 'POST',
					url: '/user/save',
					data: $scope.user,
					xsrfCookieName: 'xsrf_token',
					xsrfHeaderName : 'xsrf_token'
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					BusyIndicator.hide();
					Prompt('Username: ' + $scope.user.username + '<br>' + 'Password: ' + htmlEncode(response.data), function(){
						$window.location.href = '/user/list';
					});
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					Prompt(response.data);
				});
			}
		});
	};

	$scope.reset = function(){
		delete $scope.usernameAvailable;
	};

	$scope.searchUser = function(){
		$window.location.href = '/user/search';
	};

	$scope.checkUsername = function(callback){
		if (typeof $scope.user === 'undefined' || typeof $scope.user.username === 'undefined' || $scope.user.username === ''){
			if (angular.isFunction(callback)){ callback(); }
			return;
		}

		BusyIndicator.show("Checking");
		$http({
			method: 'GET',
			url: '/directory/usernameAvailable/',
			params: { uid: $scope.user.username }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$scope.usernameAvailable = response.data === 'true';
			if (angular.isFunction(callback)){ callback(); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};
	
	function htmlEncode(value){
		return $('<div/>').text(value).html();
	}

	$scope.cancel = function(){
		$window.location.href = '/user/list';
	};
}]);

controllers.controller('SearchUserCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$q', '$window',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $q, $window){
	$scope.username = '';
	$scope.lastName = '';

	$scope.search = function(){
		if ($scope.username === '' && $scope.lastName === ''){
			Prompt("The search feild can not be empty. Please enter a value in the search box.");
		}
		else {
			BusyIndicator.loading();
			$http({
				method: 'GET',
				url: '/directory/search',
				params: { username: $scope.username, lastName: $scope.lastName }
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				LoadService.data = $scope.users = response.data;
				LoadService.notifyObservers(BusyIndicator.hide);
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				Prompt(response.data);
			});
		}
	};

	$scope.add = function(user){
		$http({
			method: 'POST',
			url: '/user/save',
			data: user,
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$window.location.href = '/user/edit/' + response.data.id;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.edit = function(user){
		$window.location.href = '/user/edit/' + user.id;
	};

	$scope.delete = function(user){
		bootbox.dialog({
			title: 'Delete User ' +  user.username + '?',
			message: 
				'<span>'+
					'Are you sure you want to remove ' + user.lastName + ', ' + user.firstName + '?' +
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
								url: '/user/delete',
								params: { id: user.id }
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

	$scope.cancel = function(){
		$window.location.href = '/user/list';
	};
}]);

controllers.controller('EditUserCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http', '$q', '$window', '$location',
		function(LoadService, BusyIndicator, Prompt, $scope, $http, $q, $window, $location){
//	var hist = document.referrer.toString().replace($window.location.origin + baseURL, '').replace(/(\d+)/g, '');
//	var id = document.referrer.toString().replace($window.location.origin + baseURL, '').replace(/(\D+)/g, '');
//	if (!(hist.match(/user\/list/i) || hist.match(/user\/search/i) || hist.match(/role\/listUsers\//i))){
//		hist = 'user/list';
//	}
//	hist += id;
//	var href = $window.location.pathname.indexOf('edit') > -1 ? baseURL + hist : baseURL;
	function load(){
		BusyIndicator.loading();
		var promiseArray = [];
        promiseArray.push($http({
            method: 'GET',
            url: '/user',
            params: { id:  $location.search().id }
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
        	$scope.user = response.data;
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        }));

        promiseArray.push($http({
        	method: 'GET',
        	url: '/agency/getAgencyList/'
        }).then(function successCallback(response){
        	console.log('%s: %s', response.config.method, response.config.url, response);
        	$scope.agencies = response.data;
        }, function errorCallback(response){
        	console.error('%s: %s', response.config.method, response.config.url, response);
        	Prompt(response.data);
        }));
        
        $q.all(promiseArray).then(function(){
        	BusyIndicator.hide();
        });
	}
	load();

	$scope.update = function(){
		BusyIndicator.show("Saving");
		$http({
			method: 'PUT',
			url: '/user/update',
			params: {
				id: $scope.user.id,
				firstName: $scope.user.firstName,
				middleName: $scope.user.middleName,
				lastName: $scope.user.lastName,
				phone: $scope.user.phone,
				email: $scope.user.email
			},
			data: $scope.user
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
//			$window.location.href = href;
			$window.location.href = '/users';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.lock = function(){
		BusyIndicator.show("Locking");
		$http({
			method: 'PUT',
			url: '/directory/lock',
			params: { id: $scope.user.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			load();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.unlock = function(){
		BusyIndicator.show("Unlocking");
		$http({
			method: 'PUT',
			url: '/directory/unlock',
			params: { id: $scope.user.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			load();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.resetPassword = function(){
		BusyIndicator.show("Generating Password");
		$http({
			method: 'PUT',
			url: '/directory/resetPassword',
			params: { id: $scope.user.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			load();
			Prompt('Username: ' + $scope.user.username + '<br>' + 'Password: ' + response.data);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.cancel = function(){
//		$window.location.href = href;
		$window.location.href = '/users';
	};
}]);

controllers.controller('UserManageCtrl', ['BusyIndicator', 'Prompt', '$scope', '$window', '$http',
		function(BusyIndicator, Prompt, $scope, $window, $http){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/user/getCurrentUser'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$scope.user = response.data;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.update = function(){
		BusyIndicator.show("Saving");
		$http({
			method: 'PUT',
			url: '/user/updateUser/',
			params: {
				firstName: $scope.user.firstName,
				middleName: $scope.user.middleName,
				lastName: $scope.user.lastName,
				phone: $scope.user.phone,
				email: $scope.user.email
			},
			data: $scope.user
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
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
		}, 3000);
	}

	$scope.cancel = function(){
		$window.location.href = baseURL;
	};
}]);

controllers.controller('ChangePasswordCtrl', ['BusyIndicator', 'Prompt', '$scope', '$window', '$http',
		function(BusyIndicator, Prompt, $scope, $window, $http){
	function load(){
		$http({
			method: 'GET',
			url: '/directory/getPasswordRequirements'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.passwordRequirements = response.data;
			$('#passwordRequirements').append($scope.passwordRequirements.policyList);
			$('#passwordRequirements > ul > li').prepend('<i class="" aria-hidden="true"></i>');
			
			$('#newPassword').bind('change keyup', function(){
				var password = $(this).val();
				var special = $scope.passwordRequirements.allowed.replace(/(\W)/g, "\\$1");
				var match;
				
				if (password.length >= $scope.passwordRequirements.minLength && password.length <= $scope.passwordRequirements.maxLength){
					$('#length').removeClass('text-danger').addClass('text-success');
					$('#length > i').removeClass('fa fa-times').addClass('fa fa-check');
				}
				else {
					$('#length').removeClass('text-success').addClass('text-danger');
					$('#length > i').removeClass('fa fa-check').addClass('fa fa-times');
				}
				
				var allowedPattern = new RegExp("[^A-Za-z0-9" + special + "]", "g");
				match = password.match(allowedPattern);
				if (match === null){
					$('#allowed').removeClass('text-danger').addClass('text-success');
					$('#allowed > i').removeClass('fa fa-times').addClass('fa fa-check');
				}
				else {
					$('#allowed').removeClass('text-success').addClass('text-danger');
					$('#allowed > i').removeClass('fa fa-check').addClass('fa fa-times');
				}

				match = password.match(/[A-Z]/g);
				if (match !== null && match.length >= $scope.passwordRequirements.uppercase){
					$('#uppercase').removeClass('text-danger').addClass('text-success');
					$('#uppercase > i').removeClass('fa fa-times').addClass('fa fa-check');
				}
				else {
					$('#uppercase').removeClass('text-success').addClass('text-danger');
					$('#uppercase > i').removeClass('fa fa-check').addClass('fa fa-times');
				}

				match = password.match(/[a-z]/g);
				if (match !== null && match.length >= $scope.passwordRequirements.lowercase){
					$('#lowercase').removeClass('text-danger').addClass('text-success');
					$('#lowercase > i').removeClass('fa fa-times').addClass('fa fa-check');
				}
				else {
					$('#lowercase').removeClass('text-success').addClass('text-danger');
					$('#lowercase > i').removeClass('fa fa-check').addClass('fa fa-times');
				}

				match = password.match(/[0-9]/g);
				if (match !== null && match.length >= $scope.passwordRequirements.number){
					$('#number').removeClass('text-danger').addClass('text-success');
					$('#number > i').removeClass('fa fa-times').addClass('fa fa-check');
				}
				else {
					$('#number').removeClass('text-success').addClass('text-danger');
					$('#number > i').removeClass('fa fa-check').addClass('fa fa-times');
				}

				var specialPattern = new RegExp("[" + special + "]", "g");
				match = password.match(specialPattern);
				if (match !== null && match.length >= $scope.passwordRequirements.special){
					$('#special').removeClass('text-danger').addClass('text-success');
					$('#special > i').removeClass('fa fa-times').addClass('fa fa-check');
				}
				else {
					$('#special').removeClass('text-success').addClass('text-danger');
					$('#special > i').removeClass('fa fa-check').addClass('fa fa-times');
				}
			});
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
	
	$scope.save = function(){
		BusyIndicator.show("Saving");
		if (typeof $scope.oldPassword === 'undefined' || typeof $scope.newPassword === 'undefined' || typeof $scope.passwordVerify === 'undefined' ||
				$scope.oldPassword.trim() === '' || $scope.newPassword.trim() === '' || $scope.passwordVerify.trim() === ''){
			Prompt("Please fill out all fields.");
		}
		else if (typeof $scope.passwordVerify !== 'undefined' && $scope.newPassword !== $scope.passwordVerify){
			Prompt("The passwords don't match.");
		}
		else {
			$http({
				method: 'PUT',
				url: '/user/updatePassword',
				data: {
					oldPassword: $scope.oldPassword.trim(),
					newPassword: $scope.newPassword.trim()
				}
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				saved();
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				if (response.status === 401 && response.data === 'Incorrect Password.<br>Your account has been locked.'){
					locked(response.data);
				}
				else {
					Prompt(response.data);
				}
			});
		}
	};
	
	function locked(message){
		BusyIndicator.hide();
		var dialog = bootbox.dialog({
			size: 'small',
			backdrop: true,
			closeButton: false,
			message: '<div style="text-align: center;"><span>' + message + '</span><br><span>Redirecting to Login...</span></div>'
		});
		
		$window.setTimeout(function(){
			dialog.modal('hide');
			$window.location.href = '/signOut';
		}, 2000);
	}

	function saved(){
		BusyIndicator.hide();
		var dialog = bootbox.dialog({
			size: 'small',
			backdrop: true,
			closeButton: false,
			message: '<div style="text-align: center;"><span>Saved</span><br><span>Redirecting to Login...</span></div>'
		});
		
		$window.setTimeout(function(){
			dialog.modal('hide');
			$window.location.href = '/signOut';
		}, 3000);
	}
}]);
