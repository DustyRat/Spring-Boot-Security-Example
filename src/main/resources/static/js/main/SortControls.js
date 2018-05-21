/* global angular, _, app */
//= require_self

'use strict';

var SortControls = app || angular.module('SortControls', []);

SortControls.factory('FacetService', ['$filter', function($filter){
	function FacetService(){
		this.data = [];
		this.facets = [];
		this.keys = {};
		this.filters = {};
		this.counts = {};
	}
	
	FacetService.prototype = {
		_init_: function(scope, data, filters){
			this.$scope = scope;
			this.$scope.data = this.data = !_.isEmpty(data) ? data : [];
			this.counts = {};
			var $this = this;
			for (var key in this.keys){
				this.keys[key] = {};
				angular.forEach(getValues($this.data, key), function(value){
					if ((angular.isArray(value) && value.length === 0) || value === undefined || value === null || value === ''){
						$this.keys[key]['N/A'] = $filter('filter')($this.data, function(item){
							return item[key] === undefined || item[key] === null || item[key] === '' || item[key].length === 0;
						});
					}
					else {
						var filter = {};
						filter[key] = value;
						$this.keys[key][value] = $filter('filter')($this.data, filter, true);
					}
				});
			}
			this.filters = filters ? angular.copy(filters) : {};
			for (var key in this.filters){
				if (key === '$'){ continue; }
				if (!this.keys.hasOwnProperty(key)){
					delete this.filters[key];
					continue;
				}
				for (var index = this.filters[key].length - 1; index >= 0 ; index--){
					var value = this.filters[key][index];
					if (!this.keys[key].hasOwnProperty(value)){ this.filters[key].splice(index, 1); }
				}
				if (_.isEmpty(this.filters[key])){ delete this.filters[key]; }
			}
			update(this, filter(this));
		},
		registerFacet: function(facet){
			this.facets.push(facet);
			this.keys[facet.key] = {};
		},
		filter: function(filters){ 
			if (!this.$scope){ return; }
			if (filters){ this.filters = filters; }
			update(this, filter(this));
		},
		setFilter: function(key, value){
			if (!this.$scope){ return; }
			if (key === '$'){ this.filters[key] = value; }
			else if (this.filters.hasOwnProperty(key)){
				var index = indexOf(this.filters[key], value);
				if (index > -1){
					this.filters[key].splice(index, 1);
					if (this.filters[key].length === 0){ delete this.filters[key]; }
				}
				else { this.filters[key].push(value); }
			}
			else { this.filters[key] = [value]; }
			update(this, filter(this));
		},
		removeFilter: function(key){
			if (!this.$scope){ return; }
			if (this.filters.hasOwnProperty(key)){ delete this.filters[key]; }
			update(this, filter(this));
		},
		resetFilters: function(){
			if (!this.$scope){ return; }
			this.filters = {};
			update(this, filter(this));
		}
	};
	
	function filter($this){
		var unions = {};
		for (var key in $this.filters){
			if (!unions[key]){ unions[key] = []; }
			if (key === '$'){ 
				var filter = {};
				filter[key] = $this.filters[key] ? $this.filters[key] : '';
				unions[key] = _.union(unions[key], $filter('filter')($this.data, filter));
			}
			else {
				for (var i in $this.filters[key]){
					var value = $this.filters[key][i];
					unions[key] = _.union(unions[key], $this.keys[key][value]);
				}
			}
		}
		
		var data = [];
		for (var key in unions){
			if (data.length === 0){ data = unions[key]; }
			else { data = _.intersection(data, unions[key]); }
		}
		return _.isEmpty($this.filters) ? $this.data : data;
	}
	
	function update($this, data){
		$this.$scope.data = data;
		count($this);
	}
	
	function count($this){
		for (var key in $this.keys){
			var _this = { data: $this.data, keys: $this.keys, filters: angular.copy($this.filters) }, data = [];
			if (_this.filters.hasOwnProperty(key)){ delete _this.filters[key]; }
			data = filter(_this);
			if (!$this.counts.hasOwnProperty(key)){ $this.counts[key] = []; }
			for (var value in $this.keys[key]){
				var obj = { value: value, count: _.intersection(data, $this.keys[key][value]).length },
					index = indexOf($this.counts[key], obj, 'value');
				if (obj.count > 0 || ($this.filters.hasOwnProperty(key) && $this.filters[key].indexOf(value) > -1)){
					if (index > -1){ $this.counts[key][index] = obj; }
					else { $this.counts[key].push(obj); }
				}
				else if (index > -1){ $this.counts[key].splice(index, 1); }
			}
		}
		angular.forEach($this.facets, function(facet){ facet.counts = $this.counts[facet.key]; });
	}
	
	function getValues(data, key){
		var values = [];
		angular.forEach(_.uniq(data.map(function(item){ return item[key]; })), function(item){
			if (angular.isArray(item)){
				if (item.length === 0){ values.push([]); }
				angular.forEach(item, function(value){ values.push(value); });
			}
			else { values.push(item); }
		});
		return values.filter(function(value, index, self){ return indexOf(self, value) === index; }).sort();
	}
	
	return { getInstance: function (){ return new FacetService(); } };
}]);

SortControls.controller('SortCtrl', ['Storage', 'LoadService', 'FacetService', '$scope', '$window',
		function(Storage, LoadService, FacetService, $scope, $window){
	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;
	$scope.options = {};
	$scope.service = FacetService.getInstance();
	
	function load(){
		$scope.options = Storage.getSessionStorage($window.location.pathname);
		$scope.options = $scope.options ? $scope.options : {};
		if (!$scope.options.hasOwnProperty($scope.$id)){ $scope.options[$scope.$id] = { filters: {}, sortType: '', sortReverse: ''}; }

		LoadService.registerObserver(function(data){
			$scope.sortType = $scope.options[$scope.$id].sortType;
			$scope.sortType = $scope.sortType ? $scope.sortType : $scope.defaultSort;
			
			$scope.sortReverse = $scope.options[$scope.$id].sortReverse;
			$scope.sortReverse = typeof $scope.sortReverse === "boolean" ? $scope.sortReverse : $scope.defaultReverse;
			
			if ($scope.rememberSort){
				$scope.options[$scope.$id].sortType = $scope.sortType;
				$scope.options[$scope.$id].sortReverse = $scope.sortReverse;
			}

			$scope.data = [];
			$scope.service._init_($scope, $scope.dataKey ? data[$scope.dataKey] : data, $scope.options[$scope.$id].filters);
			$scope.total = $scope.service.data.length;
		});
	}
	load();

	$scope.$watch('currentPage + itemsPerPage + data', function(){
		$scope.totalItems = $scope.data ? $scope.data.length : 0;
		$scope.begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.end = ($scope.begin + $scope.itemsPerPage < $scope.totalItems) ? $scope.begin + $scope.itemsPerPage : $scope.totalItems;
		if ($scope.itemsPerPage < $scope.totalItems){ $scope.hide = false; }
		else {
			$scope.currentPage = 1;
			$scope.hide = true;
		}
		if ($scope.data && angular.isFunction($scope.update)){ $scope.update($scope.data); }
	});
	
	$scope.$watch('options[$id].filters.$', function(){
		if ($scope.options[$scope.$id].filters !== undefined){
			$scope.service.setFilter('$', $scope.options[$scope.$id].filters.$);
			saveOptions();
		}
	});
	
	$scope.changeSort = function(type){
		if (angular.equals(type, $scope.sortType)){
			$scope.sortReverse = !$scope.sortReverse;
		}
		else {
			$scope.sortType = type;
			$scope.sortReverse = false;
		}
		
		if ($scope.rememberSort){
			$scope.options[$scope.$id].sortType = $scope.sortType;
			$scope.options[$scope.$id].sortReverse = $scope.sortReverse;
			saveOptions();
		}
	};
	
	$scope.sorted = function(type){
		return angular.equals($scope.sortType, type);
	};
	
	$scope.filter = function(key, value){
		$scope.service.setFilter(key, value);
		$scope.options[$scope.$id].filters = $scope.service.filters;
		saveOptions();
	};
	
	$scope.reset = function(){
		$scope.service.resetFilters();
		$scope.options[$scope.$id].filters = $scope.service.filters;
		saveOptions();
	};
	
	$scope.resetFacet = function(key){
		$scope.service.removeFilter(key);
		$scope.options[$scope.$id].filters = $scope.service.filters;
		saveOptions();
	};
	
	function saveOptions(){
		var options = Storage.getSessionStorage($window.location.pathname);
		if (!options){ options = {}; }
		options[$scope.$id] = $scope.options[$scope.$id];
		Storage.setSessionStorage($window.location.pathname, options);
	}
}]);

SortControls.directive('facet', [function(){
	function controller($scope){
		$scope.service = $scope.$parent.service;
		$scope.service.registerFacet($scope);
		
		$scope.resize = function(event, id){
			var element = $('#' + id),
			height = element.height(),
			origin = { "x": event.pageX, "y": event.pageY };
			
			function ondrag(event){
				var hght = height + event.pageY - origin.y;
				element.height(Math.max(hght, 10));
				return false; //stop propagation
			};
			$(document).on("mousemove", ondrag);

			function dragdone(){ $(document).off("mousemove", ondrag); };
			$('body').one("mouseup", dragdone);
			return false;
		};
		
		$scope.select = function(value){
			$scope.$parent.filter($scope.key, value);
		};
		
		$scope.isChecked = function(value){
			return $scope.service.filters.hasOwnProperty($scope.key) && indexOf($scope.service.filters[$scope.key], value) > -1;
		};
		
		$scope.reset = function(){
			$scope.$parent.resetFacet($scope.key);
		};
		
		$scope.comparator = function(v1, v2){
			if (v1.type !== 'string' || v2.type !== 'string'){ return (v1.index < v2.index) ? -1 : 1; }
			if (v1.value.toLocaleLowerCase() === 'n/a' && v2.value.toLocaleLowerCase() === 'yes'){ return -1; }
			if (v2.value.toLocaleLowerCase() === 'n/a' && v1.value.toLocaleLowerCase() === 'yes'){ return 1; }
			if (v1.value.toLocaleLowerCase() === 'n/a' || v1.value.toLocaleLowerCase() === 'yes'){ return -1; }
			if (v2.value.toLocaleLowerCase() === 'n/a' || v2.value.toLocaleLowerCase() === 'yes'){ return 1; }
			return v1.value.localeCompare(v2.value);
		};
	};
	return {
		restrict: 'E',
		replace: true,
		controller: controller,
		templateUrl: '/snippets/facet.html',
		scope: {
			label: '=',
			key: '=',
			size: '=?'
		}
	};
}]);