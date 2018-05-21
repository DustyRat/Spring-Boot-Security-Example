/* global angular, controllers, baseURL, bootbox */
//= require_self
'use strict';

/* Controllers */
controllers.factory('FormatCtrls', [function(){
	this.examples = [{
		id: 1,
		status: "CSP-Queue",
		confirmedDate: null,
		statusUpdated: "2017-02-07T22:02:40Z",
		username: "stella auto-matching service",
		bookin: {
			id: 1,
			number: "15015468",
			sid: "50669523",
			date: "2015-03-23T15:00:00Z",
			name: "JACKSON A ABBOTT",
			nameLNF: "ABBOTT, JACKSON A",
			lastName: "ABBOTT",
			firstName: "JACKSON",
			middleName: "A",
			age: 57,
			ageAtBookin: 55,
			hasFelony: "N/A",
			dateCreated: "2017-02-07T20:33:46Z",
			day: 23,
			dob: "1960-01-01T06:00:00Z",
			ethnicity: "B",
			gender: "M",
			history: null,
			isFelony: null,
			jail: null,
			lastUpdated: "2017-02-07T20:33:47Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: true,
			month: 3,
			hasParoleViolation: "N/A",
			releaseReason: null,
			releaseStatus: null,
			releasedDate: null,
			ssn: "123456789",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: false,
			year: 2015
		},
		client: {
			age: 57,
			authoritative: true,
			added: "2014-12-11T19:14:13Z",
			number: "X1104329",
			dateCreated: "2017-02-06T22:43:04Z",
			dx: null,
			dob: "1960-01-01T06:00:00Z",
			ethnicity: "B",
			firstName: "Jackson",
			gender: "M",
			id: 1,
			lastName: "Abbott",
			lastUpdated: "2017-02-06T22:43:04Z",
			middleName: null,
			name: "Jackson Abbott",
			nameLNF: "Abbott, Jackson",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123456789",
			lastUpdate: "2014-12-11T19:14:13Z"
		}
	}, {
		actionStatus: null,
		ageAtBookin: 54,
		bookin: {
			age: 56,
			ageAtBookin: 54,
			number: "15015446",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "FELONY",
			dateCreated: "2017-02-07T20:33:47Z",
			day: 23,
			dob: "1961-01-02T06:00:00Z",
			ethnicity: "W",
			firstName: "AIDEN",
			gender: "M",
			history: null,
			id: 2,
			isFelony: null,
			jail: null,
			lastName: "ACEVEDO",
			lastUpdated: "2017-02-07T20:33:47Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: true,
			middleName: "B",
			month: 3,
			name: "AIDEN B ACEVEDO",
			nameLNF: "ACEVEDO, AIDEN B",
			hasParoleViolation: "VIOLATION",
			releaseReason: "Release Reason",
			releaseStatus: "Released",
			releasedDate: null,
			sid: "50669367",
			ssn: "123457566",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: true,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 56,
			authoritative: true,
			added: "2014-12-11T16:53:54Z",
			number: "X91592483",
			dateCreated: "2017-02-06T22:43:05Z",
			dx: null,
			dob: "1961-01-02T06:00:00Z",
			ethnicity: "W",
			firstName: "Aiden",
			gender: "M",
			id: 2,
			lastName: "Acevedo",
			lastUpdated: "2017-02-06T22:43:05Z",
			middleName: null,
			name: "Aiden Acevedo",
			nameLNF: "Acevedo, Aiden",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123457566",
			lastUpdate: "2014-12-11T16:53:54Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:47 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 2,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:47Z",
		statusUpdated: "2017-02-07T20:33:47Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 53,
		bookin: {
			age: 55,
			ageAtBookin: 53,
			number: "15015355",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "N/A",
			dateCreated: "2017-02-07T20:33:47Z",
			day: 23,
			dob: "1962-01-03T06:00:00Z",
			ethnicity: "H",
			firstName: "LIAM",
			gender: "M",
			history: null,
			id: 3,
			isFelony: null,
			jail: null,
			lastName: "ACOSTA",
			lastUpdated: "2017-02-07T20:33:48Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: true,
			middleName: "C",
			month: 3,
			name: "LIAM C ACOSTA",
			nameLNF: "ACOSTA, LIAM C",
			hasParoleViolation: "N/A",
			releaseReason: null,
			releaseStatus: null,
			releasedDate: null,
			sid: "50669362",
			ssn: "123458343",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: true,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 55,
			authoritative: true,
			added: "2014-12-11T06:30:41Z",
			number: "X12405139",
			dateCreated: "2017-02-06T22:43:05Z",
			dx: null,
			dob: "1962-01-03T06:00:00Z",
			ethnicity: "H",
			firstName: "Liam",
			gender: "M",
			id: 3,
			lastName: "Acosta",
			lastUpdated: "2017-02-06T22:43:05Z",
			middleName: null,
			name: "Liam Acosta",
			nameLNF: "Acosta, Liam",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123458343",
			lastUpdate: "2014-12-11T06:30:41Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:47 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 3,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:47Z",
		statusUpdated: "2017-02-07T20:33:48Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 52,
		bookin: {
			age: 54,
			ageAtBookin: 52,
			number: "15015405",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "N/A",
			dateCreated: "2017-02-07T20:33:48Z",
			day: 23,
			dob: "1963-01-04T06:00:00Z",
			ethnicity: "B",
			firstName: "LUCAS",
			gender: "M",
			history: null,
			id: 4,
			isFelony: null,
			jail: null,
			lastName: "ADAMS",
			lastUpdated: "2017-02-07T20:33:48Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: false,
			middleName: "D",
			month: 3,
			name: "LUCAS D ADAMS",
			nameLNF: "ADAMS, LUCAS D",
			hasParoleViolation: "N/A",
			releaseReason: "Release Reason",
			releaseStatus: "Released",
			releasedDate: null,
			sid: "50669325",
			ssn: "123459120",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: false,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 54,
			authoritative: true,
			added: "2014-12-11T17:57:10Z",
			number: "X11970576",
			dateCreated: "2017-02-06T22:43:05Z",
			dx: null,
			dob: "1963-01-04T06:00:00Z",
			ethnicity: "B",
			firstName: "Lucas",
			gender: "M",
			id: 4,
			lastName: "Adams",
			lastUpdated: "2017-02-06T22:43:05Z",
			middleName: null,
			name: "Lucas Adams",
			nameLNF: "Adams, Lucas",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123459120",
			lastUpdate: "2014-12-11T17:57:10Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:48 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 4,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:48Z",
		statusUpdated: "2017-02-07T20:33:48Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 51,
		bookin: {
			age: 53,
			ageAtBookin: 51,
			number: "15015392",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "N/A",
			dateCreated: "2017-02-07T20:33:48Z",
			day: 23,
			dob: "1964-01-05T06:00:00Z",
			ethnicity: "W",
			firstName: "NOAH",
			gender: "M",
			history: null,
			id: 5,
			isFelony: null,
			jail: null,
			lastName: "ADKINS",
			lastUpdated: "2017-02-07T20:33:48Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: false,
			middleName: "E",
			month: 3,
			name: "NOAH E ADKINS",
			nameLNF: "ADKINS, NOAH E",
			hasParoleViolation: "N/A",
			releaseReason: null,
			releaseStatus: null,
			releasedDate: null,
			sid: "50669271",
			ssn: "123459897",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: false,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 53,
			authoritative: true,
			added: "2014-12-11T16:03:27Z",
			number: "X5894397",
			dateCreated: "2017-02-06T22:43:05Z",
			dx: null,
			dob: "1964-01-05T06:00:00Z",
			ethnicity: "W",
			firstName: "Noah",
			gender: "M",
			id: 5,
			lastName: "Adkins",
			lastUpdated: "2017-02-06T22:43:05Z",
			middleName: null,
			name: "Noah Adkins",
			nameLNF: "Adkins, Noah",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123459897",
			lastUpdate: "2014-12-11T16:03:27Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:48 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 5,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:48Z",
		statusUpdated: "2017-02-07T20:33:48Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 50,
		bookin: {
			age: 52,
			ageAtBookin: 50,
			number: "15015498",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "N/A",
			dateCreated: "2017-02-07T20:33:48Z",
			day: 23,
			dob: "1965-01-06T06:00:00Z",
			ethnicity: "H",
			firstName: "MASON",
			gender: "M",
			history: null,
			id: 6,
			isFelony: null,
			jail: null,
			lastName: "AGUILAR",
			lastUpdated: "2017-02-07T20:33:48Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: false,
			middleName: "F",
			month: 3,
			name: "MASON F AGUILAR",
			nameLNF: "AGUILAR, MASON F",
			hasParoleViolation: "N/A",
			releaseReason: null,
			releaseStatus: null,
			releasedDate: null,
			sid: "50669212",
			ssn: "123460674",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: true,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 52,
			authoritative: true,
			added: "2014-12-11T16:53:37Z",
			number: "X91792028",
			dateCreated: "2017-02-06T22:43:05Z",
			dx: null,
			dob: "1965-01-06T06:00:00Z",
			ethnicity: "H",
			firstName: "Mason",
			gender: "M",
			id: 6,
			lastName: "Aguilar",
			lastUpdated: "2017-02-06T22:43:05Z",
			middleName: null,
			name: "Mason Aguilar",
			nameLNF: "Aguilar, Mason",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123460674",
			lastUpdate: "2014-12-11T16:53:37Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:48 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 6,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:48Z",
		statusUpdated: "2017-02-07T20:33:48Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 49,
		bookin: {
			age: 51,
			ageAtBookin: 49,
			number: "15015378",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "FELONY",
			dateCreated: "2017-02-07T20:33:48Z",
			day: 23,
			dob: "1966-01-07T06:00:00Z",
			ethnicity: "B",
			firstName: "ETHAN",
			gender: "M",
			history: null,
			id: 7,
			isFelony: null,
			jail: null,
			lastName: "AGUIRRE",
			lastUpdated: "2017-02-07T20:33:48Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: false,
			middleName: "G",
			month: 3,
			name: "ETHAN G AGUIRRE",
			nameLNF: "AGUIRRE, ETHAN G",
			hasParoleViolation: "VIOLATION",
			releaseReason: "Release Reason",
			releaseStatus: "Released",
			releasedDate: null,
			sid: "50669187",
			ssn: "123461451",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: true,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 51,
			authoritative: true,
			added: "2014-12-11T16:07:09Z",
			number: "X91416179",
			dateCreated: "2017-02-06T22:43:05Z",
			dx: null,
			dob: "1966-01-07T06:00:00Z",
			ethnicity: "B",
			firstName: "Ethan",
			gender: "M",
			id: 7,
			lastName: "Aguirre",
			lastUpdated: "2017-02-06T22:43:05Z",
			middleName: null,
			name: "Ethan Aguirre",
			nameLNF: "Aguirre, Ethan",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123461451",
			lastUpdate: "2015-06-09T13:21:00Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:48 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 7,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:48Z",
		statusUpdated: "2017-02-07T20:33:48Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 48,
		bookin: {
			age: 50,
			ageAtBookin: 48,
			number: "15015357",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "FELONY",
			dateCreated: "2017-02-07T20:33:48Z",
			day: 23,
			dob: "1967-01-08T06:00:00Z",
			ethnicity: "W",
			firstName: "CADEN",
			gender: "M",
			history: null,
			id: 8,
			isFelony: null,
			jail: null,
			lastName: "ALBERT",
			lastUpdated: "2017-02-07T20:33:48Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: false,
			middleName: "H",
			month: 3,
			name: "CADEN H ALBERT",
			nameLNF: "ALBERT, CADEN H",
			hasParoleViolation: "N/A",
			releaseReason: "Release Reason",
			releaseStatus: "Released",
			releasedDate: null,
			sid: "50669140",
			ssn: "123462228",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: false,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 50,
			authoritative: true,
			added: "2014-12-11T17:59:31Z",
			number: "X91103983",
			dateCreated: "2017-02-06T22:43:05Z",
			dx: null,
			dob: "1967-01-08T06:00:00Z",
			ethnicity: "W",
			firstName: "Caden",
			gender: "M",
			id: 8,
			lastName: "Albert",
			lastUpdated: "2017-02-06T22:43:05Z",
			middleName: null,
			name: "Caden Albert",
			nameLNF: "Albert, Caden",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123462228",
			lastUpdate: "2014-12-11T17:59:31Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:48 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 8,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:48Z",
		statusUpdated: "2017-02-07T20:33:48Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 47,
		bookin: {
			age: 49,
			ageAtBookin: 47,
			number: "15015332",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "FELONY",
			dateCreated: "2017-02-07T20:33:49Z",
			day: 23,
			dob: "1968-01-09T06:00:00Z",
			ethnicity: "H",
			firstName: "JACOB",
			gender: "M",
			history: null,
			id: 9,
			isFelony: null,
			jail: null,
			lastName: "ALEXANDER",
			lastUpdated: "2017-02-07T20:33:49Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: false,
			middleName: "I",
			month: 3,
			name: "JACOB I ALEXANDER",
			nameLNF: "ALEXANDER, JACOB I",
			hasParoleViolation: "N/A",
			releaseReason: "Release Reason",
			releaseStatus: "Released",
			releasedDate: null,
			sid: "50669097",
			ssn: "123463005",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: true,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 49,
			authoritative: true,
			added: "2014-12-11T16:26:12Z",
			number: "X170699",
			dateCreated: "2017-02-06T22:43:06Z",
			dx: null,
			dob: "1968-01-09T06:00:00Z",
			ethnicity: "H",
			firstName: "Jacob",
			gender: "M",
			id: 9,
			lastName: "Alexander",
			lastUpdated: "2017-02-07T21:09:04Z",
			middleName: null,
			name: "Jacob Alexander",
			nameLNF: "Alexander, Jacob",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123463005",
			lastUpdate: "2015-05-11T21:29:53Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:49 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 9,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:49Z",
		statusUpdated: "2017-02-07T20:33:49Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}, {
		actionStatus: null,
		ageAtBookin: 46,
		bookin: {
			age: 48,
			ageAtBookin: 46,
			number: "15015386",
			date: "2015-03-23T15:00:00Z",
			hasFelony: "FELONY",
			dateCreated: "2017-02-07T20:33:49Z",
			day: 23,
			dob: "1969-01-10T06:00:00Z",
			ethnicity: "B",
			firstName: "LOGAN",
			gender: "M",
			history: null,
			id: 10,
			isFelony: null,
			jail: null,
			lastName: "ALFORD",
			lastUpdated: "2017-02-07T20:33:49Z",
			lengthOfStay: 0,
			matchStatus: "Exact Match - SSN",
			mentalHealthPatient: true,
			middleName: "J",
			month: 3,
			name: "LOGAN J ALFORD",
			nameLNF: "ALFORD, LOGAN J",
			hasParoleViolation: "N/A",
			releaseReason: "Release Reason",
			releaseStatus: "Released",
			releasedDate: null,
			sid: "50669053",
			ssn: "123463782",
			tank: null,
			lastUpdate: "2015-03-23T15:00:00Z",
			tlets: false,
			year: 2015
		},
		cancelReason: null,
		client: {
			age: 48,
			authoritative: true,
			added: "2014-12-11T06:09:38Z",
			number: "X11833304",
			dateCreated: "2017-02-06T22:43:06Z",
			dx: null,
			dob: "1969-01-10T06:00:00Z",
			ethnicity: "B",
			firstName: "Logan",
			gender: "M",
			id: 10,
			lastName: "Alford",
			lastUpdated: "2017-02-06T22:43:06Z",
			middleName: null,
			name: "Logan Alford",
			nameLNF: "Alford, Logan",
			phone: "555-555-5555",
			releaseSigned: "Y",
			ssn: "123463782",
			lastUpdate: "2014-12-11T06:09:38Z"
		},
		confirmedDate: null,
		day: 7,
		history: "02/07/2017 14:33:49 PM CST - Auto-Matched on SSN and set to Match Confirmed status by STELLA",
		id: 10,
		lengthOfStay: 0,
		month: 2,
		status: "Match Confirmed",
		statusDateTime: "2017-02-07T20:33:49Z",
		statusUpdated: "2017-02-07T20:33:49Z",
		username: "stella auto-matching service",
		voAuthCode: null,
		year: 2017,
		yield: "Diversion"
	}];
	this.getDefaults = function(column, options){
		for (var i in options){
			if (options[i].key === column.key){
				column.defaults = options[i];
				break;
			}
		}
	};

	this.setDefaults = function(obj){
		obj.name = null;
		obj.type = null;
		obj.format = null;
		obj.parentKey = null;
		obj.key = null;
		obj.isHeader = false;
		for (var key in obj.defaults){
			obj[key] = obj.defaults[key];
		}
	};

	this.setSort = function(format){
		format.sort = [];
		for (var i in format.header.columns){
			var key = format.header.columns[i].parentKey ? format.header.columns[i].parentKey + '.' + format.header.columns[i].key : format.header.columns[i].key;
			if (format.header.columns[i].sortValue === 'ASC'){ format.sort.push(key); }
			else if (format.header.columns[i].sortValue === 'DESC'){ format.sort.push('-' + key); }
		}
	};

	this.addHeader = function(headers){
		headers.push({index: headers.length, isHeader: true, colspan: 1, rowspan: 1});
	};

	this.addFooter = function(footers){
		this.addRow(footers);
	};

	this.addRow = function(rows){
		rows.push({index: rows.length, columns: []});
		this.addColumn(rows[rows.length - 1]);
	};

	this.addColumn = function(row){
		row.columns.push({index: row.columns.length, colspan: 1, rowspan: 1});
	};

	this.moveUp = function(array, index){
		var tmp = array[index + 1];
		array[index].index++;
		array[index + 1] = array[index];
		array[index] = tmp;
		array[index].index = index;
	};

	this.moveDown = function(array, index){
		var tmp = array[index - 1];
		array[index].index--;
		array[index - 1] = array[index];
		array[index] = tmp;
		array[index].index = index;
	};

	this.remove = function(array, index){
		array.splice(index, 1);
		for (var i in array){
			array[i].index = parseInt(i);
		}
	};

	this.formatDate = function(format, date){
		return $.format.date(new Date(date), format);
	};

	this.calculateColumnSpan = function(format){
		if (typeof format === 'undefined'){ return 1; }

		var length = format.header.columns.length;
		for (var i in format.header.columns){
			length += format.header.columns[i].colspan;
		}

		length += format.footers.length;
		for (var i in format.footers){
			for (var k in format.footers[i].columns){
				length += format.footers[i].columns[k].colspan;
			}
		}

		length += format.rows.length;
		for (var i in format.rows){
			for (var k in format.rows[i].columns){
				length += format.rows[i].columns[k].colspan;
			}
		}

		return length + 1;
	};

	return this;
}]);

controllers.controller('FormatCtrl', ['BusyIndicator', '$scope', '$http', '$window',
		function(BusyIndicator, $scope, $http, $window){
	function load(){
		BusyIndicator.loading();
		$http({
			method: 'GET',
			url: '/format/getFormats'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.formats = response.data.formats;
			BusyIndicator.hide();
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		});
	}
	load();

	$scope.add = function(){
		$window.location.href = '/format/create';
	};

	$scope.edit = function(id){
		$window.location.href = '/format/edit/' + id;
	};

	$scope.delete = function(format){
		var name = $("<div>").text(format.name).html();
		bootbox.dialog({
			title: 'Delete Form ' +  name + '?',
			message: 
				'<span>'+
				'Are you sure you want to remove ' + name + '?' +
				'</span>',
				buttons: {
					cancel: {
						label: "Cancel",
						className: "btn-cancel"
					},
					confirm: {
						label: "Delete",
						className: "btn-danger",
						callback: function(){
							BusyIndicator.show("Deleting");
							$http({
								method: 'DELETE',
								url: '/format/delete',
								params: { id:  format.id }
							}).then(function successCallback(response){
								console.log('%s: %s', response.config.method, response.config.url, response);
								BusyIndicator.hide();
								load();
							}, function errorCallback(response){
								console.error('%s: %s', response.config.method, response.config.url, response);
								BusyIndicator.hide();
								bootbox.alert(response.data);
							});
						}
					}
				}
		});
	};
}]);

controllers.controller('CreateFormatCtrl', ['FormatCtrls', 'LoadService', 'Prompt', 'BusyIndicator', '$scope', '$http', '$window',
		function(FormatCtrls, LoadService, Prompt, BusyIndicator, $scope, $http, $window){
	$scope.format = {
			name: '',
			title: '',
			header: { index: 0, columns: [] },
			rows: [],
			footers: [],
			sort: [],
			logo: null,
			showTopDate: false,
			showBottomDate: false,
			dateLabel: 'Date',
			dateFormat: 'yyyy-MM-dd hh:mm:ss a',
			showTopCount: false,
			showBottomCount: false,
			countLabel: 'Count'
	};

	function load(){
		$scope.date = new Date();
		$scope.examples = FormatCtrls.examples;
		BusyIndicator.loading();
		LoadService.push($http({
			method: 'GET',
			url: '/format/getClassKeys'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.keys = response.data.keys;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		}));
		
		LoadService.push($http({
			method: 'GET',
			url: '/asset/getImages'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.imageSelect = { images: response.data.images, remove: function(item, succCallback, errCallback){
				$http({
					method: 'DELETE',
					url: '/asset/deleteImage',
					params: { id: item.id }
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					var index = indexOf(LoadService.imageSelect.images, item);
					LoadService.imageSelect.images.splice(index, 1);
					if (angular.isFunction(succCallback)){ succCallback(); }
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					if (response.status === 404){
						var index = indexOf(LoadService.imageSelect.images, item);
						LoadService.imageSelect.images.splice(index, 1);
					}
					if (angular.isFunction(errCallback)){ errCallback(response); }
				});
			}};
			LoadService.upload = { onSuccessItem: setLogo };
			$scope.images = response.data.images;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		}));
		
		LoadService.q(BusyIndicator.hide, true);
	}
	load();
	
	function setLogo(response){
		LoadService.imageSelect.images.push(response);
		console.log(response, LoadService.imageSelect.images);
		$scope.images = LoadService.imageSelect.images;
		$scope.format.logo = response;
		$scope.$apply();
		LoadService.notifyObservers();
	}

	$scope.save = function(){
		BusyIndicator.show("Saving");
		$http({
			method: 'POST',
			url: '/format/save',
			data: $scope.format,
			xsrfCookieName: 'xsrf_token',
			xsrfHeaderName : 'xsrf_token'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/format/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		});
	};

	$scope.setDefaults = function(obj){
		FormatCtrls.setDefaults(obj);
	};

	$scope.setSort = function(){
		FormatCtrls.setSort($scope.format);
	};

	$scope.addHeader = function(headers){
		FormatCtrls.addHeader(headers);
	};

	$scope.addFooter = function(footers){
		FormatCtrls.addFooter(footers);
	};

	$scope.addRow = function(rows){
		FormatCtrls.addRow(rows);
	};

	$scope.addColumn = function(row){
		FormatCtrls.addColumn(row);
	};

	$scope.moveUp = function(array, index){
		FormatCtrls.moveUp(array, index);
	};

	$scope.moveDown = function(array, index){
		FormatCtrls.moveDown(array, index);
	};

	$scope.remove = function(array, index){
		FormatCtrls.remove(array, index);
	};

	$scope.formatDate = function(format, date){
		return FormatCtrls.formatDate(format, date);
	};

	$scope.calculateColumnSpan = function(){
		return FormatCtrls.calculateColumnSpan($scope.format);
	};
}]);

controllers.controller('EditFormatCtrl', ['FormatCtrls', 'LoadService', 'Prompt', 'BusyIndicator', '$scope', '$http', '$window',
		function(FormatCtrls, LoadService, Prompt, BusyIndicator, $scope, $http, $window){
	$scope.format = {
			name: '',
			title: '',
			header: { index: 0, columns: [] },
			rows: [],
			footers: [],
			sort: [],
			logo: null,
			showTopDate: false,
			showBottomDate: false,
			dateLabel: 'Date',
			dateFormat: 'yyyy-MM-dd hh:mm:ss a',
			showTopCount: false,
			showBottomCount: false,
			countLabel: 'Count'
	};
	
	function load(){
		$scope.date = new Date();
		$scope.examples = FormatCtrls.examples;
		BusyIndicator.loading();
		LoadService.push($http({
			method: 'GET',
			url: '/format/getFormat',
			params: { id:  $scope.id }
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.format = angular.extend($scope.format, response.data);
			for (var i in $scope.format.header.columns){
				FormatCtrls.getDefaults($scope.format.header.columns[i], $scope.keys);
			}

			for (var i in $scope.format.rows){
				for (var k in $scope.format.rows[i].columns){
					FormatCtrls.getDefaults($scope.format.rows[i].columns[k], $scope.keys);
				}
			}
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		}));
		
		LoadService.push($http({
			method: 'GET',
			url: '/format/getClassKeys'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			$scope.keys = response.data.keys;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		}));
		
		LoadService.push($http({
			method: 'GET',
			url: '/asset/getImages'
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			LoadService.imageSelect = { images: response.data.images, remove: function(item, succCallback, errCallback){
				$http({
					method: 'DELETE',
					url: '/asset/deleteImage',
					params: { id: item.id }
				}).then(function successCallback(response){
					console.log('%s: %s', response.config.method, response.config.url, response);
					var index = indexOf(LoadService.imageSelect.images, item);
					LoadService.imageSelect.images.splice(index, 1);
					if (angular.isFunction(succCallback)){ succCallback(); }
				}, function errorCallback(response){
					console.error('%s: %s', response.config.method, response.config.url, response);
					if (response.status === 404){
						var index = indexOf(LoadService.imageSelect.images, item);
						LoadService.imageSelect.images.splice(index, 1);
					}
					if (angular.isFunction(errCallback)){ errCallback(response); }
				});
			}};
			LoadService.upload = { onSuccessItem: setLogo };
			$scope.images = response.data.images;
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			Prompt(response.data);
		}));
		
		LoadService.q(BusyIndicator.hide, true);
	}
	load();
	
	function setLogo(response){
		LoadService.imageSelect.images.push(response);
		console.log(response, LoadService.imageSelect.images);
		$scope.images = LoadService.imageSelect.images;
		$scope.format.logo = response;
		$scope.$apply();
		LoadService.notifyObservers();
	}

	$scope.save = function(){
		BusyIndicator.show("Saving");
		$http({
			method: 'PUT',
			url: '/format/update',
			params: { id:  $scope.format.id },
			data: $scope.format
		}).then(function successCallback(response){
			console.log('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
			$window.location.href = '/format/list';
		}, function errorCallback(response){
			console.error('%s: %s', response.config.method, response.config.url, response);
			BusyIndicator.hide();
		});
	};

	$scope.setDefaults = function(obj){
		FormatCtrls.setDefaults(obj);
	};

	$scope.setSort = function(){
		FormatCtrls.setSort($scope.format);
	};

	$scope.addHeader = function(headers){
		FormatCtrls.addHeader(headers);
	};

	$scope.addFooter = function(footers){
		FormatCtrls.addFooter(footers);
	};

	$scope.addRow = function(rows){
		FormatCtrls.addRow(rows);
	};

	$scope.addColumn = function(row){
		FormatCtrls.addColumn(row);
	};

	$scope.moveUp = function(array, index){
		FormatCtrls.moveUp(array, index);
	};

	$scope.moveDown = function(array, index){
		FormatCtrls.moveDown(array, index);
	};

	$scope.remove = function(array, index){
		FormatCtrls.remove(array, index);
	};

	$scope.formatDate = function(format, date){
		return FormatCtrls.formatDate(format, date);
	};

	$scope.calculateColumnSpan = function(){
		return FormatCtrls.calculateColumnSpan($scope.format);
	};
}]);