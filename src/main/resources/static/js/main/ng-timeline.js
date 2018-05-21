/* global TL, app, moment */
//= require_self
'use strict';
/*
 * ng-timeline v0.2.3 (November 25, 2016)
 * https://github.com/fmaturel/angular-timelinejs3
 *************************************************
 */

var ngTimeline = app || angular.module('ngTimeline', ['ng']);
ngTimeline.directive('timelineMedia', ['$compile', function($compile){
	return {
		restrict: 'A',
		scope: true,
		controller: ['$scope', function($scope){
			// Loads angular media (which could be a directive)
				$scope.$on('onMediaLoaded', function(e, media){
				media._el.content_item = TL.Dom.create('div', '', media._el.content);
				angular.element(media._el.content_item).append($compile(media.data.url)($scope));
			});

			// Loads caption
			$scope.$on('onCaptionLoaded', function(e, media){
				if (media._el && media._el.caption){
					angular.element(media._el.caption).empty().append($compile(media.data.caption)($scope));
				}
			});
		}]
	};
}]);

ngTimeline.directive('timelineSlide', ['$compile', '$log', function($compile, $log){
	return {
		restrict: 'A',
		link: function(scope, element){
			$log.debug(scope.data);

			// Add directive 'timeline-media' to .timeline-media div
			var media = angular.element(element[0].querySelector('.timeline-media'));
			media.attr('timeline-media', true);

			// Recompile slide with angular to start directives
			$compile(media)(scope);
		}
	};
}]);

ngTimeline.directive('timelineTimemarker', ['$compile', function($compile){
	return {
		restrict: 'A',
		link: function(scope, element){
			var firstChild = angular.element(element.children()[1]);
			$compile(firstChild)(scope);
		}
	};
}]);

ngTimeline.directive('timeline', ['$rootScope', '$compile', 'timelineMediaTypeService', function($rootScope, $compile, timelineMediaTypeService){
	var defaultOptions = {
		debug: false,                       // Can be set to debug timelinejs
		script_path: '',
		// width: will be 100%,
		// height: will be 100%,
		scale_factor: 1,                    // How many screen widths wide should the timeline be
		layout: 'landscape',                // portrait or landscape
		timenav_position: 'bottom',         // timeline on top or bottom
		optimal_tick_width: 100,            // optimal distance (in pixels) between ticks on axis
		base_class: '',
		//timenav_height: 150,
		timenav_height_percentage: 50,      // Overrides timenav height as a percentage of the screen
		timenav_height_min: 150,            // Minimum timenav height
		marker_height_min: 30,              // Minimum Marker Height
		marker_width_min: 150,              // Minimum Marker Width
		marker_padding: 5,                  // Top Bottom Marker Padding
		start_at_slide: 0,
		//menubar_height: 200,
		skinny_size: 650,
		relative_date: false,               // Use momentjs to show a relative date from the slide.text.date.created_time field
		use_bc: false,                      // Use declared suffix on dates earlier than 0
		duration: 1000,                     // Slider animation duration
		ease: TL.Ease.easeInOutQuint,       // Slider animation type
		dragging: true,
		trackResize: true,
		map_type: 'stamen:toner-lite',
		slide_padding_lr: 100,              // padding on slide of slide
		slide_default_fade: '50%',          // landscape fade
		language: 'en'
	}, timeline, options, config;
	
	function angularize(element, className, directiveName, scope, isTitleSlideMatching){
		var children = angular.element(element[0].querySelectorAll(className));
		children.attr(directiveName, true);

		angular.forEach(children, function(slide, index){
			// create a new child scope
			var childScope = $rootScope.$new();
			childScope.data = scope.timeline.config.events[index - (isTitleSlideMatching ? 1 : 0)];
			$compile(slide)(childScope);
		});
	}

	return {
		template: '<div ng-style="{height: height || \'700px\'};"></div>',
		restrict: 'E',
		replace: true,
		scope: {
			id : '@',
			height: '@',
			timeline: '=control',
			config: '=',
			options: '='
		},
		controller: ['$scope', '$timeout', function($scope, $timeout){
			$scope.$watch('options', function(options){
				console.log('options', options);
				$scope.timeline.setOptions(options);
			}, true);
			
			$scope.$watch('config', function(config){
				console.log('config', config, $($scope.timeline._el.container).is(':visible'));
				$timeout(function(){
					if ($($scope.timeline._el.container).is(':visible')){
						$scope.timeline._initData(config);
					}
				}, 100);
			}, true);
			
			TL.MediaType = timelineMediaTypeService.getMediaType;

			var initPrototype = TL.Timeline.prototype.initialize;
			TL.Timeline.prototype.initialize = function(){
				// Just install listener on first time loaded
				if (!this.hasEventListeners('loaded')){
					this.on('loaded', function(e){
						$scope.$emit('_loaded', e);
					});
				}
				if (arguments.length > 0){ return initPrototype.apply(this, arguments); }
				else { return initPrototype.apply(this, [this._el.container, this.config, this.options]); }
			};
			
			TL.Timeline.prototype.setOptions = function(options){
				options = options || {};
				this.options = {
					script_path: 				"",
					height: 					this._el.container.offsetHeight,
					width: 						this._el.container.offsetWidth,
					debug: 						false,
					is_embed: 					false,
					is_full_embed: 				false,
					hash_bookmark: false,
					default_bg_color: 			{r:255, g:255, b:255},
					scale_factor: 				2,						// How many screen widths wide should the timeline be
					layout: 					"landscape",			// portrait or landscape
					timenav_position: 			"bottom",				// timeline on top or bottom
					optimal_tick_width: 		60,						// optimal distance (in pixels) between ticks on axis
					base_class: 				"tl-timeline", 		// removing tl-timeline will break all default stylesheets...
					timenav_height: 			null,
					timenav_height_percentage: 	25,						// Overrides timenav height as a percentage of the screen
					timenav_mobile_height_percentage: 40, 				// timenav height as a percentage on mobile devices
					timenav_height_min: 		175,					// Minimum timenav height
					marker_height_min: 			30,						// Minimum Marker Height
					marker_width_min: 			100,					// Minimum Marker Width
					marker_padding: 			5,						// Top Bottom Marker Padding
					start_at_slide: 			0,
					start_at_end: 				false,
					menubar_height: 			0,
					skinny_size: 				650,
					medium_size: 				800,
					relative_date: 				false,					// Use momentjs to show a relative date from the slide.text.date.created_time field
					use_bc: 					false,					// Use declared suffix on dates earlier than 0
					// animation
					duration: 					1000,
					ease: 						TL.Ease.easeInOutQuint,
					// interaction
					dragging: 					true,
					trackResize: 				true,
					map_type: 					"stamen:toner-lite",
					slide_padding_lr: 			100,					// padding on slide of slide
					slide_default_fade: 		"0%",					// landscape fade
					zoom_sequence: 				[0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], // Array of Fibonacci numbers for TimeNav zoom levels
					language: 					"en",
					ga_property_id: 			null,
					track_events: 				['back_to_start','nav_next','nav_previous','zoom_in','zoom_out' ]
				};
				
				// Merge Options
				if (typeof(options.default_bg_color) === "string"){
					var parsed = TL.Util.hexToRgb(options.default_bg_color); // will clear it out if its invalid
					if (parsed){ options.default_bg_color = parsed; }
					else {
						delete options.default_bg_color;
						trace("Invalid default background color. Ignoring.");
					}
				}
				TL.Util.mergeData(this.options, options);
				
				// Set Debug Mode
				TL.debug = this.options.debug;
				
				if (this.options.is_embed){ TL.DomUtil.addClass(this._el.container, 'tl-timeline-embed'); }
				if (this.options.is_full_embed){ TL.DomUtil.addClass(this._el.container, 'tl-timeline-full-embed'); }

				// Use Relative Date Calculations
				// NOT YET IMPLEMENTED
				if (this.options.relative_date){
					if (typeof(moment) !== 'undefined'){ this._loadLanguage(this.config); }
					else {
						TL.Load.js(this.options.script_path + "/library/moment.js", function(){
							this._loadLanguage(this.config);
							trace("LOAD MOMENTJS");
						});
					}
				}
				else { this._loadLanguage(this.config); }
			}
			
			TL.TimelineConfig.prototype.initialize = function(config){
				console.log('TL.TimelineConfig.initialize(%o)', config);
				this.scale = config.scale || '';
				this.event_dict = {};
				this.messages = {
					errors: [],
					warnings: []
				};
				this._setTitle(config.title);
				this._setEvents(config.events);
				this._setEras(config.eras);
			};
			
			TL.TimelineConfig.prototype._setTitle = function(title){
//				console.log('TL.TimelineConfig._setTitle(%o)', title);
				if (title){
					var title_id = this._assignID(title);
					this._tidyFields(title);
					this.title = title;
					this.event_dict[title_id] = this.title;
				}
				else { this.title = ''; }
			};
			
			TL.TimelineConfig.prototype._setEvents = function(events){
//				console.log('TL.TimelineConfig._setEvents(%o)', events);
				this.events = [];
				this._ensureValidScale(events);
				for (var i = 0; i < events.length; i++){
					try { this.addEvent(events[i], true); }
					catch (e){ this.logError(e); }
				}
				TL.DateUtil.sortByDate(this.events);
			};
			
			TL.TimelineConfig.prototype._setEras = function(eras){
//				console.log('TL.TimelineConfig._setEras(%o)', eras);
				this.eras = [];
				if (eras){
					for (var i = 0; i < eras.length; i++){
						try { this.addEra(eras[i], true); }
						catch (e){ this.logError("Era " + i + ": " + e); }
					}
				}
				TL.DateUtil.sortByDate(this.eras);
			};
			
			var config = $scope.config || new TL.TimelineConfig();
			var options = angular.extend(defaultOptions, $scope.options);
			$scope.timeline = angular.extend(new TL.Timeline($scope.id, config, options), $scope.timeline);
			
			angular.element(document.body).on('keydown', function(e){
				var keys = {
					37: 'goToPrev', // Left
					39: 'goToNext', // Right
					36: 'goToStart',// Home
					35: 'goToEnd'   // End
				};
				var keysProps = Object.getOwnPropertyNames(keys),
				keyCodeAsString = e.keyCode + '';
				if (keysProps.indexOf(keyCodeAsString) !== -1){
					timeline[keys[keyCodeAsString]]();
				}
			});
		}],
		link: function(scope, element){
			// When data is loaded
			scope.$on('_loaded', function(){
				angularize(element, '.timeline-slide-content', 'timeline-slide', scope, true);
				angularize(element, '.timeline-timemarker-content', 'timeline-timemarker', scope);
			});
		}
	};
}]);

ngTimeline.provider('timelineMediaTypeService', function(){
	var tlMediaType = TL.MediaType, mediaTypes = [];

	this.addMediaType = function(mediaType){
		mediaTypes.push({
			type: mediaType.type,
			name: mediaType.name,
			match_str: mediaType.urlRegex,
			cls: mediaType.cls
		});
	};

	function mediaMatch(m, testUrl){
		return angular.isObject(m) && angular.isString(m.url) && m.url.match(testUrl);
	}

	this.$get = function(){
		return {
			getMediaType: function(m){
				for (var i = 0; i < mediaTypes.length; i++){
					if (mediaMatch(m, mediaTypes[i].match_str)){
						mediaTypes[i].url = m.url;
						return mediaTypes[i];
					}
				}
				return tlMediaType(m);
			}
		};
	};
});