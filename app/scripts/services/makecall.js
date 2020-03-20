'use strict';

/**
 * @ngdoc service
 * @name d2cApp.MakeCall
 * @description
 * # MakeCall
 * Factory in the d2cApp.
 */
angular.module('d2cApp')
  .factory('MakeCall', function () {
    // Service logic
    var call = {};


    call.appeler = function(from, to, interne)
    {
      call.hostname = from;
      call.to = to;
      call.url = 'http://toma.sat.cam/ToIPSocle/servlet/ClickToCall?HostName='+ call.hostname +'+&CalleePhoneNumber='+ call.to +'&NumeroInterne='+ interne +'&CTCEtendu=0';

      // Création de l'objet XHR
      var appel = new XMLHttpRequest();
      
      // Préparation de la requete en GET asynchrone
      appel.open( "GET", call.url, true );

      // Envoie de la requete
      appel.send( null );


      /********************
        A chaque changement d'état de la requete on vérifie le retour
        Si la requete se termine (ready state == 4) et le serveur renvoie un 200
        Alors on retourne true.
      ********************/
      
      appel.onreadystatechange = function(){
        if (appel.readyState == 4 && (appel.status == 200 || appel.status == 0)) {
            return appel.responseXML;
        }
      }
    };

    // Retour de service
    return call;
  });
