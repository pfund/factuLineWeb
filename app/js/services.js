'use strict';

/* Services */

var factuLineServices = angular.module('myApp.services', ['ngResource']);

factuLineServices.factory('FactuLineRest', ['$resource',
  function($resource){
    return $resource('http://localhost:8080/factuLineRest/consult/:consultId', {}, {
      query: {method:'GET', params:{consultId:''}, isArray:true},
      post: {method:'POST'}
    });
 }]);

