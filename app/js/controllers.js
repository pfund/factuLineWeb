'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$routeParams', 'FactuLineRest', 
		  function($scope, $routeParams, FactuLineRest) {

    $scope.dayId = $routeParams.dayId;

    $scope.newInput = new Consult();

    FactuLineRest.query( function(data) {
      $scope.consults = data;
    });

    $scope.insert = function() {
      $scope.consults.push($scope.newInput);
      FactuLineRest.save({}, $scope.newInput);
      $scope.newInput = new Consult();
    };
  }])


  .controller('DatepickerCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {

      $scope.dt = new Date();

      $scope.dateChanged = function() {
	var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
	window.location.href = '#/day/' + formattedDate;
      };
  }]);

