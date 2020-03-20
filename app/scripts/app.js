'use strict';

/**
 * @ngdoc overview
 * @name d2cApp
 * @description
 * # d2cApp
 *
 * Main module of the application.
 */
angular
  .module('d2cApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMessages',
    'chart.js',
    'ngMaterial',
    'angulartics',
    'angulartics.piwik'
  ])
  .value('routes', {
    /*'contexte' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getContexte.php',
    'searchBySiren' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientSiren.php?siren=',
    'searchByNom' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientNom.php',
    'oads' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getOad.php',
    'credits' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getCredit.php',
    'epargnes' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getEpargne.php',
    'assurances' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getAssurance.php',
    'prelevements' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getPrelevements.php',
    'baq' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getBaq.php',
    'fapes' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getFape.php',
    'compte' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientCompte.php',
    'rdvs' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getRdv.php',
    'd2c' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getD2C.php',
    'postD2c' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/postD2C.php',
    'canaux' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getCanal.php',
    'reclamations' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getReclamations.php?ncpt=',
    'getClientSiren' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientSiren.php?siren=',
    'getClientNom': 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientNom.php?nom=',
    'postEmail' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/postEmail.php',
    'getEmailList' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getEmail.php',
    'postContact' : 'http://cep10-iucrdevapa.ca-technologies.fr:81/CRPG/D2C/controleurs/postContacts.php'*/
    'contexte' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getContexte.php',
    'searchBySiren' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientSiren.php?siren=',
    'searchByNom' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientNom.php',
    'oads' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getOad.php',
    'credits' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getCredit.php',
    'epargnes' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getEpargne.php',
    'assurances' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getAssurance.php',
    'prelevements' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getPrelevements.php',
    'baq' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getBaq.php',
    'fapes' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getFape.php',
    'compte' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientCompte.php',
    'rdvs' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getRdv.php',
    'd2c' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getD2C.php',
    'postD2c' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/postD2C.php',
    'canaux' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getCanal.php',
    'reclamations' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getReclamations.php?ncpt=',
    'getClientSiren' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientSiren.php?siren=',
    'getClientNom': 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getClientNom.php?nom=',
    'postEmail' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/postEmail.php',
    'getEmailList' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getEmail.php',
    'postContact' : 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/postContacts.php'

  })
  .constant('_', window._)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        reloadOnSearch: false
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/synthese', {
        templateUrl: 'views/synthese.html',
        controller: 'SyntheseCtrl',
        controllerAs: 'synthese',
        reloadOnSearch: false
      })
      .when('/prospects', {
        templateUrl: 'views/prospects.html',
        controller: 'ProspectsCtrl',
        controllerAs: 'prospects'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
