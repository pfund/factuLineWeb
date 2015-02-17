'use strict';

/* Services */

var factuLineServices = angular.module('myApp.assistanceServices', ['ngResource']);

factuLineServices.factory('AssistanceRest', ['$resource',
  function($resource){
    return $resource('/factuLineRest/assistance/:id', {}, {
      query: {method:'GET', isArray:true},
      post: {method:'POST'},
      update: {method:'PUT'},
      delete: {method:'DELETE', params:{id: '@id'}}
    });
  }
]);

factuLineServices.factory('AssistancesFactory', ['$resource', 
  function($resource) {
    return $resource('/factuLineRest/assistance/getAssistancesInMonth/:dateAssistance', {} , {
      getAssistancesInMonth: {method:'GET', params:{dateAssistance: '@dateAssistance'}, isArray:true}
    });
  }
]);

factuLineServices.factory('MonthAssistanceFactory', ['$resource',
  function($resource) {
    return $resource('/factuLineRest/monthAssistances', {}, {
      getMonthAssistances: {method: 'GET', isArray: true}
    });
  }
]);



