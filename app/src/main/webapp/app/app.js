'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.administrationServices',
  'myApp.consultationServices',
  'myApp.operationServices',
  'myApp.assistanceServices',
  'myApp.directives',
  'myApp.administrationControllers',
  'myApp.consultationControllers',
  'myApp.operationControllers',
  'myApp.assistanceControllers',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/consultations/calendar', {templateUrl: 'app/components/consultations/consultationsCalendarView.html', controller: 'ConsultationCalendarCtrl'});
  $routeProvider.when('/consultations/day/:dayId', {templateUrl: 'app/components/consultations/consultationsDayView.html', controller: 'ConsultationCtrl'});
  $routeProvider.when('/operations/calendar', {templateUrl: 'app/components/operations/operationsCalendarView.html', controller: 'OperationCalendarCtrl'});
  $routeProvider.when('/operations/day/:dayId', {templateUrl: 'app/components/operations/operationsDayView.html', controller: 'OperationCtrl'});
  $routeProvider.when('/assistances/calendar', {templateUrl: 'app/components/assistances/assistancesCalendarView.html', controller: 'AssistanceCalendarCtrl'});
  $routeProvider.when('/assistances/day/:dayId', {templateUrl: 'app/components/assistances/assistancesDayView.html', controller: 'AssistanceCtrl'});
  $routeProvider.when('/administration', {templateUrl: 'app/shared/administration/administrationView.html', controller: 'AdminCtrl'});
  $routeProvider.otherwise({redirectTo: '/consultations/calendar'});
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

