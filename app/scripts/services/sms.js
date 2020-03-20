'use strict';

/**
 * @ngdoc service
 * @name d2cApp.Sms
 * @description
 * # Sms
 * Factory in the d2cApp.
 */
angular.module('d2cApp')
  .factory('Sms', function ($http) {
    // Service logic
    var users = {};

    users.getUsers = function()
    {
      return $http.get('https://reqres.in/api/users?page=2');
    };

    return users;
  });
