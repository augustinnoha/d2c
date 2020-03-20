'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:SmsCtrl
 * @description
 * # SmsCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('SmsCtrl', function ($scope, $http, $mdDialog, routes, num, client, contexte) {
    $scope.num = num;
    $scope.smsContent = '';
    $scope.objet = '';
    $scope.disabled = false;
    $scope.sended = true;
    $scope.submitDisabled = false;
    $scope.secondActionText = 'Annuler';
    $scope.contexte = contexte;
    $scope.client = client;
    

    $scope.countLeft = function()
    {
      $scope.countdown = 132 - $scope.smsContent.length;
      if ($scope.countdown <= 0) {
        $scope.disabled = true;
      }
    };

    $scope.sendSMS = function()
    {
      $scope.sended = false;

      // Construction de la requete
      var sms = {
        from : $scope.contexte.email,
        tel : $scope.num,
        type : "sms",
        maquette : "sms",
        objet : $scope.objet,
        content : $scope.smsContent + ' NEPASREPONDRE'
      };

      console.log(sms);

      // Effectue la requete en post pour enregistrer le SMS dans la ligne de temps
      $http.post(routes.postEmail, sms)
      .then(function(res){
        console.log(res.data);
        $scope.sended = true;
        $scope.message = 'SMS envoyée.';


        var data = {
          "type" : "SMS",
          "IDPART" : $scope.client.idcli_calcule,
          "AGENT_EMETTEUR" : $scope.contexte.matricule,
          "CIBLE" : $scope.num+'@smsbis.com',
          "OBJET" : sms.objet,
          "CONTENU" : sms.content
        };

        $http.post(routes.postContact, data).then(function(res){
          console.log(res);
          console.log('Enregistrement sms effectué');
        }, function(err){
          console.log(err);
          console.log('Enregistrement sms non effectué');
        });


        $mdDialog.hide();
        angular.element('#smsForm').hide();
        angular.element('#smsConfirm').show();
      }, function(err){
        console.log('Erreur dans la notification :');
        console.log(err);
      });

      $scope.submitDisabled = true;
      $scope.secondActionText = 'Fermer';


      $mdDialog.hide(sms);
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
