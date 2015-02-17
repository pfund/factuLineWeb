'use strict';

/* Controllers */

angular.module('myApp.administrationControllers', [])

  .controller('AdminCtrl', ['$scope', 'OperationHospitalRest', 
          function($scope, OperationHospitalRest) {

    // TODO change this to newOperationHospitalInput
    // TODO change the input, modify to add operationHospital

    $scope.createNewInput = function() {
      $scope.insertMode = true;
      $scope.newInput = {};
    }



    OperationHospitalRest.query({}, 
      function(data) {
        $scope.allOperationHospital = data;
        $scope.createNewInput();
      }
    );

    $scope.insert = function() {
      if ($scope.insertMode) {
        OperationHospitalRest.save({}, $scope.newInput, 
          function(data) {
            $scope.allOperationHospital.push(data);
            $scope.createNewInput();
          }
        );
      } else {
        OperationHospitalRest.update($scope.newInput,
          function(data) {
            for (var i = $scope.allOperationHospital.length - 1; i >= 0; i--) {
              if ($scope.allOperationHospital[i].id === $scope.newInput.id) {
                $scope.allOperationHospital.splice(i, 1);
              }
            }
            $scope.allOperationHospital.push(data);
            $scope.createNewInput();
          }
       );
      }
    };

   $scope.modify = function(operationHospital) {
     $scope.insertMode = false;
     $scope.newInput = JSON.parse(JSON.stringify(operationHospital));
   };


  }]);




