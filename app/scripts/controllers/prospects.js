'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:ProspectsCtrl
 * @description
 * # ProspectsCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('ProspectsCtrl', function ($scope, MakeCall) {
    $scope.makeCall = function(number)
    {
    	console.log(MakeCall.appeler());
    	//console.log(number);
    }
  });
