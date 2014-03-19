'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$routeParams', 'FactuLineRest', 'ConsultsFactory',
		  function($scope, $routeParams, FactuLineRest, ConsultsFactory) {

    $scope.dateConsult = moment($routeParams.dayId, "DD.MM.YYYY").toDate();
    console.log($scope.dateConsult);

    $scope.newInput = new Consult();
    $scope.newInput.dateConsult = $scope.dateConsult;
      
//    FactuLineRest.query( function(data) {
//      $scope.consults = data;
//    });
    ConsultsFactory.getByDateConsult({'dateConsult':$scope.dateConsult}, 
      function(data) {
        $scope.consults = data;
      }
    );

    $scope.insert = function() {
      var stringBirthDate = $scope.newInput.birthDate;
      if (stringBirthDate) {
	// Start by checking the YYYY format first, otherwise moment will take 2030(YYYY) as a 20 (YY)
	var momentBirthDate = moment(stringBirthDate, "DD.MM.YYYY");
        if (!momentBirthDate.isValid()) {
          momentBirthDate = moment(stringBirthDate, "DD.MM.YY");
        }
        if (!momentBirthDate.isValid()) {
          // TODO alert the user and abort sending
	  console.log("not valid");
	  return;
	} else {
          $scope.newInput.birthDate = momentBirthDate.toDate();
	}
      }
      $scope.consults.push($scope.newInput);
      FactuLineRest.save({}, $scope.newInput);
      $scope.newInput = new Consult();
      $scope.newInput.dateConsult = $scope.dateConsult;
    };

    $scope.delete = function(id) {
      FactuLineRest.delete({'id':id});
      FactuLineRest.query( function(data) {
        $scope.consults = data;
      });
    };
    
  }])


  .controller('DatepickerCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {

      $scope.dt = new Date();

      $scope.dateChanged = function() {
	var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
	window.location.href = '#/day/' + formattedDate;
      };
  }]);

