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


  .controller('DatepickerCtrl', ['$scope', 'dateFilter', function($scope, dateFilter) {

      $scope.dt = new Date();

      $scope.dateChanged = function() {
	var formattedDate = dateFilter($scope.dt, 'dd.MM.yyyy');
	window.location.href = '#/day/' + formattedDate;
      };
  }]);

