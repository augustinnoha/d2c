'use strict';

/**
 * @ngdoc service
 * @name d2cApp.feedback
 * @description
 * # feedback
 * Service in the d2cApp.
 */
angular.module('d2cApp')
  .service('feedback', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

   // Parametres du service
   this.email = 'd2c@ca-charente-perigord.fr';
  });
