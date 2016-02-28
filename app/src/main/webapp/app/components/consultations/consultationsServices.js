'use strict';

/* Services */

var factuLineServices = angular.module('myApp.consultationServices', ['ngResource']);

factuLineServices.factory('ConsultRest', ['$resource', 'restHost',
  function($resource, restHost){
    return $resource(restHost + '/factuLineRest/consult/:id', {}, {
      query: {method:'GET', params:{id:'@id'}, isArray:true},
      post: {method:'POST'},
      update: {method:'PUT'},
      delete: {method:'DELETE', params:{id: '@id'}}
    });
  }
]);

factuLineServices.factory('ConsultsFactory', ['$resource', 'restHost',
  function($resource, restHost) {
    return $resource(restHost + '/factuLineRest/consult/getByDateConsult/:dateConsult', {} , {
      getByDateConsult: {method:'GET', params:{dateConsult: '@dateConsult'}, isArray:true}
    });
  }
]);

factuLineServices.factory('MonthsFactory', ['$http', 'restHost',
  function($http, restHost) {
    return {
      getMonths: function() {
        return $http({
          method: 'GET',
          url: restHost + '/factuLineRest/months/'
        });
      }
    };
  }
]);
