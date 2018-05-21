/* global angular, controllers, baseURL, bootbox */
//= require_self
'use strict';

/* Activity Controllers */
controllers.controller('ActivityCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$q',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $q){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/activity/getActivities' 
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.activities = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
	
	$scope.add = function(){
		var dialog = bootbox.dialog({
			title: 'Add New Activity',
			message:
			'<form>' +
				'<div class="form-group">' +
					'<label class="control-label" for="name" style="width: 20%;">Name:</label>' +
					'<input class="pull-right" id="name" type="text" style="width: 80%;">' +
				'</div>' +
			'</form>' +
			'<span id="warning1" class="text-warning" style="display:none;"><center>Please enter a name</center></span>' +
			'<span id="warning2" class="text-warning" style="display:none;"><center>That activity aleady exists</center></span>' +
			'<form>' +
				'<div class="form-group">' +
					'<label class="control-label" for="description" style="width: 20%;">Description:</label>' +
					'<textarea rows="4" cols="50" maxlength="255" class="pull-right" id="description" type="text" style="width: 80%;"></textarea>' +
				'</div>' +
			'</form>' +
			'<form style="width: 100%;display: inline-block;">' +
				'<div class="form-group">' +
					'<input id="spanStatus" type="checkbox" style="padding: 10px;margin: 10px;">' +
					'<label class="control-label" for="spanStatus" style="padding-right: 10px;">Span Statuses</label>' +
				'</div>' +
			'</form>',
			buttons: {
				cancel: {
					label: "Cancel",
					className: "btn-cancel"
				},
				confirm: {
					label: "OK",
					className: "btn-primary",
					callback: function(){
						if ($('#name').val().trim() !== ''){
							for (var i in $scope.activities){
								if ($scope.activities[i].name === dialog.find('#name').val().trim()){
									dialog.find("#warning1").hide();
									dialog.find("#warning2").show();
									return false;
								}
							}
							
							$http({
								method: 'POST',
								url: '/activity/save',
								data: {
									name: dialog.find('#name').val().trim(),
									description: dialog.find('#description').val().trim(),
									spanStatus: dialog.find("#spanStatus").is(':checked')
								},
								xsrfCookieName: 'xsrf_token',
								xsrfHeaderName : 'xsrf_token'
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
								load();
							}, function errorCallback(response){
								console.error('%s: %s', response.config.method, response.config.url, response);
								Prompt(response.data);
							});
						}
						else {
							dialog.find("#warning1").show();
							return false;
						}
					}
				}
			}
		});
	};
	
	$scope.edit = function(activity){
		var name = $("<div>").text(activity.name).html(), description = $("<div>").text(activity.description).html();
		var dialog = bootbox.dialog({
			title: 'Edit: ' + name,
			message:
			'<form>' +
				'<div class="form-group">' +
					'<label class="control-label" for="name" style="width: 20%;">Name:</label>' +
					'<input class="pull-right" id="name" type="text" style="width: 80%;">'+
				'</div>' +
			'</form>' +
			'<span id="warning1" class="text-warning" style="display:none;"><center>Please enter a name</center></span>' +
			'<span id="warning2" class="text-warning" style="display:none;"><center>That activity aleady exists</center></span>' +
			'<form>' +
				'<div class="form-group">' +
					'<label class="control-label" for="description" style="width: 20%;">Description:</label>' +
					'<textarea rows="4" cols="50" maxlength="255" class="pull-right" id="description" type="text" style="width: 80%;"></textarea>'+
				'</div>' +
			'</form>' +
			'<form style="width: 100%;display: inline-block;">' +
				'<div class="form-group">' +
					'<input id="spanStatus" type="checkbox">' +
					'<label class="control-label" for="spanStatus">Span Statuses</label>' +
				'</div>' +
			'</form>',
			buttons: {
				cancel: {
					label: "Cancel",
					className: "btn-cancel"
				},
				confirm: {
					label: "OK",
					className: "btn-primary",
					callback: function(){
						if (dialog.find('#name').val().trim() !== ''){
							for (var i in $scope.activities){
								if ($scope.activities[i].name === dialog.find('#name').val().trim() && activity.id !== $scope.activities[i].id){
									dialog.find("#warning1").hide();
									dialog.find("#warning2").show();
									return false;
								}
							}
							
							$http({
								method: 'PUT',
								url: '/activity/update',
								params: { id:  activity.id },
								data: {
									name: dialog.find('#name').val().trim(),
									description: dialog.find('#description').val().trim(),
									spanStatus: dialog.find("#spanStatus").is(':checked')
								}
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
								load();
							}, function errorCallback(response){
								console.error('%s: %s', response.config.method, response.config.url, response);
								Prompt(response.data);
							});
						}
						else {
							dialog.find("#warning1").show();
							return false;
						}
					}
				}
			}
		});
		dialog.find('#name').val(name).attr('placeHolder', name);
		dialog.find('#description').val(description).attr('placeHolder', description);
		dialog.find("#spanStatus").attr("checked", activity.spanStatus);
	};

	$scope.delete = function(activity){
		function remove(){
			$http({
				method: 'DELETE',
				url: '/activity/delete',
				params: { id:  activity.id }
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				load();
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				Prompt(response.data);
			});
		}
		
		function confirm(){
			var name = $("<div>").text(activity.name).html();
			if (activity.statuses.length > 0){
				var message = '';
				for (var i in activity.statuses){ message += $("<div>").text(activity.statuses[i].name).html() + '<br>'; }
				bootbox.dialog({
					title: name + ' is currently assigned to:',
					message: message,
					buttons: {
						cancel: {
							label: "Cancel",
							className: "btn-cancel"
						},
						confirm: {
							label: "Unassign and Delete",
							className: "btn-primary",
							callback: function(){ remove(); }
						}
					}
				});
			}
			else{
				bootbox.confirm('Are you sure you want to delete ' + name + '?', function(result){
					if (result){ remove(); }
				});
			}
		}
		confirm();
	};
}]);
