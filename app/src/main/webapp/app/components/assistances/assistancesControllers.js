'use strict';

/* Controllers */

angular.module('myApp.assistanceControllers', [])

  .controller('DatepickerAssistanceCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {
    $scope.dt = new Date();

    $scope.dateChanged = function() {
      var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
      window.location.href = '#/assistances/day/' + formattedDate;
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

  .controller('AssistanceCtrl', ['$scope', '$routeParams', '$location', 'AssistanceRest', 'AssistancesFactory', 'OperationHospitalRest', 
          function($scope, $routeParams, $location, AssistanceRest, AssistancesFactory, OperationHospitalRest) {

    // Check if we have to open the insert panel or not (by default yes)
    $scope.openInsertPanel = true;
    if (typeof $location.search().openInsertPanel !== 'undefined') {
        $scope.openInsertPanel = $location.search().openInsertPanel;
    }

    $scope.dateAssistance = $routeParams.dayId;
    $scope.allOperationHospital = [];

    OperationHospitalRest.query({}, 
      function(data) {
        $scope.allOperationHospital = data;
      }
    );

    $scope.createNewInput = function() {
      $scope.insertMode = true;

      $scope.newInput = new Assistance();
      $scope.newInput.dateAssistance = $scope.dateAssistance;

      var inputOperatorElement = document.getElementById("inputOperator");
      if (inputOperatorElement) {
        inputOperatorElement.focus();
      }
    };

    AssistancesFactory.getAssistancesInMonth({'dateAssistance':moment($scope.dateAssistance, "DD.MM.YYYY").toDate()}, 
      function(data) {
        $scope.assistances = data;
        $scope.createNewInput();
      }
    );
    
    $scope.insert = function() {
      var stringDateAssistance = $scope.newInput.dateAssistance;
      if (stringDateAssistance) {
        // Start by checking the YYYY format first, otherwise moment will take 2030(YYYY) as a 20 (YY)
        var momentDateAssistance = moment(stringDateAssistance, "DD.MM.YYYY");
        if (!momentDateAssistance.isValid()) {
          momentDateAssistance = moment(stringDateAssistance, "DD.MM.YY");
        }
        if (!momentDateAssistance.isValid()) {
          // TODO alert the user and abort sending
          alert("dateAssistance not valid");
          return;
        } else {
          $scope.newInput.dateAssistance = momentDateAssistance.toDate();
        }
      }
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
      $scope.newInput.dateAssistance = moment(assistance.dateAssistance).format("DD.MM.YYYY");
      if (assistance.paidDate) $scope.newInput.paidDate = moment(assistance.paidDate).format("DD.MM.YYYY");
    };
    
    $scope.getNiceDate = function(date) {
      return moment(date).format("DD.MM.YY");
    }

  }]);




