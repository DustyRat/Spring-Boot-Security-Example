/* global angular, baseURL */
//= require main/app
//= require_self
'use strict';

/* Directives */
var directives = angular.module('directives', []);

directives.directive('clientView', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/client-view.gsp'
	};
}]);

directives.directive('matchDetails', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/match-details.gsp'
	};
}]);

directives.directive('bookinDetails', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/bookin-details.gsp'
	};
}]);

directives.directive('clientDetails', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/client-details.gsp'
	};
}]);

directives.directive('detectionSource', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/detection-source.gsp'
	};
}]);

directives.directive('services', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/services.gsp'
	};
}]);

directives.directive('medications', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/medications.gsp'
	};
}]);

directives.directive('logs', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/logs.gsp'
	};
}]);

directives.directive('predictiveDetails', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/predictive-details.gsp'
	};
}]);

directives.directive('charges', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/charges.gsp'
	};
}]);

directives.directive('holds', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/holds.gsp'
	};
}]);

directives.directive('notes', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/notes.gsp'
	};
}]);

directives.directive('activities', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/activities.gsp'
	};
}]);

directives.directive('reasons', [function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/snippets/reasons.gsp'
	};
}]);

directives.directive('dualListBox', [function(){
	function controller($scope){
		$("#selected, #unselected").mousedown(function(e){
			e.preventDefault();
			e.target.selected = !e.target.selected;
		});

		$scope.moveAll = function(){
			$('#unselected>option').each(function(i, selected){
				var obj = JSON.parse($(selected).val());
				$scope.options = removeItem($scope.options, obj);
				$scope.target.push(obj);
			});
			$('#unselected').children().removeAttr("selected");
		};

		$scope.removeAll = function(){
			$('#selected>option').each(function(i, selected){
				var obj = JSON.parse($(selected).val());
				$scope.target = removeItem($scope.target, obj);
				$scope.options.push(obj); 
			});
			$('#selected').children().removeAttr("selected");
		};

		$scope.moveSelected = function(){
			if (!$scope.target){ $scope.target = []; }
			$('#unselected>option:selected').each(function(i, selected){
				var obj = JSON.parse($(selected).val());
				$scope.options = removeItem($scope.options, obj);
				$scope.target.push(obj);
			});
			$('#unselected').children().removeAttr("selected");
		};

		$scope.removeSelected = function(){
			if (!$scope.options){ $scope.options = []; }
			$('#selected>option:selected').each(function(i, selected){
				var obj = JSON.parse($(selected).val());
				$scope.target = removeItem($scope.target, obj);
				$scope.options.push(obj); 
			});
			$('#selected').children().removeAttr("selected");
		};

		function removeItem(array, obj){
			for (var i = array.length - 1; i >= 0; i--){
				if (angular.equals(array[i], obj)){
					array.splice(i, 1);
					break;
				}
			}
			return array;
		}
	};
	controller.$inject = ['$scope'];
	return {
		restrict: 'E',
		replace: true,
		controller: controller,
		templateUrl: '/snippets/dual-list-box.html',
		scope: {
			target: '=',
			options: '=',
			displayKey: '=',
			targetLabel: '=',
			optionsLabel: '='
		}
	};
}]);

directives.directive('multiListCheckBox', [function(){
	function controller(Prompt, $scope, $http){
		function load(){
			if ($scope.selectionItemsData === undefined){
				$http({
					method: 'GET',
					url: $scope.selectionItemsUrl
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					$scope.selectionItemsData = response.data;
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					Prompt(response.data);
				});
			}
		}
		load();
	};
	controller.$inject = ['Prompt', '$scope', '$http'];
	return {
		restrict: 'E',
		replace: true,
		controller: controller,
		templateUrl: '/snippets/multi-list-check-box.html',
		scope: {
			label: '=',
			labels: '=',
			keys: '=',
			targetItem: '=',
			targetItemKey: '=',
			selectionItemsData: '=?',
			selectionItemsUrl: '=?',
			selectionItemsIdKey: '=',
			selectionItemsDisplayKey: '=',
			save: '&?',
			cancel: '&?'
		}
	};
}]);

directives.directive('listCheckBox', [function(){
	function controller(Prompt, $scope, $http){
		function load(){
			if ($scope.selectionItemsUrl === undefined && $scope.selectionItemsData !== undefined){
				$scope.selectionItems = $scope.selectionItemsData;
			}
			else if ($scope.selectionItemsUrl !== undefined){
				$http({
					method: 'GET',
					url: $scope.selectionItemsUrl
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					$scope.selectionItems = response.data;
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					Prompt(response.data);
				});
			}
			if ($scope.targetItem[$scope.targetItemKey] === undefined){ $scope.targetItem[$scope.targetItemKey] = []; }
		}
		load();

		$scope.$watch('selectionItems', function(){
			$scope.selectionDisplay = selectionDisplay($scope.selectionItems);
			$scope.itemsPerColmun = Math.ceil($scope.selectionDisplay.length/3);
		});

		function selectionDisplay(data){
			var retVal = [];
			for (var i in data){
				retVal.push({
					id: data[i][$scope.selectionItemsIdKey],
					displayName: data[i][$scope.selectionItemsDisplayKey],
					data: data[i]
				});
			}
			return retVal;
		}

		$scope.selectAll = function(){
			if ($scope.targetItem[$scope.targetItemKey] === undefined){ $scope.targetItem[$scope.targetItemKey] = []; }
			for (var i in $scope.selectionItems){
				var index = indexOf($scope.targetItem[$scope.targetItemKey], $scope.selectionItems[i], $scope.selectionItemsIdKey);
				if (index === -1){ $scope.targetItem[$scope.targetItemKey].push($scope.selectionItems[i]); }
			}
		};

		$scope.selectNone = function(){
			for (var i in $scope.selectionItems){
				var index = indexOf($scope.targetItem[$scope.targetItemKey], $scope.selectionItems[i], $scope.selectionItemsIdKey);
				if (index > -1){ $scope.targetItem[$scope.targetItemKey].splice(index, 1); }
			}
		};

		$scope.pushPull = function(id){
			if (!$scope.targetItem[$scope.targetItemKey]){
				$scope.targetItem[$scope.targetItemKey] = [];
			}

			for (var i in $scope.targetItem[$scope.targetItemKey]){
				if ($scope.targetItem[$scope.targetItemKey][i][$scope.selectionItemsIdKey] === id){
					$scope.targetItem[$scope.targetItemKey].splice(i, 1);
					return;
				}
			}

			for (var i in $scope.selectionItems){
				if ($scope.selectionItems[i][$scope.selectionItemsIdKey] === id){
					$scope.targetItem[$scope.targetItemKey].push($scope.selectionItems[i]);
					return;
				}
			}
		};

		$scope.checked = function(item){
			return indexOf($scope.targetItem[$scope.targetItemKey], item, $scope.selectionItemsIdKey) > -1;
		};

	};
	controller.$inject = ['Prompt', '$scope', '$http'];
	return {
		restrict: 'E',
		replace: true,
		controller: controller,
		templateUrl: '/snippets/list-check-box.html',
		scope: {
			label: '=',
			targetItem: '=',
			targetItemKey: '=',
			selectionItemsData: '=?',
			selectionItemsUrl: '=?',
			selectionItemsIdKey: '=',
			selectionItemsDisplayKey: '=',
			save: '&?',
			cancel: '&?'
		}
	};
}]);

directives.directive('imageSelect', [function(){
	function controller(LoadService, $scope){
		var imageSelect = $('#imageSelect'),
			check = $('<i>').attr('id', 'check').addClass('fa fa-check-circle fa-2x').css({ color: '#0ea783', position: 'absolute', bottom: '0', right: '0' }).attr('aria-hidden', 'true');
		LoadService.registerObserver(function(){
			imageSelect.empty();
			$scope.ref = baseURL + $scope.baseRef;
			angular.forEach(LoadService.imageSelect.images, function(item){
				var id = item[$scope.key], link = $scope.ref + id,
					label = $('<label>').css({position: 'relative', display: 'inline-block'}),
					checkbox = $('<input type="checkbox">').attr('value', id).attr('name', 'imageSelect'),
					image = $('<img>').attr('id', id).attr('src', link)
						.css({ height: '100px', width: '100px', border: '1px solid grey', 'border-radius': '4px', margin: '0px 3px', cursor: 'pointer' }),
					remove = $('<i>').attr('id', 'remove').addClass('fa fa-trash-o fa-2x').css({ color: '#a94442', position: 'absolute', top: '0', right: '0', cursor: 'pointer' }).attr('aria-hidden', 'true');
				
				var watch = $scope.$watch('target', function(){
					if (angular.equals($scope.target, item)){
						checkbox.prop('checked', true);
						image.css({ border: '3px solid #0ea783' });
						label.append(check);
					}
					watch();
				});
				
				remove.on('click', function(event){
					event.stopPropagation();
					LoadService.imageSelect.remove(item, function successCallback(){
						if (checkbox.is(':checked')){ $scope.target = null; }
						label.remove();
					}, function errorCallback(response){
						if (response.status === 404){
							if (checkbox.is(':checked')){ $scope.target = null; }
							label.remove();
						}
					});
					$scope.$apply();
				});
				
				checkbox.on('click', function(){
					imageSelect.children('label').children('i#check').remove();
					imageSelect.children('label').children('img').css({ border: '1px solid grey' });
					if (checkbox.is(':checked')){
						imageSelect.children('label').children('input').prop('checked', false);
						
						checkbox.prop('checked', true);
						image.css({ border: '3px solid #0ea783' });
						label.append(check);
						$scope.target = item;
					}
					else {
						image.css({ border: '1px solid grey' });
						$scope.target = null;
					}
					$scope.$apply();
				});

				label.append(checkbox);
				label.append(image);
				label.append(remove);
				imageSelect.append(label);
			});
		});
	}
	controller.$inject = ['LoadService', '$scope'];
	return {
		restrict: 'E',
		replace: true,
		controller: controller,
		templateUrl:  '/snippets/image-select.html',
		scope: {
			baseRef: '@',
			key: '@',
			target: '='
		}
	};
}]);

directives.directive('upload', [function(){
	function controller(FileUploader, LoadService, $scope){
		$scope.uploader = new FileUploader({ url: baseURL + $scope.ref, headers: { xsrf_token: getCookie('xsrf_token') }, queueLimit: 1 });
		
		// FILTERS
//		$scope.uploader.filters.push({
//			name: 'queueSize',
//			fn: function(item, options){
//				return this.queue.length < 10;
//			}
//		});

		// CALLBACKS
//		$scope.uploader.onWhenAddingFileFailed = function(item , filter, options){
//			console.info('onWhenAddingFileFailed', item, filter, options);
//		};

		$scope.uploader.onAfterAddingFile = function(fileItem){
			console.info('onAfterAddingFile', fileItem);
			$scope.$apply();
			if ($scope.accept.match('image/*').length > 0){
				var image = $('<img>').attr('src', URL.createObjectURL(fileItem._file))
					.css({ height: '50px', width: '50px', border: '1px solid grey', 'border-radius': '4px' });
				$('[id="' + fileItem.file.name + '"]').prepend(image);
			}
		};
		
//		$scope.uploader.onAfterAddingAll = function(addedFileItems){
//			console.info('onAfterAddingAll', addedFileItems);
//		};
//
//		$scope.uploader.onBeforeUploadItem = function(item){
//			console.info('onBeforeUploadItem', item);
//		};
//		
//		$scope.uploader.onProgressItem = function(fileItem, progress){
//			console.info('onProgressItem', fileItem, progress);
//		};
//		
//		$scope.uploader.onProgressAll = function(progress){
//			console.info('onProgressAll', progress);
//		};
		
		$scope.uploader.onSuccessItem = function(fileItem, response, status, headers){
			console.trace('onSuccessItem', { fileItem: fileItem, response: response, status: status, headers: headers });
			if (angular.isFunction($scope.onSuccessItem)){ $scope.onSuccessItem(); };
			if (angular.isFunction(LoadService.upload.onSuccessItem)){ LoadService.upload.onSuccessItem(response); };
			fileItem.remove();
		};
		
		$scope.uploader.onErrorItem = function(fileItem, response, status, headers){
			console.error('onErrorItem', { fileItem: fileItem, response: response, status: status, headers: headers });
//			if (angular.isFunction(LoadService.upload.callback)){ LoadService.upload.callback(response); };
		};
		
//		$scope.uploader.onCancelItem = function(fileItem, response, status, headers){
//			console.info('onCancelItem', { fileItem: fileItem, response: response, status: status, headers: headers });
//		};
//		
//		$scope.uploader.onCompleteItem = function(fileItem, response, status, headers){
//			console.info('onCompleteItem', { fileItem: fileItem, response: response, status: status, headers: headers });
//		};
//		
//		$scope.uploader.onCompleteAll = function(){
//			console.info('onCompleteAll');
//		};
		
		$scope.moveUp = function(index){
			var tmp = $scope.uploader.queue[index-1];
			$scope.uploader.queue[index-1] = $scope.uploader.queue[index];
			$scope.uploader.queue[index] = tmp;
		};
		
		$scope.moveDown = function(index){
			var tmp = $scope.uploader.queue[index+1];
			$scope.uploader.queue[index+1] = $scope.uploader.queue[index];
			$scope.uploader.queue[index] = tmp;
		};
	}
	controller.$inject = ['FileUploader', 'LoadService', '$scope'];
	return {
		restrict: 'E',
		replace: true,
		controller: controller,
		templateUrl:  '/snippets/upload.html',
		scope: { ref: '@', accept: '@', onSuccessItem: '&?' }
	};
}]);

directives.directive('multiUpload', [function(){
	function controller(FileUploader, $scope){
		$scope.uploader = new FileUploader({ url: baseURL + $scope.url, headers: { xsrf_token: getCookie('xsrf_token') } });
		
		// FILTERS
//		$scope.uploader.filters.push({
//			name: 'queueSize',
//			fn: function(item /*{File|FileLikeObject}*/, options){
//				return this.queue.length < 10;
//			}
//		});

		// CALLBACKS
//		$scope.uploader.onWhenAddingFileFailed = function(item , filter, options){
//			console.info('onWhenAddingFileFailed', item, filter, options);
//		};
//		
//		$scope.uploader.onAfterAddingFile = function(fileItem){
//			console.info('onAfterAddingFile', fileItem);
//		};
//		
//		$scope.uploader.onAfterAddingAll = function(addedFileItems){
//			console.info('onAfterAddingAll', addedFileItems);
//		};
//		
//		$scope.uploader.onBeforeUploadItem = function(item){
//			console.info('onBeforeUploadItem', item);
//		};
//		
//		$scope.uploader.onProgressItem = function(fileItem, progress){
//			console.info('onProgressItem', fileItem, progress);
//		};
//		
//		$scope.uploader.onProgressAll = function(progress){
//			console.info('onProgressAll', progress);
//		};
		
		$scope.uploader.onSuccessItem = function(fileItem, response, status, headers){
			console.info('onSuccessItem', fileItem, response, status, headers);
		};
		
		$scope.uploader.onErrorItem = function(fileItem, response, status, headers){
			console.error('onErrorItem', fileItem, response, status, headers);
		};
		
//		$scope.uploader.onCancelItem = function(fileItem, response, status, headers){
//			console.info('onCancelItem', fileItem, response, status, headers);
//		};
		
//		$scope.uploader.onCompleteItem = function(fileItem, response, status, headers){
//			console.info('onCompleteItem', fileItem, response, status, headers);
//		};
		
//		$scope.uploader.onCompleteAll = function(){
//			console.info('onCompleteAll');
//		};
		
		$scope.moveUp = function(index){
			var tmp = $scope.uploader.queue[index-1];
			$scope.uploader.queue[index-1] = $scope.uploader.queue[index];
			$scope.uploader.queue[index] = tmp;
		};
		
		$scope.moveDown = function(index){
			var tmp = $scope.uploader.queue[index+1];
			$scope.uploader.queue[index+1] = $scope.uploader.queue[index];
			$scope.uploader.queue[index] = tmp;
		};
	}
	controller.$inject = ['FileUploader', '$scope'];
	return {
		restrict: 'E',
		replace: true,
		controller: controller,
		templateUrl:  '/snippets/multi-upload.html',
		scope: { ref: '@', accept: '@' }
	};
}]);

directives.directive('ngCollapse', ['$filter', function($filter){
	return {
		restrict: 'A',
		compile: function ngCollapseCompile($element, $attr){
			var expression = $attr.ngCollapse, args = expression.split(/:/), element = $(args[0]), display;
			if (args.length > 0){ display = $filter('toBoolean')(args[1]); }
			else display = true;
			
			return {
				post: function($scope, $element){
					$scope.display = display;
					element.toggle(display);
					$element.click(function(){
						$scope.display = !element.is(":visible");
						$scope.$apply();
						element.slideToggle({ duration: 400, easing: 'linear' });
					});
				}
			};
		}
	};
}]);

directives.directive('phoneInput', ['$filter', '$browser', function($filter, $browser){
	return {
		restrict: 'E',
		replace: true,
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModel){
			var listener = function(){
				var value = $element.val().replace(/[^0-9]/g, '');
				$element.val($filter('phone')(value, false));
			};

			ngModel.$parsers.push(function(viewValue){
				return viewValue.replace(/[^0-9]/g, '');
			});

			ngModel.$render = function(){
				$element.val($filter('phone')(ngModel.$viewValue, false));
			};

			$element.bind('change', listener);
			$element.bind('keydown', function(event){
				var key = event.keyCode;
				if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){ return; }
				$browser.defer(listener);
			});

			$element.bind('paste cut', function(){
				$browser.defer(listener);
			});
		},
		template: '<input id="phone" type="tel">'
	};
}]);

directives.directive('stringToNumber', [function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel){
			ngModel.$parsers.push(function(value){
				return '' + value;
			});
			ngModel.$formatters.push(function(value){
				return parseFloat(value);
			});
		}
	};
}]);