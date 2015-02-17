'use strict';

/* Controllers */

angular.module('myApp.operationControllers', [])

  .controller('DatepickerOperationCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {
    $scope.dt = new Date();

    $scope.dateChanged = function() {
      var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
      window.location.href = '#/operations/day/' + formattedDate;
   };
  }])

  .controller('OperationCalendarCtrl', ['$scope', 'MonthOperationFactory', 
          function($scope, MonthOperationFactory) {

    MonthOperationFactory.getMonthOperations({},
      function(data) {
        $scope.allMonthOperations = data;
      }
    );

    $scope.changeLocation = function(url) {
      window.location = url;
    }

  }])

  .controller('OperationCtrl', ['$scope', '$routeParams', '$location', 'OperationRest', 'OperationsFactory', 'OperationHospitalRest',  
          function($scope, $routeParams, $location, OperationRest, OperationsFactory, OperationHospitalRest) {

    // Check if we have to open the insert panel or not (by default yes)
    $scope.openInsertPanel = true;
    if (typeof $location.search().openInsertPanel !== 'undefined') {
        $scope.openInsertPanel = $location.search().openInsertPanel;
    }

    $scope.dateOperation = $routeParams.dayId;
    $scope.allOperationHospital = [];

    OperationHospitalRest.query({}, 
      function(data) {
        $scope.allOperationHospital = data;
      }
    );

    $scope.createNewInput = function() {
      $scope.insertMode = true;

      $scope.newInput = new Operation();
      $scope.newInput.dateOperation = $scope.dateOperation;

      var inputLastNameElement = document.getElementById("inputLastName");
      if (inputLastNameElement) {
        inputLastNameElement.focus();
      }
    };

    OperationsFactory.getOperationsInMonth({'dateOperation':moment($scope.dateOperation, "DD.MM.YYYY").toDate()}, 
      function(data) {
        $scope.operations = data;
        $scope.createNewInput();
      }
    );
    
    $scope.insert = function() {
      if ($scope.newInput.operationHospital && $scope.newInput.operationHospital.name) {
        $scope.newInput.operationHospital = $scope.newInput.operationHospital.name;
      }
      var stringDateOperation = $scope.newInput.dateOperation;
      if (stringDateOperation) {
        // Start by checking the YYYY format first, otherwise moment will take 2030(YYYY) as a 20 (YY)
        var momentDateOperation = moment(stringDateOperation, "DD.MM.YYYY");
        if (!momentDateOperation.isValid()) {
          momentDateOperation = moment(stringDateOperation, "DD.MM.YY");
        }
        if (!momentDateOperation.isValid()) {
          // TODO alert the user and abort sending
          alert("dateOperation not valid");
          return;
        } else {
          $scope.newInput.dateOperation = momentDateOperation.toDate();
        }
      }
      var stringPaymentRecievedDate = $scope.newInput.paymentRecievedDate;
      if (stringPaymentRecievedDate) {
        // Start by checking the YYYY format first, otherwise moment will take 2030(YYYY) as a 20 (YY)
        var momentPaymentRecievedDate = moment(stringPaymentRecievedDate, "DD.MM.YYYY");
        if (!momentPaymentRecievedDate.isValid()) {
          momentPaymentRecievedDate = moment(stringPaymentRecievedDate, "DD.MM.YY");
        }
        if (!momentPaymentRecievedDate.isValid()) {
          // TODO alert the user and abort sending
          alert("PaymentRecievedDate not valid");
          return;
        } else {
          $scope.newInput.paymentRecievedDate = momentPaymentRecievedDate.toDate();
        }
      }
      var stringAssistantsPaidDate = $scope.newInput.assistantsPaidDate;
      if (stringAssistantsPaidDate) {
        // Start by checking the YYYY format first, otherwise moment will take 2030(YYYY) as a 20 (YY)
        var momentAssistantsPaidDate = moment(stringAssistantsPaidDate, "DD.MM.YYYY");
        if (!momentAssistantsPaidDate.isValid()) {
          momentAssistantsPaidDate = moment(stringAssistantsPaidDate, "DD.MM.YY");
        }
        if (!momentAssistantsPaidDate.isValid()) {
          // TODO alert the user and abort sending
          alert("AssistantsPaidDate not valid");
          return;
        } else {
          $scope.newInput.assistantsPaidDate = momentAssistantsPaidDate.toDate();
        }
      }

      if ($scope.insertMode) {
        OperationRest.save({}, $scope.newInput, 
          function(data) {
            $scope.operations.push(data);

            $scope.createNewInput();
          }
        );
      } else {
        OperationRest.update($scope.newInput,
          function(data) {
            for (var i = $scope.operations.length - 1; i >= 0; i--) {
              if ($scope.operations[i].id === $scope.newInput.id) {
                $scope.operations.splice(i, 1);
              }
            }
            $scope.operations.push(data);

            $scope.createNewInput();
          }
       );
      }
    };

    $scope.delete = function(id) {
      OperationRest.delete({'id':id}, 
        function() {
          for (var i = $scope.operations.length - 1; i >= 0; i--) {
            if ($scope.operations[i].id === id) {
              $scope.operations.splice(i, 1);
            }
          }
        }
      );
    };

    $scope.modify = function(operation) {
      $scope.insertMode = false;
      $scope.openInsertPanel = true;  // TODO does not work
      $scope.newInput = JSON.parse(JSON.stringify(operation));
      $scope.newInput.dateOperation = moment(operation.dateOperation).format("DD.MM.YYYY");
      if (operation.paymentRecievedDate) $scope.newInput.paymentRecievedDate = moment(operation.paymentRecievedDate).format("DD.MM.YYYY");
      if (operation.assistantsPaidDate) $scope.newInput.assistantsPaidDate = moment(operation.assistantsPaidDate).format("DD.MM.YYYY");
    };
    
    $scope.getNiceDate = function(date) {
      return moment(date).format("DD.MM.YY");
    }

  }]);




