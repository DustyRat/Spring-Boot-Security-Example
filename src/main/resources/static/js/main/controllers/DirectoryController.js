/* global angular, controllers, baseURL, bootbox */
//= require_self
'use strict';

/* User Controllers */
controllers.controller('PwdPolicyCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$q', '$window',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $q, $window){
	var href = document.referrer.toString().replace($window.location.origin, '').replace(/(\d+)/g, '');
	if (href === ''){ href = baseURL; }
	
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/directory/getPwdPolicy/'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.policy = response.data.pwdPolicy;
			$scope.passwordRestriction = response.data.passwordRestriction;

			$scope.pwdMinAge = Math.ceil($scope.policy.pwdMinAge / (60));
			$scope.pwdExpireWarning = Math.ceil($scope.policy.pwdExpireWarning / (60 * 60 * 24));
			$scope.pwdMaxAge = Math.ceil($scope.policy.pwdMaxAge / (60 * 60 * 24));
			$scope.pwdGraceExpire = Math.ceil($scope.policy.pwdGraceExpire / (60 * 60 * 24));
			$scope.pwdMaxIdle = Math.ceil($scope.policy.pwdMaxIdle / (60 * 60 * 24));
			$scope.pwdMaxIdle = Math.ceil($scope.policy.pwdMaxIdle / (60 * 60 * 24));
			$scope.pwdLockoutDuration = Math.ceil($scope.policy.pwdLockoutDuration / (60));
			$scope.pwdFailureCountInterval = Math.ceil($scope.policy.pwdFailureCountInterval / (60));

			initSliders();
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
	
	function initSliders(){
		$("#special").prop("disabled", !($scope.passwordRestriction.allowed.length > 0));
		$("#pwdMinLength").attr({max: 128, min: 0});
		$("#pwdMaxLength").attr({max: 128, min: 0});
		$("#pwdExpireWarning").attr({max: $scope.pwdMaxAge, min: 0});
		
		$("#allowed").bind('change keyup', function(){
			$(this).val($(this).val().replace(/[A-Za-z0-9\s]/g, ''));
			$("#special").prop("disabled", !($(this).val().length > 0));
		});
		
		$("#pwdMinLengthSlider").slider({
			min: 0,
			max: 128,
			value: $scope.policy.pwdMinLength,
			slide: function(event, ui){
				var value = ui.value > 128 ? 128 : ui.value;
				$("#pwdMinLength").val(value);
				
				$scope.policy.pwdMinLength = value;
				$scope.$apply();
			}
		});
		$("#pwdMinLength").change(function(){
			var value = $(this).val() > 128 ? 128 : $(this).val();
			$("#pwdMinLengthSlider").slider("option", {value: value});
			
			$scope.policy.pwdMinLength = value;
			$scope.$apply();
		});

		$("#pwdMaxLengthSlider").slider({
			min: 0,
			max: 128,
			value: $scope.policy.pwdMaxLength,
			slide: function(event, ui){
				var value = ui.value > 128 ? 128 : ui.value;
				$("#pwdMaxLength").val(value);
				
				$scope.policy.pwdMaxLength = value;
				$scope.$apply();
			}
		});
		$("#pwdMaxLength").change(function(){
			var value = $(this).val() > 128 ? 128 : $(this).val();
			$("#pwdMaxLengthSlider").slider("option", {value: value});
			
			$scope.policy.pwdMaxLength = value;
			$scope.$apply();
		});

		$("#pwdMinAgeSlider").slider({
			min: 0,
			max: (60 * 24),
			value: $scope.pwdMinAge,
			slide: function(event, ui){
				var value = ui.value > (60 * 24) ? (60 * 24) : ui.value;
				$("#pwdMinAge").val(value);
				
				$scope.pwdMinAge = value;
				$scope.policy.pwdMinAge = value * (60);
				$scope.$apply();
			}
		});
		$("#pwdMinAge").change(function(){
			var value = $(this).val() > (60 * 24) ? (60 * 24) : $(this).val();
			$("#pwdMinAgeSlider").slider("option", {value: value});
			
			$scope.pwdMinAge = value;
			$scope.policy.pwdMinAge = value * (60);
			$scope.$apply();
		});

		$("#pwdExpireWarningSlider").slider({
			min: 0,
			max: $scope.pwdMaxAge,
			value: $scope.pwdExpireWarning,
			slide: function(event, ui){
				var value = ui.value > $scope.pwdMaxAge ? $scope.pwdMaxAge : ui.value;
				$("#pwdExpireWarning").val(value);
				
				$scope.pwdExpireWarning = value;
				$scope.policy.pwdExpireWarning = value * (60 * 60 * 24);
				$scope.$apply();
			}
		});
		$("#pwdExpireWarning").change(function(){
			var value = $(this).val() > $scope.pwdMaxAge ? $scope.pwdMaxAge : $(this).val();
			$("#pwdExpireWarningSlider").slider("option", {value: value});
			
			$scope.pwdExpireWarning = value;
			$scope.policy.pwdExpireWarning = value * (60 * 60 * 24);
			$scope.$apply();
		});

		$("#pwdMaxAgeSlider").slider({
			min: 0,
			max: 365,
			value: $scope.pwdMaxAge,
			slide: function(event, ui){
				var value = ui.value > 365 ? 365 : ui.value;
				$("#pwdMaxAge").val(value);
				
				$scope.pwdMaxAge = value;
				$scope.policy.pwdMaxAge = value * (60 * 60 * 24);
				
				if ($("#pwdExpireWarning").val() > value){
					$("#pwdExpireWarning").val(value);
					$("#pwdExpireWarningSlider").slider("option", {value: value});
				}
				$("#pwdExpireWarningSlider").slider("option", {max: value});
				$("#pwdExpireWarning").attr({max: value});
				$scope.$apply();
			}
		});
		$("#pwdMaxAge").change(function(){
			var value = $(this).val() > 365 ? 365 : $(this).val();
			$("#pwdMaxAgeSlider").slider("option", {value: value});
			
			$scope.pwdMaxAge = value;
			$scope.policy.pwdMaxAge = value * (60 * 60 * 24);
			
			if ($("#pwdExpireWarning").val() > value){
				$("#pwdExpireWarning").val(value);
				$("#pwdExpireWarningSlider").slider("option", {value: value});
			}
			$("#pwdExpireWarningSlider").slider("option", {max: value});
			$("#pwdExpireWarning").attr({max: value});
			$scope.$apply();
		});

		$("#pwdGraceExpireSlider").slider({
			min: 0,
			max: 365,
			value: $scope.pwdGraceExpire,
			slide: function(event, ui){
				var value = ui.value > 365 ? 365 : ui.value;
				$("#pwdGraceExpire").val(value);
				
				$scope.pwdGraceExpire = value;
				$scope.policy.pwdGraceExpire = value * (60 * 60 * 24);
				$scope.$apply();
			}
		});
		$("#pwdGraceExpire").change(function(){
			var value = $(this).val() > 365 ? 365 : $(this).val();
			$("#pwdGraceExpireSlider").slider("option", {value: value});
			
			$scope.pwdGraceExpire = value;
			$scope.policy.pwdGraceExpire = value * (60 * 60 * 24);
			$scope.$apply();
		});

		$("#pwdMaxIdleSlider").slider({
			min: 0,
			max: 365,
			value: $scope.pwdMaxIdle,
			slide: function(event, ui){
				var value = ui.value > 365 ? 365 : ui.value;
				$("#pwdMaxIdle").val(value);
				
				$scope.pwdMaxIdle = value;
				$scope.policy.pwdMaxIdle = value * (60 * 60 * 24);
				$scope.$apply();
			}
		});
		$("#pwdMaxIdle").change(function(){
			var value = $(this).val() > 365 ? 365 : $(this).val();
			$("#pwdMaxIdleSlider").slider("option", {value: value});
			
			$scope.pwdMaxIdle = value;
			$scope.policy.pwdMaxIdle = value * (60 * 60 * 24);
			$scope.$apply();
		});

		$("#pwdLockoutDurationSlider").slider({
			min: 0,
			max: (60 * 24),
			value: $scope.pwdLockoutDuration,
			slide: function(event, ui){
				var value = ui.value > (60 * 24) ? (60 * 24) : ui.value;
				$("#pwdLockoutDuration").val(value);
				
				$scope.pwdLockoutDuration = value;
				$scope.policy.pwdLockoutDuration = value * (60);
				$scope.$apply();
			}
		});
		$("#pwdLockoutDuration").change(function(){
			var value = $(this).val() > (60 * 24) ? (60 * 24) : $(this).val();
			$("#pwdLockoutDurationSlider").slider("option", {value: value});
			
			$scope.pwdLockoutDuration = value;
			$scope.policy.pwdLockoutDuration = value * (60);
			$scope.$apply();
		});

		$("#pwdFailureCountIntervalSlider").slider({
			min: 0,
			max: (60 * 24),
			value: $scope.pwdFailureCountInterval,
			slide: function(event, ui){
				var value = ui.value > (60 * 24) ? (60 * 24) : ui.value;
				$("#pwdFailureCountInterval").val(value);
				$scope.policy.pwdFailureCountInterval = value * (60);
				$scope.$apply();
			}
		});
		$("#pwdFailureCountInterval").change(function(){
			var value = $(this).val() > (60 * 24) ? (60 * 24) : $(this).val();
			$("#pwdFailureCountIntervalSlider").slider("option", {value: value});
			$scope.policy.pwdFailureCountInterval = value * (60);
			$scope.$apply();
		});
	}

	function getType(val){
	    return ({}).toString.call(val).match(/(\w+)/g)[1].toLowerCase();
	}
	
	$scope.save = function(){
		BusyIndicator.show("Saving");
		var promiseArray = [];
		promiseArray.push($http({
			method: 'PUT',
			url: '/directory/updatePwdPolicy',
			data: $scope.policy
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		}));


		promiseArray.push($http({
			method: 'PUT',
			url: '/directory/updatePasswordRestriction',
			params: { id: $scope.passwordRestriction.id },
			data: $scope.passwordRestriction
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		}));

		$q.all(promiseArray).then(function(){
			load();
			saved();
		});
	};
	
	function saved(){
		BusyIndicator.hide();
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
}]);
