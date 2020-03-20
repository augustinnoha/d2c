'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:DialogCtrl
 * @description
 * # DialogCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('DialogCtrl', function ($scope, $http, $location, $mdDialog, num, routes) {

  	// Récupère les questions et réponses
    // Gestion des OAD
    var params =  $location.search();
    $scope.ncpt = params.ncpt;

    $scope.index = 0;
    $scope.disabled = true;
    $scope.confirmLevel = 0;
    $scope.wait = false;
    $scope.operations = [
      {libel : 'Virement Interne', url : 'http://placehold.it/200x200/cecece/000000'},
      {libel : 'Commande Chéquier', url : 'http://placehold.it/200x200/cecece/000000'},
      {libel : 'Commande Carnet de remise de chèque', url : 'http://placehold.it/200x200/cecece/000000'},
      {libel : 'Modification plafonds CB', url : 'http://placehold.it/200x200/cecece/000000'},
      {libel : 'Modification Tel/Mail', url : 'http://placehold.it/200x200/cecece/000000'},
      {libel : 'Envoi Code Bam', url : 'http://placehold.it/200x200/cecece/000000'},
      {libel : 'Création/Modification Ordre de virement permanent (interne)', url : 'http://placehold.it/200x200/cecece/000000'},
      {libel : 'Souscription E-Relevé', url : 'http://placehold.it/200x200/cecece/000000'}
    ];

    //$http.get('fakedata/oad.json').then(function(res){
  	$http.get(routes.oads + '?ncpt=' + $scope.ncpt).then(function(res){

  		$scope.wait = true;
  		$scope.questions = res.data[0];

  	}, function(err){

  		console.log(err);

  	});
  	
  	// Gestion des réclamations
  	$http.get(routes.reclamations+$scope.ncpt).then(function(res){
  		$scope.wait = true;
  		$scope.reclamations = res.data[0];
  	}, function(err){
  		$scope.err = err;
  	});

  	// Gestion des confirmations de questions
  	$scope.addConfirm = function(ev)
  	{
      ev.preventDefault();
  		$scope.confirmLevel++;
  		if ($scope.confirmLevel >= 3) {
  			$scope.index = 3;
  			$scope.validate = true;
  		}

  	};


  	$scope.choixQuestions = function(libel)
  	{
      $scope.libel = libel;
  		$scope.index = 1;
  		$scope.disabled = false;
  	};

    // Gestion de la navigation dans la boite de dialogue
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
