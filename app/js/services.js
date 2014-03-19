'use strict';

/* Services */

var factuLineServices = angular.module('myApp.services', ['ngResource']);

factuLineServices.factory('FactuLineRest', ['$resource',
  function($resource){
    return $resource('http://localhost:8080/factuLineRest/consult/:id', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
      post: {method:'POST'},
      delete: {method:'DELETE', params:{id: '@id'}}
    });
 }]);

factuLineServices.factory('ConsultsFactory', ['$resource', 
  function($resource) {
    return $resource('http://localhost:8080/factuLineRest/consult/getByDateConsult/:dateConsult', {} , {
      getByDateConsult: {method:'GET', params:{dateConsult: '@dateConsult'}, isArray:true}
    });
  }
]);
