'use strict';

/* Services */

var factuLineServices = angular.module('myApp.consultationServices', ['ngResource']);

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
