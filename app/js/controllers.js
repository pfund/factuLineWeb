'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$routeParams', 'FactuLineRest', 'ConsultsFactory',
		  function($scope, $routeParams, FactuLineRest, ConsultsFactory) {

    $scope.dateConsult = moment($routeParams.dayId, "DD.MM.YYYY").toDate();

    $scope.getNextOrder = function() {
      var maxOrder = 0;
      for (var i = $scope.consults.length - 1; i >= 0; i--) {
        if ($scope.consults[i].order > maxOrder) maxOrder = $scope.consults[i].order;
      }
      return maxOrder + 1;
    };

    $scope.createNewInput = function() {
      $scope.newInput = new Consult();
      $scope.newInput.dateConsult = $scope.dateConsult;
      $scope.newInput.order = $scope.getNextOrder();
    };

    ConsultsFactory.getByDateConsult({'dateConsult':$scope.dateConsult}, 
      function(data) {
        $scope.consults = data;
        $scope.createNewInput();
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
      FactuLineRest.save({}, $scope.newInput, 
        function(data) {
          $scope.consults.push(data);

          $scope.createNewInput();
        }
      );
    };

    $scope.delete = function(id) {
      FactuLineRest.delete({'id':id}, 
        function() {
          for (var i = $scope.consults.length - 1; i >= 0; i--) {
            if ($scope.consults[i].id === id) {
              $scope.consults.splice(i, 1);
            }
          }
	  $scope.newInput.order = $scope.getNextOrder();
	}
      );
    };
    
  }])


  .controller('DatepickerCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {

      $scope.dt = new Date();

      $scope.dateChanged = function() {
	var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
	window.location.href = '#/day/' + formattedDate;
      };
  }]);

