/* global angular, controllers, bootbox, baseURL */
//= require_self
'use strict';

/* Status Change Reason Controllers */
controllers.controller('ChangeReasonCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http',
		function(BusyIndicator, LoadService, Prompt, $scope, $http){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/changeReason/getChangeReasons'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.changeReasons = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	$scope.add = function(){
		bootbox.dialog({
			title: 'Add New Status Change Reason',
			message:
				'<form>' +
					'<div class="form-group">' +
						'<label for="name" style="width: 20%;">Name:</label>' +
						'<input id="name" type="text" style="width: 80%;">' +
					'</div>' +
				'</form>' +
				'<span id="warning" style="color:#FF0000; display:none;"><center>Please enter a name</center></span>' +
				'<span id="warning2" style="color:#FF0000; display:none;"><center>That changeReason aleady exists</center></span>' +
				'<form>' +
					'<div class="form-group">' +
						'<label for="description" style="width: 20%;">Description:</label>' +
						'<textarea rows="4" cols="50" maxlength="255" id="description" type="text" style="width: 80%;"></textarea>' +
					'</div>' +
				'</form>' +
				'<form>' +
					'<div class="form-group" style="display: inline-flex;">' +
						'<label for="attitude" style="padding-right: 10px;">Attitude:</label>' +
						'<ul id="attitude" style="list-style: none;">' +
							'<li><input type="radio" id="negative" name="attitude" value="Negative"><label for="negative">Negative</label></li>' +
							'<li><input type="radio" id="neutral" name="attitude" value="Neutral" checked><label for="neutral">Neutral</label></li>' +
							'<li><input type="radio" id="positive" name="attitude" value="Positive"><label for="positive">Positive</label></li>' +
						'</ul>' +
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
								for (var i in $scope.changeReasons){
									if ($scope.changeReasons[i].name === $('#name').val().trim()){
										$("#warning2").show();
										$("#warning").hide();
										return false;
									}
								}

								$http({
									method: 'POST',
									url: '/changeReason/save',
									data: {
										name: $('#name').val().trim(),
										description: $('#description').val().trim(),
										attitude: $("input[name=attitude]:checked").val()
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
								$("#warning").show();
								return false;
							}
						}
					}
				}
		});
	};

	$scope.edit = function(changeReason){
		var name = $("<div>").text(changeReason.name).html(), description = $("<div>").text(changeReason.description).html();
		var dialog = bootbox.dialog({
			title: 'Edit: ' + name,
			message:
				'<form>' +
					'<div class="form-group">' +
						'<label for="name" style="width: 20%;">Name:</label>' +
						'<input id="name" type="text" style="width: 80%;">' +
					'</div>' +
				'</form>' +
				'<span id="warning" style="color:#FF0000; display:none;"><center>Please enter a name</center></span>' +
				'<span id="warning2" style="color:#FF0000; display:none;"><center>That Change Reason aleady exists</center></span>' +
				'<form>' +
					'<div class="form-group">' +
						'<label for="description" style="width: 20%;">Description:</label>' +
						'<textarea rows="4" cols="50" maxlength="255" id="description" type="text" style="width: 80%;"></textarea>' +
					'</div>' +
				'</form>' +
				'<form>' +
					'<div class="form-group" style="display: inline-flex;">' +
						'<label for="attitude" style="padding-right: 10px;">Attitude:</label>' +
						'<ul id="attitude" style="list-style: none;">' +
							'<li><input type="radio" id="negative" name="attitude" value="Negative"><label for="negative">Negative</label></li>' +
							'<li><input type="radio" id="neutral" name="attitude" value="Neutral" checked><label for="neutral">Neutral</label></li>' +
							'<li><input type="radio" id="positive" name="attitude" value="Positive"><label for="positive">Positive</label></li>' +
						'</ul>' +
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
								for (var i in $scope.changeReasons){
									if ($scope.changeReasons[i].name === dialog.find('#name').val().trim() && changeReason.id !== $scope.changeReasons[i].id){
										dialog.find("#warning1").hide();
										dialog.find("#warning2").show();
										return false;
									}
								}
								
								$http({
									method: 'PUT',
									url: '/changeReason/update',
									params: { id: changeReason.id },
									data: {
										name : dialog.find('#name').val().trim(),
										description : dialog.find('#description').val().trim(),
										attitude: dialog.find("input[name=attitude]:checked").val()
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

		switch(changeReason.attitude){
			case "Negative": dialog.find("#negative").attr("checked", true);
				break;
			case "Neutral": dialog.find("#neutral").attr("checked", true);
				break;
			case "Positive": dialog.find("#positive").attr("checked", true);
				break;
		}
	};

	$scope.delete = function(changeReason){
		function remove(){
			$http({
				method: 'DELETE',
				url: '/changeReason/delete',
				params: { id: changeReason.id }
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				load();
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				Prompt(response.data);
				load();
			});
		}

		function confirm(){
			var name = $("<div>").text(changeReason.name).html();
			if (changeReason.statuses.length > 0){
				var message = '';
				for (var i in changeReason.statuses){ message += $("<div>").text(changeReason.statuses[i].name).html() + '<br>'; }
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
							callback: function(){
								remove();
							}
						}
					}
				});
			}
			else{
				bootbox.confirm('Are you sure you want to delete ' + name + '?', 
						function(result){
					if (result){
						remove();
					}
				});
			}
		}

		confirm();
	};
}]);
