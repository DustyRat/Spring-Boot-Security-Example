/* global angular, controllers, baseURL, browser, pdfMake */
//= require main/app
//= require main/controllers/PrintFormatController
//= require pdfMake.min
//= require_self
'use strict';

/* Controllers */
controllers.controller('PrintCtrl', ['Storage', 'FormatCtrls', 'BusyIndicator', '$scope', '$http', '$q', '$window', '$filter',
		function(Storage, FormatCtrls, BusyIndicator, $scope, $http, $q, $window, $filter){
	function load(){
		$scope.date = new Date();
		var promises = [];
		BusyIndicator.loading();
		var queueEntries = Storage.getSessionStorage('selectedEntries').print;
		if (!queueEntries){ queueEntries = []; }

		promises.push($http({
			method: 'GET',
			url: '/print/getQueueEntries',
			params: { id: queueEntries.map(function(item) { return item.id; }) }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.queueEntries = response.data.queueEntries;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		}));

		promises.push($http({
			method: 'GET',
			url: '/format/getFormats'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.formats = response.data.formats;
			for (var i in $scope.formats){
				FormatCtrls.setSort($scope.formats[i]);
			}
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		}));

		$q.all(promises).then(function(){
			BusyIndicator.hide();
		});
	}
	load();
	
	function getBase64Image(image) {
		var canvas = document.createElement("canvas");
		canvas.width  = image.naturalWidth;
	    canvas.height = image.naturalHeight;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
		var dataURL = canvas.toDataURL("image/jpeg");
	    return dataURL;
	}

	$scope.print = function(){
		if (!$scope.format){ return; }
		try {
			var version = browser.version.split('.')[0];
			if (browser.name === 'Edge' || (browser.name === 'IE' && parseInt(version) >= 10)){ generatePDF().download($scope.format.name + '.pdf'); }
			else if (browser.name === 'IE'){ window.print(); }
			else { generatePDF().print(); }
		}
		catch (e){
			console.error(e);
			window.print();
		}
	};
	
	function generatePDF(){
//		margin: [ LEFT, TOP, RIGHT, BOTTOM ]
		var docDefinition = {
			header: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
			content: [],
			styles: {
				h1: {
		            alignment: 'center',
		            bold: true,
		            fontSize: 18,
		            margin: [0, 30, 100, 0]
		        },
				table: {
		            margin: [0, 3, 0, 3]
				},
				th: {
					bold: true,
		            fontSize: 10
				}
			},
			defaultStyle: {
				alignment: 'left',
				color: 'black',
	            fontSize: 8
			}
		};
		
		var header = { columns: [] };
		if ($scope.format.logo){ header.columns.push({ width: 'auto', stack: [{ image: getBase64Image(document.getElementById('tableLogo')), fit: [100, 100] }] }); }
		else { docDefinition.styles.h1.margin = [0, 50, 0, 0]; }
		
		header.columns.push({ width: '*', stack: [ { style: 'h1', text: $scope.format.title } ] });
		docDefinition.content.push(header);
		
		var date = { margin: [0, 0, 0, 2], columnGap: 5, columns: [] }, count = { margin: [0, 0, 0, 2], columnGap: 5, columns: [] };;
		
		if ($scope.format.dateLabel && $scope.format.dateLabel !== ''){ date.columns.push({ width: 'auto', text: $scope.format.dateLabel, bold: true }); }
		if ($scope.format.countLabel && $scope.format.countLabel !== ''){ count.columns.push({ width: 'auto', text: $scope.format.countLabel, bold: true }); }
		date.columns.push({ width: '*', text: $filter('date')($scope.date, $scope.format.dateFormat), bold: true });
		count.columns.push({ width: '*', text: $scope.queueEntries.length, bold: true });
		
		if ($scope.format.showTopDate){ docDefinition.content.push(angular.copy(date)); }
		if ($scope.format.showTopCount){ docDefinition.content.push(angular.copy(count)); }
		
		var tableDefinition = {
			style: 'table',
			table: {
				widths: '*',
				headerRows: 1,
				body: []
			},
			layout: {
				hLineWidth: function (){ return 1; },
				vLineWidth: function (){ return 1; },
				hLineColor: function (){ return 'gray'; },
				vLineColor: function (){ return 'gray'; }
			}
		};
		
		var headers = [];
		angular.forEach($scope.format.header.columns, function(column){
			headers.push(angular.extend({ text: '', style: 'th'}, { text: column.name, colSpan: column.colspan ? column.colspan : 1 }));
			if (column.colspan > 1){ for (var i = 0; i < column.colspan - 1; i++){ headers.push(''); } }
		});
		tableDefinition.table.body.push(headers);

		var rows = [$scope.format.header];
		rows = rows.concat($scope.format.rows);
		
		var body = [];
		angular.forEach(rows, function(row){
			var columns = [];
			angular.forEach(row.columns, function(column){
				columns.push(column);
				if (column.colspan > 1){ for (var i = 0; i < column.colspan - 1; i++){ columns.push(''); } }
			});
			body.push(columns);
		});
		
		for (var i = 0; i < body.length; i++){
			for (var j = 0; j < body[i].length; j++){
				if (body[i][j] !== '' && body[i][j].rowspan > 1){
					for (var k = 1; k < body[i][j].rowspan; k++){
						for (var l = 0; l < body[i][j].colspan; l++){
							body[i + k].splice(j, 0, '');
						}
					}
				}
			}
		}
		
		var footers = [];
		angular.forEach($scope.format.footers, function(row){
			var columns = [];
			angular.forEach(row.columns, function(column){
				columns.push(column);
				if (column.colspan > 1){ for (var i = 0; i < column.colspan - 1; i++){ columns.push(''); } }
			});
			footers.push(columns);
		});
		
		for (var i = 0; i < footers.length; i++){
			for (var j = 0; j < footers[i].length; j++){
				if (footers[i][j] !== '' && footers[i][j].rowspan > 1){
					for (var k = 1; k < footers[i][j].rowspan; k++){
						for (var l = 0; l < footers[i][j].colspan; l++){
							footers[i + k].splice(j, 0, '');
						}
					}
				}
			}
		}
		
		var maxPerPage = Math.floor((40 / rows.length) - 1);
		angular.forEach($filter('orderBy')($scope.queueEntries, $scope.format.sort), function(queueEntry){
			angular.forEach(body, function(row){
				var columns = [], pageBreak = '';
				angular.forEach(row, function(column){
					if (column === ''){ columns.push(''); }
					else if (column.isHeader){
						if ($scope.format.header.columns.indexOf(column) > -1){
							columns.push({ text: 'placeholder', color: 'white', rowSpan: column.rowspan ? column.rowspan : 1, colSpan: column.colspan ? column.colspan : 1 , pageBreak: pageBreak });
						}
						else {
							columns.push({ text: column.name, bold: true, rowSpan: column.rowspan ? column.rowspan : 1, colSpan: column.colspan ? column.colspan : 1 , pageBreak: pageBreak });
						}
					}
					else {
						var value;
						if (column.parentKey){ value = queueEntry[column.parentKey][column.key]; }
						else { value = queueEntry[column.key]; }
						switch (column.type){
							case 'Date':
								if (column.format){ value = $filter('date')(value, column.format); }
								break;
							case 'Boolean': value = $filter('yesNo')(value, 'UNK');
								break;
						}
						columns.push({ text: value, rowSpan: column.rowspan ? column.rowspan : 1, colSpan: column.colspan ? column.colspan : 1 , pageBreak: pageBreak });
					}
				});
				tableDefinition.table.body.push(columns);
			});
		});
		
		angular.forEach(footers, function(row){
			var columns = [];
			angular.forEach(row, function(column){
				if (column === ''){ columns.push(''); }
				else if (!column.name || column.name === ''){ columns.push({ text: 'placeholder', color: 'white', rowSpan: column.rowspan ? column.rowspan : 1, colSpan: column.colspan ? column.colspan : 1 }); }
				else { columns.push({ text: column.name, bold: true, rowSpan: column.rowspan ? column.rowspan : 1, colSpan: column.colspan ? column.colspan : 1 }); }
			});
			tableDefinition.table.body.push(columns);
		});

		docDefinition.content.push(tableDefinition);
		if ($scope.format.showBottomDate){ docDefinition.content.push(angular.copy(date)); }
		if ($scope.format.showBottomCount){ docDefinition.content.push(angular.copy(count)); }
		return pdfMake.createPdf(docDefinition);
	}

	$scope.close = function(){
		$window.close();
	};

	$scope.refresh = function(){
		load();
	};
}]);