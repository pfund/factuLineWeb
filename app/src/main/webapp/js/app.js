'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calendar', {templateUrl: 'partials/calendarView.html', controller: 'MyCtrl1'});
  $routeProvider.when('/day/:dayId', {templateUrl: 'partials/dayView.html', controller: 'MyCtrl2'});
  $routeProvider.when('/operations/calendar', {templateUrl: 'partials/operationsCalendarView.html', controller: 'OperationCalendarCtrl'});
  $routeProvider.when('/operations/day/:dayId', {templateUrl: 'partials/operationsDayView.html', controller: 'OperationCtrl'});
  $routeProvider.when('/assistances/calendar', {templateUrl: 'partials/assistancesCalendarView.html', controller: 'AssistanceCalendarCtrl'});
  $routeProvider.when('/assistances/day/:dayId', {templateUrl: 'partials/assistancesDayView.html', controller: 'AssistanceCtrl'});
  $routeProvider.when('/administration', {templateUrl: 'partials/administrationView.html', controller: 'AdminCtrl'});
  $routeProvider.otherwise({redirectTo: '/calendar'});
}]);



function Consult() {
  this.id = null;
  this.order = 0;
  this.firstName = "";
  this.lastName = "";
  this.birthDate = null;
  this.consultationPrice = null;
  this.materialPrice = null;
  this.medicamentPrice = null;
  this.rebate = 0;
  this.comment = "";
}; 

function Operation() {
	  this.id = null;
	  this.firstName = "";
	  this.lastName = "";
	}; 

function Assistance() {
    this.id = null;
    this.firstName = "";
    this.lastName = "";
}

