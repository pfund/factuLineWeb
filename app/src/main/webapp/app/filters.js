'use strict';

/* Filters */

angular.module('myApp.filters', [])
    .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('toFixed', function ($filter) {
  return function (input, places) {
    if (!input || isNaN(input)) return input;
    return input.toFixed(places);
  };
});
