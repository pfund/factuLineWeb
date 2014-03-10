'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$routeParams', function($scope, $routeParams) {

    $scope.dayId = $routeParams.dayId;

    $scope.newInput = new Consult();

    $scope.consults = [
      { consultDate : new Date(),
        firstName : "first1",
        lastName : "last1",
        birthDate : "12.12.1990",
        fullPrice : 192.50,
        rebate : 0
      },
      { consultDate : new Date(),
        firstName : "first2",
        lastName : "last2",
        birthDate : "22.12.1990",
        fullPrice : 12.50,
        rebate : 0
      },
      { consultDate : new Date(),
        firstName : "first3",
        lastName : "last3",
        birthDate : "13.12.2003",
        fullPrice : 400.00,
        rebate : 0.1
      }
    ];
  }])


  .controller('DatepickerCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {

      $scope.dt = new Date();

      $scope.dateChanged = function() {
	var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
	window.location.href = '#/day/' + formattedDate;
      };
  }]);

