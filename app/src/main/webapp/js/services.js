'use strict';

/* Services */

var factuLineServices = angular.module('myApp.services', ['ngResource']);

factuLineServices.factory('ConsultRest', ['$resource',
  function($resource){
    return $resource('/factuLineRest/consult/:id', {}, {
      query: {method:'GET', params:{id:'@id'}, isArray:true},
      post: {method:'POST'},
      update: {method:'PUT'},
      delete: {method:'DELETE', params:{id: '@id'}}
    });
  }
]);

factuLineServices.factory('ConsultsFactory', ['$resource', 
  function($resource) {
    return $resource('/factuLineRest/consult/getByDateConsult/:dateConsult', {} , {
      getByDateConsult: {method:'GET', params:{dateConsult: '@dateConsult'}, isArray:true}
    });
  }
]);

factuLineServices.factory('MonthsFactory', ['$resource',
  function($resource) {
    return $resource('/factuLineRest/months/', {}, {
      getMonths: {method:'GET', isArray:true}
    });
  }
]);


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

factuLineServices.factory('OperationHospitalRest', ['$resource', 
  function($resource) {
    return $resource('/factuLineRest/administration/operationHospital/', {}, {
      query: {method:'GET', isArray:true},
      post: {method:'POST'},
      update: {method:'PUT'}
    });
  }
]);

