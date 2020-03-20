'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:NotifyCtrl
 * @description
 * # NotifyCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('NotifyCtrl', function ($scope, $http, $mdDialog, $filter, $location, routes, ldt) {




  	// Init des valeurs de scope
    $scope.destinataire = [];
    $scope.destinataires = [];
    $scope.ldt = ldt;

    var absUrl = $location.absUrl();


    
    // Récupération de l'annuaire

    //$http.get('fakedata/tels.json').then(function(res){
    $http.get('http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getEmail.php').then(function(res){
    	$scope.liste = res.data;
    	$scope.listeAvaillable = true;
    }, function(err){
    	console.log('Erreur de récupération annuaire : ');
        console.log(err);
    });


    // Filtre on keyup
    $scope.filterDestinataire = function(e)
    {
    	var liste = $filter('filter')($scope.liste,$scope.filtre);
    	$scope.filtered = $filter('limitTo')(liste, 15, 0);
    	$scope.newListe = true;
    	
    };

    // Set du destinataire
    $scope.setDestinataire = function(d)
    {
    	$scope.destinataire.push(d);
    	console.log($scope.destinataire);
    	$scope.filtre = '';
    	$scope.newListe = false;
        $scope.listeAvaillable = false;

    };

    // Gestion de la notification
    $scope.notify = function(){

        for (var i = $scope.destinataire.length - 1; i >= 0; i--) {

        	var message = {
        		from : ldt.Mail,
        		to : $scope.destinataire[i],
        		client : ldt.lnclc,
        		type : 'Notification',
        		maquette : 'interne',
        		objet : ldt.objet,
        		content : ldt.infos_utiles,
        		agent : ldt.nom_agent,
        		url: absUrl,
        		tel : ''
        	};

        	$http.post(routes.postEmail, message)
        	.then(function(res){
                $scope.res = res;
        		$scope.message = 'Notification envoyée.';
            }, function(err){
                console.log('Erreur dans la notification :');
                console.log(err);
            });

            if (i == 0) {
                $mdDialog.hide();
            }
        }
    };

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  });
