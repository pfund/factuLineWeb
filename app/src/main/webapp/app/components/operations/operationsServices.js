'use strict';

/* Services */

var factuLineServices = angular.module('myApp.operationServices', ['ngResource']);

factuLineServices.factory('OperationRest', ['$resource',
  function($resource){
    return $resource('/factuLineRest/operation/:id', {}, {
      query: {method:'GET', isArray:true},
      post: {method:'POST'},
      update: {method:'PUT'},
      delete: {method:'DELETE', params:{id: '@id'}}
    });
  }
]);

factuLineServices.factory('OperationsFactory', ['$resource', 
  function($resource) {
    return $resource('/factuLineRest/operation/getOperationsInMonth/:dateOperation', {} , {
      getOperationsInMonth: {method:'GET', params:{dateOperation: '@dateOperation'}, isArray:true}
    });
  }
]);

factuLineServices.factory('MonthOperationFactory', ['$resource',
  function($resource) {
    return $resource('/factuLineRest/monthOperations', {}, {
      getMonthOperations: {method: 'GET', isArray: true}
    });
  }
]);
