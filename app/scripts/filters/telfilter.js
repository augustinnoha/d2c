'use strict';

/**
 * @ngdoc filter
 * @name d2cApp.filter:TelFilter
 * @function
 * @description
 * # TelFilter
 * Filter in the d2cApp.
 */
angular.module('d2cApp')
  .filter('TelFilter', function () {
    return function (input) {
    	var filtered = input.split('.').join("");
      return filtered;
    };
  });
