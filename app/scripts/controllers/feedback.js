'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:FeedbackCtrl
 * @description
 * # FeedbackCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('FeedbackCtrl', function ($scope, $http, $mdDialog, $location, routes, utilisateur) {
  	$scope.feedback = {};
  	$scope.formValid = false;
  	$scope.message = [];
  	var agent = utilisateur;
  	$scope.feedback.userMatricule = agent.matricule;

  	// Verifie l'integrité du formulaire
  	if ($scope.feedback.content === ' ')
  	{
  		$scope.formValid = false;
  		$scope.message.push("Veuillez nous indiquer votre message ou remarque.");
  	}

  	else if ($scope.feedback.typeRetour === ' ')
	{
  		$scope.formValid = false;
  		$scope.message.push("Veuillez nous indiquer un motif de retours.");
  	}

  	else{
  		$scope.formValid = true;
  	}
  	$scope.sendfeedback = function(){
  		// Définition de constantes
  		$scope.feedback.from = 'nepasrepondre@ca-charente-perigord.fr';
  		$scope.feedback.to = 'd2c@ca-charente-perigord.fr';
  		$scope.feedback.maquette = 'feedback';
  		$scope.feedback.objet = 'Réclamation D2C "'+ $scope.feedback.typeRetour;

  		$scope.feedback.contexte = $location.absUrl();

  		$http.post(routes.postEmail, $scope.feedback)
  		.then(function(res){
        $scope.res = res;
  		  $scope.sended = true;
  		  $scope.message = 'Notification envoyée.';
  		  $mdDialog.hide($scope.feedback);
  		}, function(err){
  		  console.log('Erreur dans l\'envoi de votre requettte :');
  		  console.log(err);
  		});
  	};

    $scope.cancel = function()
    {
    	$mdDialog.cancel();
    };

    $scope.hide = function(res)
    {
    	$mdDialog.hide(res);
    };
  });
