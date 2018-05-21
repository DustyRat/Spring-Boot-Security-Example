/* global angular, controllers, baseURL, d3 */
//= require_self
'use strict';

/* Dashboard Controllers */
controllers.controller('BookinTotalChartCtrl', ['Prompt', '$scope', '$http', function(Prompt, $scope, $http){
	var margin = {top: 20, right: 120, bottom: 120, left: 70},
		width = $('#chart').width(), height = 450,
		svg = d3.select('#chart').append('svg')
			.attr('width', width).attr('height', height)
			.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
		x = d3.scaleBand().range([0, width - margin.left - margin.right]).paddingOuter(.5).paddingInner(.5),
		y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]),
		keys = ['Unique-Bookins', 'Multi-Bookins'],
		color = d3.scaleOrdinal().domain(keys).range(['#0ea783', '#417aa7']),
		x_axis, y_axis, stack, layer, rect, legend;
	
	function load(){
		$scope.year = $('[name=year]').val();
		getData(draw);
		$('[name=year]').change(function(){
			$scope.year = $(this).val();
			getData(draw);
		});
	}
	load();
	
	function getData(callback){
		$http({
			method: 'GET',
			url: '/dashboard/getBookinTotalsByMonth',
			params: { year: $scope.year }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.data = response.data;
			$scope.total = 0;
			for (var i in $scope.data){ $scope.total += $scope.data[i].Total; }
			if (angular.isFunction(callback)){ callback(response.data); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	
	function draw(data){
		x.domain(data.map(function(d){ return d.Month; }));
		y.domain([0, d3.max(data, function(d) { return d.Total; })]).nice();
		stack = d3.stack().keys(keys)(data);
		
		svg.selectAll('#x-axis > g.tick').remove();
		if (x_axis){ x_axis.call(d3.axisBottom(x).tickSizeInner(0).tickSizeOuter(0)); }
		else {
			x_axis = svg.append('g')
				.attr('id', 'x-axis')
				.attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
				.call(d3.axisBottom(x).tickSizeInner(0).tickSizeOuter(0));
		}
		
		x_axis.selectAll('path').attr('display', 'none');
		x_axis.selectAll('g.tick > text').style('font-size', '14px');
	
		svg.selectAll('#y-axis > g.tick').remove();
		if (y_axis){
			y_axis.call(d3.axisLeft(y).tickSize(width).tickFormat(d3.format('d'))
				.tickSizeInner(margin.left + margin.right - width - 20).tickSizeOuter(0)
				.tickValues(y.ticks().map(function(tick){ return tick % 1 === 0 ? tick : ''; })));
		}
		else {
			y_axis = svg.append('g')
				.attr('id', 'y-axis')
				.attr('transform', 'translate(0, 0)')
				.call(d3.axisLeft(y).tickSize(width).tickFormat(d3.format('d'))
					.tickSizeInner(margin.left + margin.right - width - 20).tickSizeOuter(0)
					.tickValues(y.ticks().map(function(tick){ return tick % 1 === 0 ? tick : ''; })));
		}
		
		y_axis.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -60)
			.attr('x', -(height - margin.top - margin.bottom) / 2)
			.attr('dy', '.51em')
			.attr('fill', '#000')
			.style('text-anchor', 'middle')
			.style('font-size', '15px')
			.style('font-weight', '600')
			.text('Unique IDs & Multi-Bookins');
		
		y_axis.selectAll('path').attr('display', 'none');
		y_axis.selectAll('g.tick > text')
			.style('text-anchor', 'start')
			.style('font-size', '14px')
			.attr('y', -10)
			.attr('x', -25);
		
		y_axis.selectAll('g.tick > line')
			.attr('transform', 'translate(-25, 0)')
			.attr('stroke', '#eeeeee')
			.attr('shape-rendering', 'crispEdges');
		
		if (layer){ layer.data(stack); }
		else {
			layer = svg.selectAll('#layer')
				.data(stack)
				.enter().append('g')
				.attr('id', '#layer')
				.attr('fill', function(d){ return color(d.key); })
				.style('stroke', function(d, i){ return d3.rgb(color(i)).darker(); });
		}
		
		if (rect){ rect.data(function(d){ return d;}); }
		else {
			rect = layer.selectAll('rect')
				.data(function(d){ return d;})
				.enter().append('rect')
					.attr('x', function(d){ return x(d.data.Month); })
					.attr('y', y(0))
					.attr('height', 0)
					.attr('width', x.bandwidth());
		}

		rect.attr('data-toggle', 'tooltip')
			.attr('data-placement', 'left')
			.attr('title', function(d){ return d[1] - d[0]; })
			.attr('data-original-title', function(d){ return d[1] - d[0]; });
	
		$('rect').tooltip({container: 'body'});
		
		rect.transition().duration(1000)
			.attr('y', function(d){ return y(d[1]); })
			.attr('height', function(d){ return y(d[0]) - y(d[1]); });
		
		if (!legend){
			legend = svg.selectAll('.legend')
				.data(color.domain().slice(0,2).reverse())
				.enter().append('g')
				.attr('class', 'legend')
				.attr('transform', function(d, i){ return 'translate(' + (i * 200 - width + 59) + ', ' + (height - margin.top - margin.bottom + 50) + ')'; });

			legend.append('rect')
				.attr('x', width - 30)
				.attr('rx', 4)
				.attr('ry', 4)
				.attr('width', 15)
				.attr('height', 15)
				.style('fill', color)
				.style('stroke', function(d, i){ return d3.rgb(color(i)).darker(); });

			legend.append('text')
				.attr('x', width)
				.attr('y', 7)
				.attr('dy', '.35em')
				.style('text-anchor', 'start')
				.style('font-weight', '600')
				.text(function(d){ return d; });
		}
	}
}]);


controllers.controller('MultiBookinChartCtrl', ['Prompt', '$scope', '$http', function(Prompt, $scope, $http){
	var margin = {top: 20, right: 120, bottom: 120, left: 70},
		width = $('#chart').width(), height = 450,
		svg = d3.select('#chart').append('svg')
			.attr('width', width).attr('height', height)
			.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
		x = d3.scaleBand().range([0, width - margin.left - margin.right]).paddingOuter(.5).paddingInner(.5),
		y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]),
		color = d3.scaleOrdinal().range(['#0ea783', '#417aa7']),
		x_axis, y_axis, rect;
	
	function load(){
		$scope.year = $('[name=year]').val();
		getData(draw);
		$('[name=year]').change(function(){
			$scope.year = $(this).val();
			getData(draw);
		});
	}
	load();
	
	function getData(callback){
		$http({
			method: 'GET',
			url: '/dashboard/getMultiBookinTotals',
			params: { year: $scope.year }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.data = response.data;
			if (angular.isFunction(callback)){ callback(response.data); }
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	
	function draw(data){
		data.sort(function(a, b){ return b.bookins - a.bookins; });
		x.domain(data.map(function(d){ return d.idx; }));
		y.domain([0, d3.max(data, function(d){ return d.bookins; })]).nice();
		
		svg.selectAll('#x-axis > g.tick').remove();
		if (x_axis){
			x_axis.call(d3.axisBottom(x).tickSizeInner(0).tickSizeOuter(0).tickFormat(function(index){
				var tick = data.filter(function(e, i){ return i === index; })[0];
				return tick.clients;
			}));
		}
		else {
			x_axis = svg.append('g')
				.attr('id', 'x-axis')
				.attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
				.call(d3.axisBottom(x).tickSizeInner(0).tickSizeOuter(0).tickFormat(function(index){
					var tick = data.filter(function(e, i){ return i === index; })[0];
					return tick.clients;
				}));
				
			x_axis.append('text')
				.attr('x', (width - margin.left - margin.right)/2)
				.attr('y', 65)
				.attr('fill', '#999999')
				.style('text-anchor', 'middle')
				.style('font-size', '12px')
				.text('select bar for detail results');
		}
		
		x_axis.selectAll('path').attr('display', 'none');
		x_axis.selectAll('g.tick > text').style('font-size', '14px');
		
		svg.selectAll('#y-axis > g.tick').remove();
		if (y_axis){
			y_axis.call(d3.axisLeft(y).tickSize(width).tickFormat(d3.format('d'))
				.tickSizeInner(margin.left + margin.right - width - 20).tickSizeOuter(0)
				.tickValues(y.ticks().map(function(tick){ return tick % 1 === 0 ? tick : ''; })));
		}
		else {
			y_axis = svg.append('g')
				.attr('id', 'y-axis')
				.attr('transform', 'translate(0, 0)')
				.call(d3.axisLeft(y).tickSize(width).tickFormat(d3.format('d'))
					.tickSizeInner(margin.left + margin.right - width - 20).tickSizeOuter(0)
					.tickValues(y.ticks().map(function(tick){ return tick % 1 === 0 ? tick : ''; })));
		}

		y_axis.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -60)
			.attr('x', -(height - margin.top - margin.bottom) / 2)
			.attr('dy', '.51em')
			.attr('fill', '#000')
			.style('text-anchor', 'middle')
			.style('font-size', '15px')
			.style('font-weight', '600')
			.text('Bookin Count');

		y_axis.selectAll('path').attr('display', 'none');
		y_axis.selectAll('g.tick > text')
			.style('text-anchor', 'start')
			.style('font-size', '14px')
			.attr('y', -10)
			.attr('x', -25);

		y_axis.selectAll('g.tick > line')
			.attr('transform', 'translate(-25, 0)')
			.attr('stroke', '#eeeeee')
			.attr('shape-rendering', 'crispEdges');
		
		if (rect){ rect.remove(); }
		rect = svg.selectAll('bar')
			.data(data)
			.enter().append('rect')
				.attr('x', function(d){ return x(d.idx); })
				.attr('y', y(0))
				.attr('height', 0)
				.attr('width', x.bandwidth())
				.attr('fill', color)
				.style('stroke', function(d, i){ return d3.rgb(color(i)).darker(); })
				.style('cursor', 'pointer')
				.on('click', function(d){
					var url = window.location.href.replace('multiBookins', 'multiBookinDetail?count=' + d.bookins + '&year=' + $scope.year);
					window.open(url, '_self');
				});

		rect.attr('data-toggle', 'tooltip')
			.attr('data-placement', 'left')
			.attr('title', function(d){ return d.bookins; })
			.attr('data-original-title', function(d){ return d.bookins; });
	
		$('rect').tooltip({container: 'body'});
		
		rect.transition().duration(1000)
			.attr('y', function(d){ return y(d.bookins); })
			.attr('height', function(d){ return height - margin.top - margin.bottom - y(d.bookins); });
	};
}]);

controllers.controller('MultiBookinDetailCtrl', ['BusyIndicator', 'LoadService', 'Prompt', '$scope', '$http', '$location',
		function(BusyIndicator, LoadService, Prompt, $scope, $http, $location){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/dashboard/getMultiBookinDetails',
			params: { year: $location.search().year, count: $location.search().count }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.data = $scope.clients = response.data;
			LoadService.notifyObservers(BusyIndicator.hide);
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
}]);

controllers.controller('ScorecardCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http',
		function(BusyIndicator, Prompt, $scope, $http){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/dashboard/getScorecard'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			for (var key in response.data){
				$scope[key] = response.data[key];
			}
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
}]);

controllers.controller('ActiveTodayCtrl', ['BusyIndicator', 'Prompt', '$scope', '$http',
		function(BusyIndicator, Prompt, $scope, $http){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/dashboard/getActiveToday'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			for (var key in response.data){
				$scope[key] = response.data[key];
			}
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	}
	load();
}]);
