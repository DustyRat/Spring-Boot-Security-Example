/* global angular, controllers, baseURL, bootbox, TL, _ */
//= require_self
'use strict';

/* QueueEntry Controllers */
controllers.factory('statusService', ['Prompt', '$http', '$filter',
		function(Prompt, $http, $filter){
	function _init_(callback){
		$http({
			method: 'GET',
			url: '/navigation/getStatuses' 
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			response.data.statuses = $filter('orderBy')(response.data.statuses, "name", false);
			var canceled = {}, canceledIdx = -1;
			for (var i in response.data.statuses){
				response.data.statuses[i].activities = $filter('orderBy')(response.data.statuses[i].activities, "name", false);
				response.data.statuses[i].changeReasons = $filter('orderBy')(response.data.statuses[i].changeReasons, "name", false);

				if (response.data.statuses[i].name === 'Canceled'){
					canceledIdx = i;
					canceled = response.data.statuses[i];
				}
			}
			if (canceled){
				response.data.statuses.splice(canceledIdx, 1);
				response.data.statuses.push(canceled);
			}
			if (angular.isFunction(callback)){ callback(response); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		});
		
	}

	function apply(url, params, data, callback){
		$http({
			method: 'PUT',
			url: url,
			params: params,
			data: data
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			if (angular.isFunction(callback)){ callback(response); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}

	function selectReason(status, url, params, callback){
		var changeReasons = [];
		var options = '';
		for (var i in status.changeReasons){
			var description = status.changeReasons[i].description ? status.changeReasons[i].description : '';
			options += '<li><a class="reason" data-toggle="tooltip" data-placement="right" data-value="'+ status.changeReasons[i].id + '" title="' +
			$('<div>').text(description).html() + '">';

			if (status.multiple){ options +='<input type="checkbox">'; }
			options += '<label style="font-weight: normal;">' + $('<div>').text(status.changeReasons[i].name).html() + '</label></a></li>';
		}

		var dialog = bootbox.dialog({
			title: 'Change the client status to ' + $('<div>').text(status.name).html() + '?',
			message: 
				'<div class="button-group">'+
				'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
				'<span class="btnText" data-toggle="tooltip" data-placement="right"></span><span class="caret"></span></button>'+
				'<ul class="dropdown-menu reasons" style="height: auto; max-height: 200px; overflow-x: hidden;">'+
				options+
				'</ul>'+
				'</div>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					confirm: {
						label: "OK",
						className: "btn-primary",
						callback: function(){
							apply(url, angular.extend({ changeReasonID: changeReasons }, params), null, callback);
						}
					}
				}
		});

		if (status.multiple){
			$('.reasons a').on('click', function(event){
				var $target = $(event.currentTarget), val = $target.attr('data-value'), $inp = $target.find('input'), idx;

				if ((idx = changeReasons.indexOf(val)) > -1){
					changeReasons.splice(idx, 1);
					setTimeout(function(){ $inp.prop('checked', false); }, 0);
				} else {
					changeReasons.push(val);
					setTimeout(function(){ $inp.prop('checked', true); }, 0);
				}

				$(event.target).blur();
				return false;
			});
		}
		else{
			$('.reasons a').on('click', function(event){
				var $target = $(event.currentTarget), val = $target.attr('data-value');
				changeReasons = [];
				changeReasons.push(val);
				$(event.target).blur();
			});
		}

		var button = dialog.find('.btn-primary');
		button.attr("disabled", true);
		$(".btnText").text('-Select Reason-');
		$(".reason").tooltip({container: 'body'});

		$(".reason").click(function(){
			button.attr("disabled", true);
			$(".btnText").text('-Select Reason-');

			var btnText = '';
			if (status.multiple){
				var names = [], num = 4, char = 15;

				for (var i in changeReasons){
					for (var j in status.changeReasons){
						if (changeReasons[i] === status.changeReasons[j].id){
							names.push(status.changeReasons[j].name);
							break;
						}
					}
				}

				for (var i = 0; i < names.length - 1; i++){
					btnText += names[i].substring(0, char);
					if (names[i].length > char){ btnText += '..., '; }
					else  btnText += ', ';
				}

				if (names.length > 1){
					btnText += names[names.length - 1].substring(0, char);
					if (names[names.length - 1].length > char){ btnText += '...'; }
				}
				else if (names.length === 1){
					btnText += names[0] + ' ';
				}

				if (changeReasons.length >= num){
					btnText = changeReasons.length + ' Selected ';
				}
			}
			else {
				for (var i in status.changeReasons){
					if (changeReasons[0] === status.changeReasons[i].id){
						btnText = status.changeReasons[i].name;
						break;
					}
				}
			}

			if (changeReasons.length > 0){
				button.attr("disabled", false);
				$(".btnText").text(btnText);
			}
		});
	}

	function startActivity(url, params, callback){
		apply(url, params, null, callback);
	}

	function updateStatus(queueEntry, status, url, params, callback){
		if (queueEntry && angular.isArray(queueEntry)){
			var error = false;
			for (var i in queueEntry){
				if (queueEntry[i].status === status.name){
					error = true;
					bootbox.alert('Cannot change from ' + $('<div>').text(status.name).html() + ' to ' + $('<div>').text(queueEntry[i].status).html());
					break;
				}
			}
			if (!error){
				if (status.changeReasons.length > 0){
					selectReason(status, url, angular.extend({ newStatus: status.name }, params), callback);
				}
				else {
					bootbox.confirm('Change the clients\' status to ' + $('<div>').text(status.name).html()+ '?', function(result){
						if (result){ apply(url, null, angular.extend({ newStatus: status.name }, params), callback); }
					});
				}
			}
		}
		else if (queueEntry && queueEntry.status === status.name){
			bootbox.alert('Cannot change from ' + $('<div>').text(status.name).html() + ' to ' + $('<div>').text(queueEntry.name).html());
		}
		else if (status.changeReasons.length > 0){
			selectReason(status, url, angular.extend({ newStatus: status.name }, params), callback);
		}
		else {
			bootbox.confirm('Change the client\'s status to ' + $('<div>').text(status.name).html() + '?', function(result){
				if (result){ apply(url, angular.extend({ newStatus: status.name }, params), null, callback); }
			});
		}
	}

	return { _init_: _init_, startActivity: startActivity, updateStatus: updateStatus };
}]);

/*************** Note Tab Controllers ***************/
controllers.controller('noteTabController', ['tabService', function(tabService){
	function setTab(newValue){
		tabService.setTab(newValue);
	};

	function isSet(tabName){
		return tabService.isSet(tabName);
	};

	return { setTab: setTab, isSet: isSet };
}]);
/*************** END Note Tab Controller ***************/

/*************** Grid Controller ***************/
controllers.controller('QueueEntryListCtrl', ['BusyIndicator', 'LoadService', 'Prompt', 'Storage', 'statusService', '$scope', '$http', '$window', '$filter',
		function(BusyIndicator, LoadService, Prompt, Storage, statusService, $scope, $http, $window, $filter){
	$scope.searchParams = { };
	var queueEntries, statuses = [];
	function load(max, offset){
		BusyIndicator.loading();
		$scope.selectedEntries = Storage.getSessionStorage('selectedEntries');
		if (!$scope.selectedEntries){ $scope.selectedEntries = { activity: [], print: [], status: [] }; }
		$scope.action = Storage.getSessionStorage('action');
		$scope.status = Storage.getSessionStorage('status');
		$scope.activities = Storage.getSessionStorage('activities');

		$http({
			method: 'GET',
			url: '/queueEntry/getQueueEntries',
			params: {
				max: max,
				offset: offset
			}
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);

			queueEntries = response.data.queueEntries;
			$scope.max = Number(response.data.max);
			$scope.offset = Number(response.data.offset);
			$scope.total = Number(response.data.total);
			
			var data = queueEntries.map(function(item) { return { id: item.id, name: item.name, status: item.status }; });
			$scope.selectedEntries.print = _.intersection(data, $scope.selectedEntries.print);
			$scope.selectedEntries.activity = _.intersection(data, $scope.selectedEntries.activity);
			$scope.selectedEntries.status = _.intersection(data, $scope.selectedEntries.status);

			statuses = jQuery.unique(queueEntries.map(function(item) { return item.status; })).sort();
			for (var i in statuses){
				if (statuses[i] === 'Canceled'){
					var canceled = statuses[i];
					statuses.splice(i, 1);
					statuses.push(canceled);
					break;
				}
			}
			statusService._init_(setStatuses);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();

	function removeAllNotStatus(array, status){
		return array.filter(function(elem, index, self) { return elem.status === status; });
	}

	function setStatuses(resonse){
		$scope.fromStatus = Storage.getSessionStorage('fromStatus');
		$scope.statuses = resonse.data.statuses;

		$scope.selectStatuses = [];
		for (var i in $scope.statuses){
			for (var k in statuses){
				if ($scope.statuses[i].name === statuses[k]){
					$scope.selectStatuses.push($scope.statuses[i]);
					break;
				}
			}
		}

		var status = Storage.getSessionStorage('toStatus');
		if (status){
			for (var i in $scope.statuses){
				if ($scope.statuses[i].name === status.name){
					$scope.toStatus = $scope.statuses[i];
					break;
				}
			}
		}

		status = Storage.getSessionStorage('status');
		if (status){
			for (var i in $scope.statuses){
				if ($scope.statuses[i].name === status.name){
					$scope.status = $scope.statuses[i];
					break;
				}
			}
		}
		
		if ($scope.status){ $scope.selectedEntries.activity = removeAllNotStatus($scope.selectedEntries.activity, $scope.status.name); }
		if ($scope.fromStatus){ $scope.selectedEntries.status = removeAllNotStatus($scope.selectedEntries.status, $scope.fromStatus.name); }
		Storage.setSessionStorage('selectedEntries', $scope.selectedEntries);

		switch ($scope.action){
			case 'Print': filterStatus();
				break;
			case 'Start Activity': 
				if (!$scope.status){ $scope.clearActivitySelection(); }
				filterStatus($scope.status);
				break;
			case 'Status Change':
				if (!$scope.fromStatus){ $scope.clearStatusSelection(); }
				filterStatus($scope.fromStatus);
				break;
			default: filterStatus();
		}
	}

	function filterStatus(status){
		if (status){ $scope.queueEntries = $filter('filter')(queueEntries, { status: status.name }, true); }
		else { $scope.queueEntries = queueEntries; }

		LoadService.data = $scope.queueEntries;
		LoadService.notifyObservers(BusyIndicator.hide);
	}

	function clearActivities(){
		$scope.activities = [];
		Storage.setSessionStorage('activities', $scope.activities);
	}

	$scope.setAction = function(action){
		$scope.action = action;
		Storage.setSessionStorage('action', action);

		switch ($scope.action){
			case 'Print': filterStatus();
				break;
			case 'Start Activity': 
				if (!$scope.status){ $scope.clearActivitySelection(); }
				filterStatus($scope.status);
				break;
			case 'Status Change':
				if (!$scope.fromStatus){ $scope.clearStatusSelection(); }
				filterStatus($scope.fromStatus);
				break;
			default: filterStatus();
		}
	};

	$scope.setStatus = function(status){
		if (!status){ $scope.clearActivitySelection(); }
		filterStatus(status);
		$scope.status = status;
		Storage.setSessionStorage('status', status);
	};

	$scope.setFrom = function(status){
		if (!status){ $scope.clearStatusSelection(); }
		if (status && $scope.toStatus && $scope.toStatus.name === status.name){ $scope.setTo(); }
		filterStatus(status);
		$scope.fromStatus = status;
		Storage.setSessionStorage('fromStatus', status);
	};

	$scope.setTo = function(status){
		$scope.toStatus = status;
		Storage.setSessionStorage('toStatus', status);
	};

	$scope.print = function(){
		$window.location.href = '/printPreview';
	};

	$scope.startActivity = function(){
		BusyIndicator.show("Updating");
		statusService.startActivity('/queueEntry/startActivity', {
			id: $scope.selectedEntries.activity.map(function(item) { return item.id; }),
			activityID: $scope.activities
		}, function callback(response){
			$scope.cancel();
			load($scope.max, $scope.offset);
		});
	};

	$scope.changeStatus = function(){
		BusyIndicator.show("Updating");
		statusService.updateStatus($scope.selectedEntries.status, $scope.toStatus, '/queueEntry/update',
				{ id: $scope.selectedEntries.status.map(function(item) { return item.id; }), oldStatus: $scope.fromStatus.name },
				function callback(response){
					$scope.cancel();
					load($scope.max, $scope.offset);
				});
	};

	$scope.toggleActivity = function(activity){
		if (!$scope.activities){ $scope.activities = []; }

		var index = $scope.activities.indexOf(activity);
		if (index > -1){ $scope.activities.splice(index, 1); }
		else $scope.activities.push(activity);

		Storage.setSessionStorage('activities', $scope.activities);
	};

	$scope.isSelected = function(item){
		switch ($scope.action){
			case 'Print': return indexOf($scope.selectedEntries.print, { id: item.id, name: item.name, status: item.status }) > -1;
			case 'Start Activity': return indexOf($scope.selectedEntries.activity, { id: item.id, name: item.name, status: item.status }) > -1;
			case 'Status Change': return indexOf($scope.selectedEntries.status, { id: item.id, name: item.name, status: item.status }) > -1;
		}
	};

	$scope.check = function(queueEntry){
		var index;
		switch ($scope.action){
			case 'Print':
				index = indexOf($scope.selectedEntries.print, queueEntry, 'id');
				if (index > -1){ $scope.selectedEntries.print.splice(index, 1); }
				else { $scope.selectedEntries.print.push({ id: queueEntry.id, name: queueEntry.name, status: queueEntry.status }); }
				break;
			case 'Start Activity':
				index = indexOf($scope.selectedEntries.activity, queueEntry, 'id');
				if (index > -1){ $scope.selectedEntries.activity.splice(index, 1); }
				else { $scope.selectedEntries.activity.push({ id: queueEntry.id, name: queueEntry.name, status: queueEntry.status }); }
				break;
			case 'Status Change':
				index = indexOf($scope.selectedEntries.status, queueEntry, 'id');
				if (index > -1){ $scope.selectedEntries.status.splice(index, 1); }
				else { $scope.selectedEntries.status.push({ id: queueEntry.id, name: queueEntry.name, status: queueEntry.status }); }
				break;
		}

		Storage.setSessionStorage('selectedEntries', $scope.selectedEntries);
	};

	$scope.checkAll = function(data){
		switch ($scope.action){
			case 'Print': $scope.selectedEntries.print = _.union($scope.selectedEntries.print, data.map(function(item){ return { id: item.id, name: item.name, status: item.status }; }));
				break;
			case 'Start Activity': $scope.selectedEntries.activity = _.union($scope.selectedEntries.activity, data.map(function(item){ return { id: item.id, name: item.name, status: item.status }; }));
				break;
			case 'Status Change': $scope.selectedEntries.status = _.union($scope.selectedEntries.status, data.map(function(item){ return { id: item.id, name: item.name, status: item.status }; }));
				break;
		}

		Storage.setSessionStorage('selectedEntries', $scope.selectedEntries);
	};

	$scope.uncheckAll = function(){
		switch ($scope.action){
			case 'Print': $scope.clearPrintSelection();
				break;
			case 'Start Activity': $scope.clearActivitySelection();
				break;
			case 'Status Change': $scope.clearStatusSelection();
				break;
		}
	};

	$scope.clearActivitySelection = function(){
		clearActivities();
		$scope.selectedEntries.activity = [];
		Storage.setSessionStorage('selectedEntries', $scope.selectedEntries);
	};

	$scope.clearStatusSelection = function(){
		$scope.selectedEntries.status = [];
		Storage.setSessionStorage('selectedEntries', $scope.selectedEntries);
	};

	$scope.clearPrintSelection = function(){
		$scope.selectedEntries.print = [];
		Storage.setSessionStorage('selectedEntries', $scope.selectedEntries);
	};

	$scope.removeFrom = function(array, item){
		var index = indexOf(array, item, 'id');
		if (index > -1) array.splice(index, 1);
		Storage.setSessionStorage('selectedEntries', $scope.selectedEntries);
	};

	$scope.cancel = function(){
		switch ($scope.action){
		case 'Print': $scope.clearPrintSelection();
		break;
		case 'Start Activity':
			$scope.clearActivitySelection();
			$scope.setStatus();
			clearActivities();
			break;
		case 'Status Change': 
			$scope.setFrom();
			$scope.setTo();
			break;
		}
		$scope.setAction();
	};
	
    $scope.findQueueEntry = function(){
		BusyIndicator.loading();
        $http({
            method: 'GET',
            url: '/queueEntry/find',
            params: angular.extend({ max: 1 }, $scope.searchParams)
        }).then(function successCallback(response){
            console.log('%s: %s', response.config.method, response.config.url, response);
            BusyIndicator.hide();
            $window.location.href = '/show/' + response.data.id;
        }, function errorCallback(response){
            console.error('%s: %s', response.config.method, response.config.url, response);
            Prompt(response.data);
        });
    };

	$scope.loadNext = function(){
		var max = Number($scope.max);
		var offset = Number($scope.offset);
		if (offset + max < $scope.total){ offset += max; }
		load(max, offset);
	};

	$scope.loadPrev = function(){
		var max = $scope.max;
		var offset = $scope.offset;
		if (offset - max >= 0){ offset -= max; }
		load(max, offset);
	};

	$scope.refresh = function(){
		load();
	};
}]);
/*************** END Grid Controller ***************/

/*************** Detail Controller ***************/
controllers.controller('QueueEntryShowCtrl', ['ExhibitCtrlService', 'BusyIndicator', 'LoadService', 'Prompt', 'statusService', '$scope', '$http', '$window', '$filter', '$timeout',
		function(ExhibitCtrlService, BusyIndicator, LoadService, Prompt, statusService, $scope, $http, $window, $filter, $timeout){
	$scope.queueEntry = {};
	function load(response){
		var updated = false;
		if (response && response.status === 200){ updated = true; }
		BusyIndicator.loading();
		LoadService.push($http({
			method: 'GET',
			url: '/queueEntry/getQueueEntry',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			angular.extend($scope.queueEntry, response.data);
			statusService._init_(function (response){
				$scope.statuses = response.data.statuses;
				for (var i in $scope.statuses){
					if ($scope.CSPReturned && $scope.status){ break; }
					if ($scope.statuses[i].name === $scope.queueEntry.status){ $scope.status = $scope.statuses[i]; }
					if ($scope.statuses[i].name === 'CSP-Returned'){ $scope.CSPReturned = $scope.statuses[i]; }
				}
			});
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			if (updated){ saved(); }
			else { Prompt(response.data); }
		}));
		
		LoadService.push($http({
			method: 'GET',
			url: '/queueEntry/getTimeLine',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data.timeline = response.data.items;
			LoadService.notifyObservers();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
		}));
		
		LoadService.q(function(){ BusyIndicator.hide(); });
	}
	load();
	
	function saved(){
		BusyIndicator.hide();
		var dialog = bootbox.dialog({
			size: 'small',
			backdrop: true,
			closeButton: false,
			message: '<div style="text-align: center;"><span>Update Successful</span><br><span>Redirecting to Bookin Management...</span></div>'
		});
		
		$window.setTimeout(function(){
			dialog.modal('hide');
			$window.location.href = baseURL;
		}, 3000);
	}
	
//	$scope.bind = {
//		timeline: {
//			config: new TL.TimelineConfig(),
//			options: {
////				timenav_position: 'top',
////				debug: true,
//				start_at_end: true,
//				initial_zoom: 0,
//				scale_factor: 0.5
//			}
//		}
//	};
		
	function parseEvents(data){
		var events = [];
		data.forEach(function(event){
			var text = '<table style="width: 500px; white-space: nowrap;">';
			text += '<tr><th style="width: 120px;">Date: </th><td>' + $filter('date')(event.date, 'MM/dd/yyyy h:mma') + '</td></tr>';
			if (event.program ){ text += '<tr><th>Program: </th><td>' + event.program  + '</td></tr>'; }
			if (event.location){ text += '<tr><th>Location: </th><td>' + event.location + '</td></tr>'; }
			if (event.contactType){ text += '<tr><th>Contact Type: </th><td>' + event.contactType + '</td></tr>'; }
			if (event.dx){ text += '<tr><th>Diagnosis: </th><td>' + event.dx + '</td></tr>'; }
			if (event.service){ text += '<tr><th>Service: </th><td>' + event.service + '</td></tr>'; }
			if (event.outcome){ text += '<tr><th>Outcome: </th><td>' + event.outcome + '</td></tr>'; }
			if (event.details){ text += '<tr><th>Details: </th><td>' + event.details + '</td></tr>'; }
			if (event.description){ text += '<tr><th>Description: </th><td>' + event.description + '</td></tr>'; }
			text += '</table>';
			var start_date = new Date(event.date),
				end_date = new Date(start_date.getTime() + event.duration),
				_event = {
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
					text: { headline: event.label, text: text },
					group: event.group
				};
			events.push(_event);
		});
		return events;
	}
	
	$scope.bind = {
		timeline: {
			_config: { events: [] },
			_options: { start_at_end: true, initial_zoom: 0, scale_factor: 0.5 }
		}
	};
	
	$scope.showTimeLine = function(){
		$timeout(function(){
			$scope.bind.timeline._initData($scope.bind.timeline._config);
			window.timeline = $scope.bind.timeline;
		}, 100);
	}
	
	$scope.updateTimeLine = function(data){
		$scope.bind.timeline._config.events = parseEvents(data);
	}

	function loadPredictive(){
		$http({
			method: 'GET',
			url: '/queueEntry/getPredictive',
			params: { id: $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.predDetails = response.data;
		}, 
		function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			$scope.predErrorMessage = response.data;
		});
	}
	loadPredictive();

	$scope.loadTimeLine = function(){
		if (!$scope.timeLineLoaded){
			ExhibitCtrlService.load('/client/getTimeLine', { id: $scope.queueEntry.client.id }, function(response){
				if (response.status === 200){ $scope.timeLineLoaded = true; }
				else { $scope.timeLineLoaded = false; }
			});
		}
		else {
			ExhibitCtrlService.refresh('/client/getTimeLine', { id: $scope.queueEntry.client.id }, function(response){
				if (response.status === 200){ $scope.timeLineLoaded = true; }
				else { $scope.timeLineLoaded = false; }
			});
		}
	};
	
	$scope.showClient = function(){
		$window.location.href = '/client/show/' + $scope.queueEntry.client.id;
	};

	$scope.changeStatus = function(status){
		statusService.updateStatus($scope.queueEntry, status, '/queueEntry/update', { id: $scope.queueEntry.id, oldStatus: $scope.queueEntry.status }, load);
	};

	$scope.unmatch = function(){
		bootbox.dialog({
			title: 'Reassign or Unmatch bookin?',
			message: 
				'<table class="table table-condensed table-striped">'+
					'<thead>'+
						'<tr><td></td><th>Bookin</th><th>Client</th></tr>'+
					'</thead>'+
					'<tbody>'+
						'<tr><th>ID</th><td>' + $scope.queueEntry.bookin.number + '</td><td>' + $scope.queueEntry.client.number + '</td></tr>'+
						'<tr><th>Name</th><td>' + $scope.queueEntry.bookin.name + '</td><td>' + $scope.queueEntry.client.name + '</td></tr>'+
						'<tr><th>DOB</th><td>' + $scope.queueEntry.bookin.dob + '</td><td>' + $scope.queueEntry.client.dob + '</td></tr>'+
						'<tr><th>SSN</th><td>' + $scope.queueEntry.bookin.ssn + '</td><td>' + $scope.queueEntry.client.ssn + '</td></tr>'+
						'<tr><th>Ethnicity</th><td>' + $scope.queueEntry.bookin.ethnicity + '</td><td>' + $scope.queueEntry.client.ethnicity + '</td></tr>'+
						'<tr><th>Gender</th><td>' + $scope.queueEntry.bookin.gender + '</td><td>' + $scope.queueEntry.client.gender + '</td></tr>'+
					'</tbody>'+
				'</table>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					Reassign: {
						label: "Reassign",
						className: "btn-success",
						callback: function(){
							$window.location.href = '/bookin/rematch/' + $scope.queueEntry.id;
						}
					},
					confirm: {
						label: "Unmatch",
						className: "btn-danger",
						callback: function(){
							bootbox.confirm('Are you sure you want to unmatch?<br>' +
									'<span class="text-danger">WARNING: This action will delete this Match and any associated Notes/Activities/Status Change Reasons.</span><br>' +
									'<span class="text-danger" style="font-weight: bold;">This data will not be recoverable!</span>', function(result){
								if (result){
									BusyIndicator.show("Deleting");
									$http({
										method: 'DELETE',
										url: '/queueEntry/delete',
										params: { id: $scope.id }
									}).then(function successCallback(response){
										console.log('%s: %s', response.config.method, response.config.url, response);
										$window.location.href = '/';
										BusyIndicator.hide();
									}, function errorCallback(response){
										console.error('%s: %s', response.config.method, response.config.url, response);
										bootbox.alert(response.data);
										BusyIndicator.hide();
									});
								}
							});
						}
					}
				}
		});
		$('.modal-body').css('padding', '0px');
	};

	$scope.note = {};
	$scope.addNote = function(){
		bootbox.confirm("Add this note?", function(result){
			if (result){
				$http({
					method: 'PUT',
					url: '/queueEntry/addNote',
					params: { id: $scope.queueEntry.id, body: $scope.note.body }
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					load();
					$scope.note = {};
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					Prompt(response.data);
				});
			}
		});
	};

	$scope.startActivity = function(){
		var activities = [], options = '';
		for (var i in $scope.status.activities){
			var name = $("<div>").text($scope.status.activities[i].name).html(), description = $("<div>").text($scope.status.activities[i].description).html();
			if (!description){ description = ''; }
			options += '<li><a class="activity" data-toggle="tooltip" data-placement="right" ' +
				'title="' + description +
				'" data-value="'+ $scope.status.activities[i].id +'"><input type="checkbox"><label style="font-weight: normal;">' + name + '<label></a></li>';
		}

		var dialog = bootbox.dialog({
			title: 'Start Activity?',
			message: 
				'<div class="button-group">'+
					'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
					'<span class="btnText" data-toggle="tooltip" data-placement="right"></span><span class="caret"></span></button>'+
					'<ul id="activities" class="dropdown-menu" style="height: auto; max-height: 200px; overflow-x: hidden;">'+ options + '</ul>'+
				'</div>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					confirm: {
						label: "OK",
						className: "btn-primary",
						callback: function(){
							$http({
								method: 'PUT',
								url: '/queueEntry/startActivity',
								params: { id: $scope.queueEntry.id, activityID: activities }
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
								load();
							}, function errorCallback(response){
								console.error('%s: %s', response.config.method, response.config.url, response);
								Prompt(response.data);
							});
						}
					}
				}
		});

		$('#activities a').on('click', function(event){
			var $target = $(event.currentTarget), val = $target.attr('data-value'), $inp = $target.find('input'), idx;
			if ((idx = activities.indexOf(val)) > -1){
				activities.splice(idx, 1);
				setTimeout(function(){ $inp.prop('checked', false); }, 0);
			}
			else {
				activities.push(val);
				setTimeout(function(){ $inp.prop('checked', true); }, 0);
			}
			$(event.target).blur();
			return false;
		});

		var button = dialog.find('.btn-primary');
		button.attr("disabled", true);
		$(".btnText").text('-Select Activity-');
		$(".activity").tooltip({container: 'body'});

		$(".activity").click(function(){
			button.attr("disabled", true);
			$(".btnText").text('-Select Activity-');

			var btnText = '', names = [], num = 4, char = 15;
			for (var i in activities){
				for (var j in $scope.status.activities){
					if (activities[i] === $scope.status.activities[j].id){
						names.push($scope.status.activities[j].name);
						break;
					}
				}
			}

			for (var i = 0; i < names.length - 1; i++){
				btnText += names[i].substring(0, char);
				if (names[i].length > char){ btnText += '..., '; }
				else { btnText += ', '; }
			}

			if (names.length > 1){
				btnText += names[names.length - 1].substring(0, char);
				if (names[names.length - 1].length > char){ btnText += '...'; }
			}
			else if (names.length === 1){ btnText += names[0] + ' '; }
			
			if (activities.length >= num){ btnText = activities.length + ' Selected '; }

			if (activities.length > 0){
				button.attr("disabled", false);
				$(".btnText").text(btnText);
			}
		});
	};

	$scope.finishActivity = function(activity){
		var started = new Date(activity.dateCreated);
		var name = $("<div>").text(activity.name).html(), description = $("<div>").text(activity.description).html();
		var dialog = bootbox.dialog({
			title: 'Finish Activity?',
			message: 
				'<div class="row">'+
					'<div class="col-md-12">'+
						'<table class="table-condensed">'+
							'<tr><td>Name:</td><td>'+ name + '</td></tr>'+
							'<tr><td>Description:</td><td>'+ (description ? description : '') + '</td></tr>'+
							'<tr><td>Author:</td><td>'+ activity.username + '</td></tr>'+
							'<tr><td>Started:</td><td>'+ $filter('date')(started, "MM/dd/yyyy h:mma") + '</td></tr>'+
						'</table>'+
					'</div>'+
				'</div>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					confirm: {
						label: "OK",
						className: "btn-primary",
						callback: function(){
							$http({
								method: 'PUT',
								url: '/queueEntry/finishActivity',
								params: { id: $scope.id, activityID: activity.id }
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
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

	$scope.archiveActivity = function(activity){
		var started = new Date(activity.dateCreated);
		var finished = new Date(activity.finished);
		var dialog = bootbox.dialog({
			title: 'Archive Activity?',
			message: 
				'<div class="row">'+
				'<div class="col-md-12">'+
				'<table class="table-condensed">'+
				'<tr><td>Name:</td><td>'+ activity.name + '</td></tr>'+
				'<tr><td>Description:</td><td>'+ (activity.description ? activity.description : '') + '</td></tr>'+
				'<tr><td>Author:</td><td>'+ activity.username + '</td></tr>'+
				'<tr><td>Started:</td><td>'+ $filter('date')(started, "MM/dd/yyyy h:mma") + '</td></tr>'+
				'<tr><td>Finished:</td><td>'+ $filter('date')(finished, "MM/dd/yyyy h:mma") + '</td></tr>'+
				'</table>'+
				'</div>'+
				'</div>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					confirm: {
						label: "OK",
						className: "btn-primary",
						callback: function(){
							$http({
								method: 'PUT',
								url: '/queueEntry/archiveActivity',
								params: { id: $scope.id, activityID: activity.id }
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
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

	$scope.deleteActivity = function(activity){
		var started = new Date(activity.dateCreated);
		var finished = new Date(activity.finished);
		if (!activity.finished){ finished = "Present"; }
		else { finished = $filter('date')(finished, "MM/dd/yyyy h:mma"); }

		bootbox.dialog({
			title: 'DELETE Activity?',
			message: 
				'<div class="row">'+
				'<div class="col-md-12">'+
				'<table class="table-condensed">'+
				'<tr><td>Name:</td><td>'+ activity.name + '</td></tr>'+
				'<tr><td>Description:</td><td>'+ (activity.description ? activity.description : '') + '</td></tr>'+
				'<tr><td>Author:</td><td>'+ activity.username + '</td></tr>'+
				'<tr><td>Date:</td><td>'+ $filter('date')(started, "MM/dd/yyyy h:mma") + ' - '+ finished + '</td></tr>'+
				'</table>'+
				'</div>'+
				'</div>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					confirm: {
						label: "OK",
						className: "btn-primary",
						callback: function(){
							$http({
								method: 'DELETE',
								url: '/queueEntry/removeActivity',
								params: { id: $scope.id, activityID: activity.id }
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
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
/*************** END Detail Controller ***************/

/*************** QueueEntry Search Controller ***************/
controllers.controller('QueueEntrySearchCtrl', ['LoadService', 'BusyIndicator', 'Prompt', '$scope', '$http',
		function(LoadService, BusyIndicator, Prompt, $scope, $http){
	$scope.searchParams = { queueEntry: {} };
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
	
	$scope.search = function(tabCtrl, max, offset){
		if ($('*:invalid').length > 0){ return; }
		BusyIndicator.loading();
		delete $scope.errMsg;
		delete $scope.queueEntries;
		$http({
			method: 'GET',
			url: '/queueEntry/find',
			params: $scope.searchParams.queueEntry
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			
			$scope.max = Number(response.data.max);
			$scope.offset = Number(response.data.offset);
			$scope.total = Number(response.data.total);
			tabCtrl.setTab(2);

			LoadService.data = $scope.queueEntries = response.data.queueEntries;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
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
/*************** END Bookin Search Controller ***************/
