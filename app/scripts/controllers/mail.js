'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:MailCtrl
 * @description
 * # MailCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('MailCtrl', function ($scope, $mdDialog, $http, routes, email, client, contexte) {
    $scope.destinataire = email;
    $scope.objet = '';
    $scope.mailContent = '';
    $scope.disabled = false;
    $scope.sended = true;
    $scope.submitDisabled = false;
    $scope.secondActionText = 'Annuler';
    $scope.client = client;
    $scope.contexte = contexte;

    //console.log($scope);

    $scope.sendMail = function()
    {
     console.log('Sending Email...');
      $scope.sended = false;

      var email = {
        from : $scope.contexte.email,
        to : $scope.destinataire,
        type : "mail",
        maquette : "externe",
        objet : $scope.objet,
        content : $scope.mailContent,
        client : $scope.client.lnclc.trim(),
        numCompte : $scope.client.un_contrat,
        agent : $scope.contexte.PrenomNom
      };

      console.log('Objet Mail : ');
      console.log(email);

      $http.post(routes.postEmail, email)
      .then(function(res){
        $scope.res = res;
        $scope.sended = true;
        $scope.message = 'Notification envoyée.';

        // Pousse l'email pour enregistrement en BDD
        var data = {
          "type" : "MAIL",
          "IDPART" : client.idcli_calcule,
          "AGENT_EMETTEUR" : $scope.contexte.matricule,
          "CIBLE" : email.to,
          "OBJET" : email.objet,
          "CONTENU" : email.content
        };

        $http.post(routes.postContact, data).then(function(res){
          console.log('Enregistrement mail effectué');
          console.log(res);
        }, function(err){
          console.log(res);
          console.log('Enregistrement mail non effectué');
        });

        $mdDialog.hide(email);
      }, function(err){
        console.log('Erreur dans la notification :');
        console.log(err);
      });
    };


    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function() {
      $mdDialog.hide();
    };
  });
