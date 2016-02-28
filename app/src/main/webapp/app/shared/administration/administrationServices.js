'use strict';

/* Services */

var factuLineServices = angular.module('myApp.administrationServices', ['ngResource']);

factuLineServices.factory('OperationHospitalRest', ['$resource', 'restHost', '$http',
    function ($resource, restHost) {
        return $resource(restHost + '/factuLineRest/administration/operationHospital/', {}, {
            query: {method: 'GET', isArray: true},
            post: {method: 'POST'},
            update: {method: 'PUT'}
        });
    }
]);
