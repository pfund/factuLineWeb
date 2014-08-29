'use strict';

/* Services */

var factuLineServices = angular.module('myApp.services', ['ngResource']);

factuLineServices.factory('ConsultRest', ['$resource',
  function($resource){
    return $resource('/factuLineRest/rest/consult/:id', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
      post: {method:'POST'},
      update: {method:'PUT', params:{id: '@id'}},
      delete: {method:'DELETE', params:{id: '@id'}}
    });
 }]);

factuLineServices.factory('ConsultsFactory', ['$resource', 
  function($resource) {
    return $resource('/factuLineRest/rest/consult/getByDateConsult/:dateConsult', {} , {
      getByDateConsult: {method:'GET', params:{dateConsult: '@dateConsult'}, isArray:true}
    });
  }
]);

factuLineServices.factory('MonthsFactory', ['$resource',
  function($resource) {
    return $resource('/factuLineRest/rest/months/', {}, {
      getMonths: {method:'GET', params:{}, isArray:true}
    });
  }
]);
