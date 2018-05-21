/* global angular, Exhibit, baseURL, bootbox, _ */
//= require main/app
//= require_self
'use strict';

/* Services */
var services = angular.module('services', []);

services.factory('tabService', [function(){
	this.tab = 1;
	this.setTab = function(newValue){ this.tab = newValue; };
	this.isSet = function(tabName){ return this.tab === tabName; };
	return this;
}]);

services.factory('Timeout', ['onLoadService', 'Storage', 'validateUrl', 'refreshUrl', 'signOutUrl', 'timeOutUrl', '$timeout', '$http', '$window',
		function(onLoadService, Storage, validateUrl, refreshUrl, signOutUrl, timeOutUrl, $timeout, $http, $window){
	var sec = 1000, id, validate, delayed, confirmation;
	function storageEventHandler(event){
		if (event.newValue === null || event.oldValue === event.newValue || event.key === 'load_order' || event.key === 'History.store'){ return; }
		var value = recieved(event.newValue);
		if (value === null || value === recieved(event.oldValue)){ return; }
		
		switch(event.key){
			case 'time_out':
				switch(value){
					case 'true': timeoutPrompt(restartPolling, function(){ delay(timeOut); });
						break;
					case 'false': clearTimeout();
						restartPolling();
						break;
				}
				break;
			case 'log_out': 
				switch(value){
					case 'true': delay(signOut);
						break;
					case 'false': restartPolling();
						break;
				}
				break;
			case 'polled': 
				switch(value){
					case 'true': restartPolling();
						break;
				}
				break;
		}
	}
	window.addEventListener('storage', storageEventHandler, false);
	
	function send(name, value){
		var obj = { id: id, value: value };
		Storage.setLocalStorage(name, obj);
	}
	
	function recieved(value){
		if (_.isEmpty(value)){ return null; }
		var obj = JSON.parse(value);
		if (_.isEmpty(obj) || obj.id === id){ return null; }
		else { return JSON.stringify(obj.value); }
	}

	onLoadService.addLoadEvent(function(){
		if (!sessionStorage.getItem('sessionID')){
			id = generateUUID();
			Storage.setSessionStorage('sessionID', id);
		}
		else { id = Storage.getSessionStorage('sessionID');}
		send('time_out', false);
		send('log_out', false);
		send('polled', false);
		
		addLoadOrder();
		delay(startPolling);
	});
	
	window.onbeforeunload = function(){
		removeLoadOrder();
		if (_.isEmpty(Storage.getLocalStorage('load_order'))){ clearAll(); }
	};
	
	function poll(){
		validate = $timeout(function(){
			$http({
				method: 'GET',
				url: validateUrl,
				withCredentials: false
			}).then(function successCallback(response){
//				console.log('%s: %s', response.config.method, response.config.url, response);
				send('polled', true);
				restartPolling();
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				if (response.status === 401){
					send('time_out', true);
					timeoutPrompt(restartPolling, timeOut);
				}
				else if (response.status === -1){ location.reload(); }
				else {
					send('polled', true);
					restartPolling();
				}
			});
		}, 30*sec);
	}
	
	function refresh(confirm, timeout){
		window.clearInterval(confirmation);
		$http({
			method: 'GET',
			url: refreshUrl,
			withCredentials: false
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			send('time_out', false);
			clearTimeout();
			confirm();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			clearTimeout();
			timeout();
		});
	}
	
	function timeoutPrompt(confirm, timeout){
		stopPolling();
		clearTimeout();

		var remaining = 30;
		bootbox.dialog({
			closeButton: false,
			title: 'Your session is about to expire...',
			message: "You will be logged out in: <span id='SecondsRemaining'>" + remaining + "</span>",
			onEscape: function(){
				refresh(confirm, timeout);
			},
			buttons: {
				cancel: {
					label: "Logout",
					className: "btn-cancel",
					callback: function(){
						clearTimeout();
						signOut();
					}
				},
				confirm: {
					label: "Keep me logged in",
					className: "btn-primary",
					callback: function(){
						refresh(confirm, timeout);
					}
				}
			}
		});
		
	    var obj = document.getElementById("SecondsRemaining");
	    confirmation = window.setInterval(function(){
	        remaining--;
	        if (remaining < 0){
	        	clearTimeout();
	            timeout();
	            return;
	        }
	        obj.innerHTML = remaining;
	    }, sec);
	}
	
	function startPolling(){
		send('polled', false);
		poll();
	}
	
	function stopPolling(){
		$timeout.cancel(delayed);
		$timeout.cancel(validate);
	}
	
	function restartPolling(){
		stopPolling();
		delay(startPolling);
	}
	
	function clearTimeout(){
		window.clearInterval(confirmation);
		bootbox.hideAll();
	}
	
	function clearAll(){
		stopPolling();
		clearTimeout();
		Storage.clearLocalStorage();
	}
	
	function delay(callback){
		delayed = $timeout(function(){
			callback();
		}, 150*getLoadOrder());
	}
	
	function signOut(){
		send('log_out', true);
		clearAll();
		$window.location.href = signOutUrl;
	}
	
	function timeOut(){
		clearAll();
		$window.location.href = timeOutUrl;
	}
	
	function getLoadOrder(){
		var obj = Storage.getLocalStorage('load_order'), size;
		if (_.isEmpty(obj)){ size = 1; }
		else { size = obj[id]; }
		return size;
	}
	
	function addLoadOrder(){
		var obj = Storage.getLocalStorage('load_order'), size;
		if (_.isEmpty(obj)){
			obj = {};
			size = 1;
		}
		else { size = Object.keys(obj).length + 1; }
		obj[id] = size;
		Storage.setLocalStorage('load_order', obj);
	}
	
	function removeLoadOrder(){
		var obj = JSON.parse(localStorage.getItem('load_order'));
		if (!_.isEmpty(obj) && obj[id]){
			var temp = obj[id];
			delete obj[id];
			for (var key in obj){ if (obj.hasOwnProperty(key) && obj[key] > temp){ obj[key]--; } }
			Storage.setLocalStorage('load_order', obj);
		}
	}
	
	return { signOut: signOut };
}]);

services.factory('focusService', ['$timeout', function($timeout){
	return function(id){
		$timeout(function(){
			var element = document.getElementById(id);
			if (element){ element.focus(); }
		});
	};
}]);

services.factory('onLoadService', [function(){
	return {
		addLoadEvent : function(func){
			var oldonload = window.onload;
			if (typeof window.onload !== 'function'){ window.onload = func; }
			else {
				window.onload = function(){
					if (oldonload){ oldonload(); }
					func();
				};
			}
		}
	};
}]);

services.factory('Storage', [function(){
	return {
		setSessionStorage: function(key, value){
			if (value !== null && value !== undefined){ sessionStorage.setItem(key, JSON.stringify(value)); }
			else { this.removeSessionStorage(key); }
		},
		getSessionStorage: function(key){ return JSON.parse(sessionStorage.getItem(key)); },
		removeSessionStorage: function(key){ sessionStorage.removeItem(key); },
		clearSessionStorage: function(){ sessionStorage.clear(); },
		setLocalStorage: function(key, value){
			if (value){ localStorage.setItem(key, JSON.stringify(value)); }
			else { this.removeLocalStorage(key); }
		},
		getLocalStorage: function(key){ return JSON.parse(localStorage.getItem(key)); },
		removeLocalStorage: function(key){ localStorage.removeItem(key); },
		clearLocalStorage: function(){ localStorage.clear(); }
	};
}]);

services.factory('LoadService', ['$q', function($q){
	var observers = [], promises = [];
	return {
		data: {},
		push: function(promise){ promises.push(promise); },
		registerObserver: function(callback, id){
			observers.push({ id: id, callback: callback });
		},
		notifyObservers: function(callback){
			var $this = this;
			angular.forEach(observers, function(observer){
				if (angular.isFunction(observer.callback)){
					if (observer.id){ observer.callback($this.data[observer.id]); }
					else { observer.callback($this.data); }
				}
			});
			if (angular.isFunction(callback)){ callback($this.data); }
		},
		q: function(callback, clear){
			var $this = this;
			$q.all(promises).then(function(response){
				$this.notifyObservers(callback);
			});
			if (typeof clear === 'boolean' && clear){ promises = []; }
		}
	};
}]);

services.factory('Prompt', ['BusyIndicator', function(BusyIndicator){
	return function(message, callback){
		BusyIndicator.hide();
		bootbox.dialog({
			message: '<span>' + message + '</span>',
			onEscape: function(){
				if (angular.isFunction(callback)){ callback(); }
			},
			buttons: {
				ok: {
					label: "OK",
					className: "btn-primary",
					callback: function(){
						if (angular.isFunction(callback)){ callback(); }
					}
				}
			}
		});
	};
}]);

services.factory('BusyIndicator', ['$timeout',  function($timeout){
	var busyIndicator = null, count = 0, timeout = null, messages = [
		"...and enjoy the elevator music...",
		"...at least you're not on hold...",
		"1,000,000 bottles of beer on the wall...",
		"640k ought to be enough for anybody.",
		"99 bottles of beer on the wall..",
		"@todo Insert witty loading message",
		"A commit a day keeps the mobs away",
		"A computer will do what you tell it to do, but that may be much different from what you had in mind.",
		"A different error message? Finally, some progress!",
		"A few bits tried to escape, but we caught them.",
		"A kiss is like a fight, with mouths.",
		"Adding random changes to your data...",
		"Adjusting flux capacitor...",
		"Adults are just kids with money.",
		"All I really need is a kilobit.",
		"All the relevant elves are on break. Please wait.",
		"All your web browser are belong to us",
		"Alt-F4 speeds things up.",
		"Are we there yet?",
		"Are you bored? Me too.",
		"Are you ready?",
		"Are your shoelaces tied?",
		"As if you had any other choice.",
		"At least you're not on hold.",
		"Aw, snap! Not..",
		"Be careful not to step in the git-gui",
		"Behind you! Ha, ha, gotcha!",
		"Bending the spoon...",
		"Bored of slow loading spinner, buy more RAM!",
		"BRB, working on my side project",
		"Building a wall...",
		"Busing through the motherboard, will arrive soon...",
		"Buy more ram...",
		"Calculating the odds...",
		"Centralizing the processing units...",
		"Charging capacitors to 1.21 jiggawatts...",
		"Checking the gravitational constant in your locale...",
		"Chuck Norris doesn’t wear a watch. HE decides what time it is.",
		"Chuck Norris never git push. The repo pulls before.",
		"Chuck Norris once urinated in a semi truck's gas tank as a joke....that truck is now known as Optimus Prime.",
		"Cleaning off the cobwebs...",
		"Coffee, Chocolate, Men. The richer the better!",
		"Come to Ralph's Wonder Lama Emporium....",
		"Computing chance of success",
		"Computing the secret to life, the universe, and everything.",
		"Connecting Neurotoxin Storage Tank...",
		"Constructing additional pylons...",
		"Convincing AI not to turn evil..",
		"Counting backwards from Infinity",
		"Cracking military-grade encryption...",
		"Creating time-loop inversion field",
		"Creating weather forecast ....",
		"Deleting System32 folder",
		"Didn't know paint dried so quickly.",
		"Dig on the 'X' for buried treasure... ARRR!",
		"Distracted by cat gifs",
		"Dividing by zero...",
		"Dividing eternity by zero, please be patient...",
		"Do not run! We are your friends!",
		"Do you come here often?",
		"Do you suffer from ADHD? Me neith- oh look a bunny... What was I doing again? Oh, right. Here we go.",
		"Doing something useful...",
		"Don't break your screen yet!",
		"Don't panic...",
		"Don't think of purple hippos.",
		"Don't throw out that cat! Get me some pliers quick...",
		"Don't worry - a few bits tried to escape, but we caught them",
		"Downloading more RAM..",
		"Embiggening Prototypes",
		"Entangling superstrings...",
		"Entertaining possibility of continuing...",
		"Er, there is something on your teeth.",
		"Everything is this universe is either a potato or not a potato",
		"Everything sounds the same",
		"Feel free to spin in your chair",
		"Filling up mountains.",
		"Filtering morale...",
		"Finding someone to hold my beer",
		"Follow the white rabbit.",
		"Forget you saw that password I just typed into the IM ...",
		"format C: ...",
		"Generating witty dialog...",
		"Get some coffee and come back in ten minutes..",
		"git happens",
		"Giving it all I've got...",
		"Go ahead -- hold your breath.",
		"Go ahead, hold your breath and do an ironman plank till loading complete",
		"Go get a cup of coffee or something...",
		"Go read a book, I'm nearly finished.",
		"Going to DEFCON 1.",
		"Granting wishes...",
		"Greetings earthling!",
		"Hang on a sec, I know your data is here somewhere.",
		"Happy elf and sad elf are talking about your data. Please wait.",
		"Have a good day.",
		"Have you considered another ISP?",
		"Have you lost weight?",
		"Hello IT, have you tried turning it off and on again?",
		"Hello this is the CPU: the first core and the second core are working! What!? You got a third core...",
		"Hello!!! Why did you click that button?!",
		"Hello, IT, Have you tried forcing an unexpected reboot?",
		"Help, I'm trapped in a loader!",
		"Hiding all ;'s in your code",
		"Hold on while we wrap up our git together...sorry",
		"Houston, we have a... Oh, hi. All fine here.",
		"How about this weather, eh?",
		"How did you get here?",
		"Hum something loud while others stare",
		"I’ve got problem for your solution...",
		"I am free of all prejudices. I hate everyone equally.",
		"I didn't choose the engineering life. The engineering life chose me.",
		"I feel like im supposed to be loading something...",
		"I found a typo! Sending...",
		"I know this is painful to watch, but I have to load this.",
		"I love my job only when I'm on vacation...",
		"I need to git pull --my-life-together",
		"I should have had a V8 this morning.",
		"I swear it's almost done.",
		"I think I am, therefore, I am. I think.",
		"I think, therefore I am...loading!",
		"I'm going to walk the dog",
		"I'm not lazy, I'm just relaxed!!",
		"I'm sorry Dave, I can't do that.",
		"I'm tired, please be patient.",
		"If I’m not back in five minutes, just wait longer.",
		"If you type Google into Google you can break the internet",
		"Initializing loading message database...",
		"Initializing the initializer...",
		"Insert quarter to continue.",
		"Insert quarter",
		"Installing dependencies",
		"Is this Windows?",
		"It is dark. You're likely to be eaten by a grue.",
		"It's 10:00pm. Do you know where your children are?",
		"It's around here somewhere...",
		"It's not you. It's me.",
		"It's still faster than you could draw it",
		"Java developers never RIP. They just get Garbage Collected.",
		"Just count to 10",
		"Just stalling to simulate activity...",
		"keep calm and npm install",
		"Keeping all the 1's and removing all the 0's...",
		"Kicking Mort from madagascar! Please wait...",
		"Kindly hold on as our intern quits vim...",
		"Kindly hold on as we convert this bug to a feature...",
		"Last call for the data bus! All aboard!",
		"Laughing at your pictures-i mean, loading...",
		"Let me tell you a joke, two CPUs walk into a bar...",
		"Let's hope it's worth the wait",
		"Let's take a mindfulness minute...",
		"Life is Short – Talk Fast!!!!",
		"Listening for the sound of one hand clapping...",
		"Load it and they will come",
		"Loading funny message...",
		"Loading new loading screen.",
		"Loading screen... If you can see this then it's already loaded.",
		"Loading the enchanted bunny...",
		"Locating Jebediah Kerman...",
		"Look! Over there -> ->",
		"Looking for exact change...",
		"Looking for sense of humour, please hold on.",
		"Making sure all the i's have dots...",
		"Making you a cookie.",
		"May the forks be with you",
		"Mining some bitcoins...",
		"My other loading screen is much faster. You should try that one instead.",
		"My other loading screen is much faster.",
		"Never let a computer know you're in a hurry.",
		"Never steal. The government hates competition....",
		"Oh, no! Loading time...",
		"Oh, yeah, comments! Good idea!",
		"Optimism – is a lack of information.....",
		"Optimizing the optimizer...",
		"Ordering 1s and 0s...",
		"Ouch! Careful where you point that thing!",
		"Paging for the system admin...",
		"Paper or plastic?",
		"Pay no attention to the man behind the curtain.",
		"Photographing cats... Attaching signs... Meme complete!",
		"Please count to 10...",
		"Please don't move...",
		"Please hold on as we reheat our coffee",
		"Please wait until the sloth starts moving.",
		"Please wait while a larger software vendor in Seattle takes over the world",
		"Please wait while the intern refills his coffee.",
		"Please wait while the little elves draw your map",
		"Please wait, while we purge the Decepticons for you. Yes, You can thanks us later!",
		"Please wait... Consulting the manual...",
		"Prepare for awesomeness!",
		"Preparing for hyperspace jump.",
		"Proving P=NP...",
		"Pushing pixels...",
		"Putting the icing on the cake. The cake is not a lie...",
		"Randomizing memory access...",
		"Re-calibrating the internet...",
		"Really sorry, it needs work I know...",
		"Reconfiguring the office coffee machine...",
		"Reconfoobling energymotron...",
		"Recording ip address... Checking cookies... Scanning browser history... Generating ad content... Enjoy the goats!",
		"Remember, beer and email don't mix.",
		"Reticulating splines...",
		"Roping some seaturtles...",
		"Running swag sticker detection...",
		"Salting sea water.",
		"Save water and shower together",
		"Searching for answers...",
		"Searching for plot device...",
		"Searching for the Amulet of Yendor.",
		"Searching for the any key...",
		"Searching for the... Omg, what the heck is that doing there?",
		"Sending data to NS-i mean, our servers.",
		"Should have used a compiled language...",
		"Shovelling coal into the server",
		"Simulating traveling salesman...",
		"Slaying a balrog.",
		"Some days, you just can’t get rid of a bug!",
		"Some things man was never meant to know. For everything else, there's Google.",
		"Sometimes I think war is God’s way of teaching us geography.",
		"Sorry. Our server is a few bytes short of a file...",
		"Space is invisible mind dust, and stars are but wishes.",
		"Spawn more Overlord!",
		"Spinning the hamster…",
		"Spinning the wheel of fortune...",
		"Spinning violently around the y-axis...",
		"Starting in 0...1...2...n...",
		"Stay awhile and listen..",
		"Stealing bucket.",
		"Stretching first. I don't want to pull a muscle.",
		"Swapping time and space...",
		"Switching to the latest JS framework...",
		"Take a moment to sign up for our lovely prizes.",
		"Testing data on timmy... ... ... We're going to need another timmy.",
		"Testing on Timmy... We're going to need another Timmy.",
		"The architects are still drafting",
		"The bits are breeding.",
		"The bits are flowing slowly today.",
		"The Elders of the Internet would never stand for it.",
		"The Funnies",
		"The last time I tried this the monkey didn't survive. Let's hope it works better this time.",
		"The loading screen is a lie.",
		"The server is powered by a lemon and two electrodes.",
		"The severity of your issue is always lower than you expected.",
		"The version I have of this in testing has much funnier load screens.",
		"There is no spoon. Because we are not done loading it",
		"They just toss us away like yesterday's jam.",
		"They're fairly regular, the beatings, yes. I'd say we're on a bi-weekly beating.",
		"This is not a joke, it's a commit.",
		"This page brough to you by the letter q...",
		"Time flies when you’re having fun.",
		"Tokenizing real life...",
		"Trying to sort in O(n)...",
		"Twiddling thumbs...",
		"Unicorns are at the end of this road, I promise.",
		"Unix is user-friendly. It's just very selective about who its friends are.",
		"Updating dependencies...",
		"Updating to Windows Vista...",
		"Upgrading Windows, your PC will restart several times. Sit back and relax.",
		"User: the word computer professionals use when they mean !!idiot!!",
		"Wait, do you smell something burning?",
		"Waiting Daenerys say all her titles...",
		"Waiting for approval from bill gates...",
		"Waiting for godot...",
		"Waiting for something in the server.",
		"Waiting for the system admin to hit enter...",
		"Warming up the processors...",
		"Warning: Don't set yourself on fire.",
		"Waving the rubber chicken over the server. Please wait...",
		"We’re going to need a bigger boat.",
		"We are not liable for any broken screens as a result of waiting.",
		"We love you just the way you are.",
		"We need a new fuse...",
		"We're building the buildings as fast as we can",
		"We're making you a cookie.",
		"We're testing your patience.",
		"Web developers do it with <style>",
		"Well, this is embarrassing.",
		"Well, what are you waiting for?",
		"What do you call 8 Hobbits? A Hobbyte.",
		"What is the airspeed velocity of an unladen swallow?",
		"What is the difference btwn a hippo and a zippo? One is really heavy, the other is a little lighter",
		"What the what?",
		"What's under there?",
		"Whatever you do, don't look behind you...",
		"When nothing is going right, go left!",
		"When was the last time you dusted around here?",
		"Whenever I find the key to success, someone changes the lock.",
		"Where there’s a will, there’s a relative.",
		"While a larger software vendor in seattle takes over the world.",
		"While the satellite moves into position.",
		"Why are they called apartments if they are all stuck together?",
		"Why don't you order a sandwich?",
		"Why so serious?",
		"Winter is coming...",
		"Working... Hey, come back here!",
		"Working... No, just kidding.",
		"Working... So, how are you?",
		"Working... Unlike you!",
		"Working... Well... You know...",
		"Would you like fries with that?",
		"Would you prefer chicken, steak, or tofu?",
		"You don’t pay taxes—they take taxes.",
		"You shall not pass! yet..",
		"You shouldn't have done that.",
		"You're not in Kansas any more.",
		"Your computer has a virus, it's name is Windows!",
		"Your left thumb points to the right and your right thumb points to the left.",
		"Your time is important to us. Please hold."];

	function show(text, message, random, interval){
		if (busyIndicator === null){ busyIndicator = create(); }
		else { count++; }
		$(document.body).append(busyIndicator);
		setText(text);
		if (timeout){ $timeout.cancel(timeout); }
		if (random === true){
			setMessage(message);
			setTimeout(interval);
		}
		else { setMessage(message); }
	}
	this.show = show;
	
	
	this.loading = function(){
		show('Loading...', messages[Math.floor(Math.random() * messages.length)], true);
	};
	
	function setTimeout(interval){
		interval = interval || 15;
		timeout = $timeout(function(){
			var rand = Math.floor(Math.random() * messages.length), message = messages[rand];
			setMessage(message);
			setTimeout(interval);
		}, interval*1000);
	}
	this.setTimeout = setTimeout;

	this.hide = function(){
		count--;
		if (busyIndicator === null){ return; }
		if (count <= 0){
			if (timeout){ $timeout.cancel(timeout); }
			try {
				busyIndicator.remove();
				busyIndicator.find('#message').empty();
			} catch(e){ }
			count = 0;
		}
	};
	
	function setText(text){
		text = text || ' Loading...';
		if (busyIndicator){ busyIndicator.find('#text').text(text); }
	}
	this.setText = setText;
	
	function setMessage(message){
		message = message || '';
		if (busyIndicator){ busyIndicator.find('#message').text(message); }
	}
	this.setMessage = setMessage;
	
	window.onresize = function(){
		var containerDiv = $('div.busyIndicator'),
			height = typeof window['innerHeight'] !== 'undefined' ? window.innerHeight : (typeof document.body['clientHeight'] !== 'undefined' ? document.body.clientHeight : document.body.parentNode.clientHeight),
			top = Math.floor(height / 3),
		    width = typeof window['innerWidth'] !== 'undefined' ? window.innerWidth : (typeof document.body['clientWidth'] !== 'undefined' ? document.body.clientWidth : document.body.parentNode.clientWidth),
			left = Math.floor((width - 300) / 2);
		containerDiv.css({top: top + 'px', left: left + 'px'});
	};
	
	function create(){
	    var containerDiv, contentDiv, messageDiv, spinner, textDiv,
			height = typeof window['innerHeight'] !== 'undefined' ? window.innerHeight : (typeof document.body['clientHeight'] !== 'undefined' ? document.body.clientHeight : document.body.parentNode.clientHeight),
			top = Math.floor(height / 3),
		    width = typeof window['innerWidth'] !== 'undefined' ? window.innerWidth : (typeof document.body['clientWidth'] !== 'undefined' ? document.body.clientWidth : document.body.parentNode.clientWidth),
			left = Math.floor((width - 300) / 2);
		
		containerDiv = $('<div>').addClass('busyIndicator').css({top: top + 'px', left: left + 'px'});
		contentDiv = $('<div>').addClass('busyIndicator-content');
	    containerDiv.append(contentDiv);
	    spinner = $('<i>').addClass('fa fa-spinner fa-pulse fa-fw margin-bottom').attr('aria-hidden', true);
		textDiv = $('<div>').attr('id', 'text').addClass('busyIndicator-text').css({display: 'inline-block'});
	    messageDiv = $('<div>').attr('id', 'message').addClass('busyIndicator-message').css({'font-size': 'x-small'});
	    contentDiv.append(spinner);
	    contentDiv.append(textDiv);
	    contentDiv.append(messageDiv);
	    return containerDiv;
	}
	
	window.BusyIndicator = this;
	return this;
}]);

services.factory('ExhibitCtrlService', ['BusyIndicator', 'Prompt', '$http', '$window', function(BusyIndicator, Prompt, $http, $window){
	return {
		refresh: function(url, params, callback){
			BusyIndicator.loading();
			$http({
				method: 'GET',
				url: url,
				params: angular.extend(params, { reload: true })
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				window.exhibit.getDatabase().removeAllStatements();
				window.exhibit.getDatabase().loadData(response.data, $window.location.href, BusyIndicator.hide);
				if (angular.isFunction(callback)){ callback(response); }
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				Prompt(response.data);
				if (angular.isFunction(callback)){ callback(response); }
			});
		},
		load: function(url, params, callback){
			BusyIndicator.loading();
			$http({
				method: 'GET',
				url: url,
				params: params
			}).then(function successCallback(response){
				console.log('%s: %s', response.config.method, response.config.url, response);
				window.exhibit = Exhibit.create();
				window.exhibit.configureFromDOM();
				window.database = Exhibit.Database.create();
				for (var i in window.exhibit._uiContext._collection._facets){
					window.exhibit._uiContext._collection._facets[i]._settings.missingLabel = 'N/A';
				}
					
				window.exhibit.getDatabase().loadData(response.data, $window.location.href, BusyIndicator.hide);
				if (angular.isFunction(callback)){ callback(response); }
			}, function errorCallback(response){
				console.error('%s: %s', response.config.method, response.config.url, response);
				Prompt(response.data);
				if (angular.isFunction(callback)){ callback(response); }
			});
		}
	};
}]);
