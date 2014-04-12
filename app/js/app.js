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
