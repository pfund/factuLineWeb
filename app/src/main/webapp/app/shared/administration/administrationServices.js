'use strict';

/* Services */

var factuLineServices = angular.module('myApp.administrationServices', ['ngResource']);

factuLineServices.factory('OperationHospitalRest', ['$resource', 
  function($resource) {
    return $resource('/factuLineRest/administration/operationHospital/', {}, {
      query: {method:'GET', isArray:true},
      post: {method:'POST'},
      update: {method:'PUT'}
    });
  }
]);
