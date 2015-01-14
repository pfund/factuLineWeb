'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope', 'MonthsFactory', 
                function($scope, MonthsFactory) {
    MonthsFactory.getMonths({}, function(data) {
      $scope.monthsResume = data;
    });
  }])

  .controller('MyCtrl2', ['$scope', '$routeParams', 'ConsultRest', 'ConsultsFactory',
          function($scope, $routeParams, ConsultRest, ConsultsFactory) {

    $scope.dateConsult = moment($routeParams.dayId, "DD.MM.YYYY").toDate();

    $scope.sortConsults = function() {
      $scope.consults.sort(function(a, b) {return a.order - b.order;});
    };

    $scope.getNextOrder = function() {
      var maxOrder = 0;
      for (var i = $scope.consults.length - 1; i >= 0; i--) {
        if ($scope.consults[i].order > maxOrder) maxOrder = $scope.consults[i].order;
      }
      return maxOrder + 1;
    };

    $scope.createNewInput = function() {
      $scope.insertMode = true;

      $scope.newInput = new Consult();
      $scope.newInput.dateConsult = $scope.dateConsult;
      $scope.newInput.order = $scope.getNextOrder();

      var inputLastNameElement = document.getElementById("inputLastName");
      if (inputLastNameElement) {
        inputLastNameElement.focus();
      }
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
          alert("Birth date not valid");
          return;
        } else {
          $scope.newInput.birthDate = momentBirthDate.toDate();
        }
      }
      if ($scope.insertMode) {
        ConsultRest.save({}, $scope.newInput, 
          function(data) {
            $scope.consults.push(data);
            $scope.sortConsults();

            $scope.createNewInput();
          }
        );
      } else {
        ConsultRest.update($scope.newInput,
          function(data) {
            for (var i = $scope.consults.length - 1; i >= 0; i--) {
              if ($scope.consults[i].id === $scope.newInput.id) {
                $scope.consults.splice(i, 1);
              }
            }
            $scope.consults.push(data);
            $scope.sortConsults();

            $scope.createNewInput();
          }
       );
      }
    };

    $scope.delete = function(id) {
      ConsultRest.delete({'id':id}, 
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

    $scope.modify = function(consult) {
      $scope.insertMode = false;
      $scope.newInput = JSON.parse(JSON.stringify(consult));
      if (consult.birthDate) {
        $scope.newInput.birthDate = moment(consult.birthDate).format("DD.MM.YYYY");
      }
      $scope.newInput.dateConsult = moment(consult.dateConsult).toDate();
    };

    $scope.getDayConsultationPrice = function() {
        if (!$scope.consults) return 0;

        var sum = 0;
        for (var i=0; i<$scope.consults.length; i++) {sum += $scope.consults[i].consultationPrice;}
        return sum;
    };

    $scope.getDayConsultationPriceWithRebate = function() {
      if (!$scope.consults) return 0;

      var sum = 0;
      for (var i=0; i<$scope.consults.length; i++) {sum += $scope.consults[i].consultationPrice * (1 - $scope.consults[i].rebate);}
      return sum;
    };

    $scope.getDayMaterialPrice = function() {
        if (!$scope.consults) return 0;

        var sum = 0;
        for (var i=0; i<$scope.consults.length; i++) {sum += $scope.consults[i].materialPrice;}
        return sum;
    };
    
    $scope.getDayMedicamentPrice = function() {
        if (!$scope.consults) return 0;

        var sum = 0;
        for (var i=0; i<$scope.consults.length; i++) {sum += $scope.consults[i].medicamentPrice;}
        return sum;
    };

    $scope.getTotalDayPrice = function() {
      if (!$scope.consults) return 0;
      var sum = 0;
      for (var i=0; i<$scope.consults.length; i++) {sum += $scope.consults[i].consultationPrice * (1 - $scope.consults[i].rebate) + $scope.consults[i].materialPrice + $scope.consults[i].medicamentPrice;}
      return sum;
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

    $scope.dateOperation = moment($routeParams.dayId, "DD.MM.YYYY").toDate();
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

    OperationsFactory.getOperationsInMonth({'dateOperation':$scope.dateOperation}, 
      function(data) {
        $scope.operations = data;
        $scope.createNewInput();
      }
    );
    
    $scope.insert = function() {
      if ($scope.newInput.operationHospital && $scope.newInput.operationHospital.name) {
        $scope.newInput.operationHospital = $scope.newInput.operationHospital.name;
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
      $scope.newInput.dateOperation = moment(operation.dateOperation).toDate();
      if (operation.paymentRecievedDate) $scope.newInput.paymentRecievedDate = moment(operation.paymentRecievedDate).format("DD.MM.YYYY");
      if (operation.assistantsPaidDate) $scope.newInput.assistantsPaidDate = moment(operation.assistantsPaidDate).format("DD.MM.YYYY");
    };
    
    $scope.getNiceDate = function(date) {
      return moment(date).format("DD.MM.YY");
    }

  }])

  .controller('DatepickerCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {
    $scope.dt = new Date();

    $scope.dateChanged = function() {
      var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
      window.location.href = '#/day/' + formattedDate;
    };
  }])
  
  .controller('DatepickerOperationCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {
    $scope.dt = new Date();

    $scope.dateChanged = function() {
      var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
      window.location.href = '#/operations/day/' + formattedDate;
   };
  }])

  .controller('DatepickerAssistanceCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {
    $scope.dt = new Date();

    $scope.dateChanged = function() {
      var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
      window.location.href = '#/assistances/day/' + formattedDate;
   };
  }])

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


  }])

  .controller('AssistanceCalendarCtrl', ['$scope', 'MonthAssistanceFactory', 
          function($scope, MonthAssistanceFactory) {

    MonthAssistanceFactory.getMonthAssistances({},
      function(data) {
        $scope.allMonthAssistances = data;
      }
    );

    $scope.changeLocation = function(url) {
      window.location = url;
    }

  }])

  .controller('AssistanceCtrl', ['$scope', '$routeParams', '$location', 'AssistanceRest', 'AssistancesFactory',  
          function($scope, $routeParams, $location, AssistanceRest, AssistancesFactory) {

    // Check if we have to open the insert panel or not (by default yes)
    $scope.openInsertPanel = true;
    if (typeof $location.search().openInsertPanel !== 'undefined') {
        $scope.openInsertPanel = $location.search().openInsertPanel;
    }

    $scope.dateAssistance = moment($routeParams.dayId, "DD.MM.YYYY").toDate();

    $scope.createNewInput = function() {
      $scope.insertMode = true;

      $scope.newInput = new Assistance();
      $scope.newInput.dateAssistance = $scope.dateAssistance;

      var inputLastNameElement = document.getElementById("inputLastName");
      if (inputLastNameElement) {
        inputLastNameElement.focus();
      }
    };

    AssistancesFactory.getAssistancesInMonth({'dateAssistance':$scope.dateAssistance}, 
      function(data) {
        $scope.assistances = data;
        $scope.createNewInput();
      }
    );
    
    $scope.insert = function() {
      var stringPaidDate = $scope.newInput.paidDate;
      if (stringPaidDate) {
        // Start by checking the YYYY format first, otherwise moment will take 2030(YYYY) as a 20 (YY)
        var momentPaidDate = moment(stringPaidDate, "DD.MM.YYYY");
        if (!momentPaidDate.isValid()) {
          momentPaidDate = moment(stringPaidDate, "DD.MM.YY");
        }
        if (!momentPaidDate.isValid()) {
          // TODO alert the user and abort sending
          alert("AssistantsPaidDate not valid");
          return;
        } else {
          $scope.newInput.paidDate = momentPaidDate.toDate();
        }
      }

      if ($scope.insertMode) {
        AssistanceRest.save({}, $scope.newInput, 
          function(data) {
            $scope.assistances.push(data);

            $scope.createNewInput();
          }
        );
      } else {
        AssistanceRest.update($scope.newInput,
          function(data) {
            for (var i = $scope.assistances.length - 1; i >= 0; i--) {
              if ($scope.assistances[i].id === $scope.newInput.id) {
                $scope.assistances.splice(i, 1);
              }
            }
            $scope.assistances.push(data);

            $scope.createNewInput();
          }
       );
      }
    };

    $scope.delete = function(id) {
      AssistanceRest.delete({'id':id}, 
        function() {
          for (var i = $scope.assistances.length - 1; i >= 0; i--) {
            if ($scope.assistances[i].id === id) {
              $scope.assistances.splice(i, 1);
            }
          }
        }
      );
    };

    $scope.modify = function(assistance) {
      $scope.insertMode = false;
      $scope.openInsertPanel = true;  // TODO does not work
      $scope.newInput = JSON.parse(JSON.stringify(assistance));
      $scope.newInput.dateAssistance = moment(assistance.dateAssistance).toDate();
      if (assistance.paidDate) $scope.newInput.paidDate = moment(assistance.paidDate).format("DD.MM.YYYY");
    };
    
    $scope.getNiceDate = function(date) {
      return moment(date).format("DD.MM.YY");
    }

  }]);




