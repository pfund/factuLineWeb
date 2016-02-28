'use strict';

/* Services */

var factuLineServices = angular.module('myApp.operationServices', ['ngResource']);

factuLineServices.factory('OperationRest', ['$resource', 'restHost',
  function($resource, restHost){
    return $resource(restHost + '/factuLineRest/operation/:id', {}, {
      query: {method:'GET', isArray:true},
      post: {method:'POST'},
      update: {method:'PUT'},
      delete: {method:'DELETE', params:{id: '@id'}}
    });
  }
]);

factuLineServices.factory('OperationsFactory', ['$resource', 'restHost',
  function($resource, restHost) {
    return $resource(restHost + '/factuLineRest/operation/getOperationsInMonth/:dateOperation', {} , {
      getOperationsInMonth: {method:'GET', params:{dateOperation: '@dateOperation'}, isArray:true}
    });
  }
]);

factuLineServices.factory('MonthOperationFactory', ['$resource', 'restHost',
  function($resource, restHost) {
    return $resource(restHost + '/factuLineRest/monthOperations', {}, {
      getMonthOperations: {method: 'GET', isArray: true}
    });
  }
]);
