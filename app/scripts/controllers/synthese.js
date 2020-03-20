'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:SyntheseCtrl
 * @description
 * # SyntheseCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('SyntheseCtrl', function ($rootScope, $scope, $filter,$location, $http, $mdDialog, $mdToast, MakeCall, feedback,routes, $analytics) {


    // Récupération contexte agent
    $http.get(routes.contexte).then(function(res){
        var agent = {};
        agent.matricule = res.data.User;
        agent.PrenomNom = res.data.Nom_User;
        agent.poste = res.data.Workstation;
        agent.EDSSigle = res.data.Eds_Connecte;
        agent.EDSNom = res.data.Nom_Eds;
        agent.TypeEds = res.data.Type_Eds;
        agent.email = res.data.Mail_User;
        console.log('Contexte :');
        $scope.agent = agent;

        // Injecte le matricule de l'agent connecté
        $location.search('matricule', agent.matricule);

    }, function(err){

        $scope.errorMessage = err;
        console.log('Contexte : ');
        console.log($scope.errorMessage);

    });

    /// TEST AGENT
    $scope.agent = $rootScope.agent;
    console.log('Contexte :');
    console.log($scope.agent);
    
    // Récupération du n° de compte
    var params =  $location.search();
    $scope.ncpt = params.ncpt;
    console.log($scope.ncpt);
    $scope.error = [];
    $scope.ncompte = $scope.ncpt;
    

    // Récupère toutes les données identitaires du compte et ses partenaires
    // Par défaut un index est créé à 0
    $scope.setCurrentPartenaire = function(i, e)
    {
      e.preventDefault();
      $scope.index = i;
      console.log($scope.partenaires[i].idpart_calcule);
      $scope.currentPartenaire = $scope.partenaires[i].idpart_calcule;
    };

    // Client
    //$http.get('fakedata/client.json').then(function(res){
    $http.get(routes.compte + '?ncpt=' + $scope.ncpt).then(function(res){
        
        console.log('Réponse serveur compte :');
        console.log(res.data);
        
        $scope.compte = res.data[0];
        console.log('Res get compte tableau n°0 :');
        console.log($scope.compte);

        $scope.partenaires =  $filter('orderBy')(res.data[1], '-age');
        //$scope.partenaires =  _.sortBy(res.data[1], {age:'age'});
        console.log('Res get compte tableau n°1 :');
        console.log($scope.partenaires);

        $scope.index = 0;
        $scope.currentPartenaire = $scope.partenaires[$scope.index].idpart_calcule;
        console.log('Partenaire Actif : ');
        console.log($scope.currentPartenaire);
        
        $scope.idCliCalcule = $scope.compte.idcli_calcule;

        // Intégration des canaux de comm
        $scope.canaux = {};
        $scope.canaux.libels = ['Agence', 'Tel', 'Mail', 'Autres'];
        $scope.canaux.chiffres = [
          $scope.compte.ff,
          $scope.compte.tel,
          $scope.compte.mail,
          $scope.compte.autres
        ];
        $scope.canaux.options = {
          cutoutPercentage : 80,
          legend : {
            display : true,
            position : 'left',
          }
        };
    }, function(err){
        console.log(err);
    });



    // Récupère mes 'prelevements'
    //$http.get('fakedata/prelevements.json').then(function(res){
    $http.get(routes.prelevements+ '?ncpt=' + $scope.ncpt).then(function(res){
      $scope.prelevements = res.data;
      console.log('Prelvms :');
      console.log($scope.prelevements);
    }, function(err){
      $scope.error.push(err);
    });

    // Récupère la 'BAQ'
    $scope.WaittingBaq = true;
    //$http.get('fakedata/baq.json').then(function(res){
    $http.get(routes.baq+ '?ncpt=' + $scope.ncpt).then(function(res){

      console.log(res);
      var baq = res.data;
      $scope.baq = res.data;

      // vérifie si existence de la clé CAC/
      var cac = false;
      if (res.data[4].CAC) {
        cac = true;
        $scope.cac = cac;
      }
      // Ici un call back pour filtrer la baq en fonction du partenaire actif.
      filterOnPartner($scope.baq);
      $scope.WaittingBaq = false;

      // Si erreur
    }, function(err){
      $scope.error.push(err);
    });

    $scope.$watch('currentPartenaire', function(nv, ov){
      filterOnPartner($scope.baq);
    });
    var filterOnPartner = function(ob)
    {
      // Vérifie si existence d'une autorisation de découvert sur 
      var OCs = $filter('filter')(ob, {DECOUVERT:"DECOUVERT", idpart_calcule: $scope.currentPartenaire});
      if (OCs.length > 0 )
      {
        $scope.OCs = OCs;
      } 
      else
      {
        $scope.OCs = false;
      }

      // vérifie si existe clé CARTE
      var cartes = $filter('filter')(ob, {CARTE:"CARTE" , idpart_calcule: $scope.currentPartenaire});
      $scope.cartes = cartes;
    };
  


    // Récupère l'épargne
    $http.get(routes.epargnes+ '?ncpt=' + $scope.ncpt).then(function(res){
      var epargne = res.data;
      $scope.epargne = {};
      $scope.epargne.ASSVIE = _.groupBy(epargne, {TYPE: 'ASSVIE'}).true    || [];
      $scope.epargne.DAV = _.groupBy(epargne, {TYPE: 'DAV'}).true          || [];
      $scope.epargne.LIVRET = _.groupBy(epargne, {TYPE: 'LIVRET'}).true    || [];
      $scope.epargne.TITRES = _.groupBy(epargne, {TYPE: 'TITRES'}).true    || [];
      $scope.epargne.ELO = _.groupBy(epargne, {TYPE: 'ELO'}).true          || [];
      $scope.epargne.PEP = _.groupBy(epargne, {TYPE: 'PEP'}).true          || [];

      // Some de chaque épargne
      $scope.epargne.ASSVIE.SUM = _.reduce($scope.epargne.ASSVIE, function(memo, el){
        memo += parseFloat(el.MSOLD1);
        return Math.floor(memo);
      }, 0);

      $scope.epargne.DAV.SUM = _.reduce($scope.epargne.DAV, function(memo, el){
        memo += parseFloat(el.MSOLD1);
        return Math.floor(memo);
      }, 0);

      $scope.epargne.LIVRET.SUM = _.reduce($scope.epargne.LIVRET, function(memo, el){
        memo += parseFloat(el.MSOLD1);
        return Math.floor(memo);
      }, 0);

      $scope.epargne.TITRES.SUM = _.reduce($scope.epargne.TITRES, function(memo, el){
        memo += parseFloat(el.MSOLD1);
        return Math.floor(memo);
      }, 0);

      $scope.epargne.ELO.SUM = _.reduce($scope.epargne.ELO, function(memo, el){
        memo += parseFloat(el.MSOLD1);
        return Math.floor(memo);
      }, 0);

      $scope.epargne.PEP.SUM = _.reduce($scope.epargne.PEP, function(memo, el){
        memo += parseFloat(el.MSOLD1);
        return Math.floor(memo);
      }, 0);

      // Injection des libelles
      $scope.epargne.libels = ['ASSVIE', 'DAV', 'LIVRET(S)', 'TITRES', 'ELO', 'PEP'];
      // Injection des chiffres
      $scope.epargne.chiffres = [
        $scope.epargne.ASSVIE.SUM,
        $scope.epargne.DAV.SUM,
        $scope.epargne.LIVRET.SUM,
        $scope.epargne.TITRES.SUM,
        $scope.epargne.ELO.SUM,
        $scope.epargne.PEP.SUM,
      ];

      $scope.epargne.colors = [
        '#FFE957',
        '#004757',
        '#017C86)',
        '#00A3A3',
        '#82D6CA',
        '#9BFFD7',
      ];

      $scope.epargne.options = {
        cutoutPercentage : 80,
        legend : {
          display : true,
          position : 'right'
        }
      };

      $scope.sommeEpargne = _.reduce($scope.epargne.chiffres, function(memo, el){
        return memo += el;
      },0);

      $scope.epargne.graphReady = true;
    }, function(err){
      $scope.error.push(err);
    });

    // Récupère les crédits
    //$http.get('fakedata/credits.json').then(function(res){
    $http.get(routes.credits+ '?ncpt=' + $scope.ncpt).then(function(res){
      $scope.credits = res.data;
      $scope.sumCredit = 0;
      for (var i = res.data.length - 1; i >= 0; i--) {
        $scope.sumCredit += res.data[i].CRD;
      }
    }, function(err){
      $scope.error.push(err);
    });



    /********************
    * Récupération de la ligne de temps *
    ********************/
    
    //$http.get('fakedata/d2c.json').then(function(res){
    $http.get(routes.d2c+ '?ncpt=' + $scope.ncpt).then(function(res){
      // Récupère en clé 0 les données type RAC
      var racs = res.data[0];

      // Récupère en clé 1 les données type lignes de temps si elles existent
      // Sinon, retourne un tablea vide.
      var dcc = res.data[1] || [];
      //console.log(dcc);
      
      // Concatène les deux types de données pour les renvoyer au scope
      var allDCC = [];
      allDCC = allDCC.concat(racs).concat(dcc);
      $scope.lignesDT = allDCC;

    }, function(err){
      $scope.error.push(err);
    });


    // Récupère les assurances
    $http.get(routes.assurances+ '?ncpt=' + $scope.ncpt).then(function(res){
      $scope.assurances = res.data;
      $scope.totalAssurance = res.data.length;
    }, function(err){
      $scope.error.push(err);
    });


  	// Scripts divers
  	// Fonctions de contacts (appel, SMS, email)
  	$scope.call = function(number, ev)
  	{

      // Enregistre en base l'appel sortant
      var data = {
        "type" : "TEL",
        "IDPART" : $scope.compte.idcli_calcule,
        "AGENT_EMETTEUR" : $scope.agent.matricule,
        "CIBLE" : number
      };

      $http.post(routes.postContact, data).then(function(res){
        console.log(res);
        console.log('Enregistrement tel effectué');
      }, function(err){
        console.log(err);
        console.log('Enregistrement tel non effectué');
      });

      // Empèche l'evennement classique
      ev.preventDefault();
      var posteagent = $scope.agent.poste;

  		// Affiche la notification correspondante
  		$mdToast.show(
  			$mdToast.simple()
  				.parent(angular.element('#application'))
  				.position('top right')
  					.hideDelay(false)
  						.textContent('Appel sortant : '+number)
  							.highlightAction(true)
  							.highlightClass('md-accent')
  								.action('Nouveau contact'))
  		
  		.then(function(res){

  			if (res === 'ok') {
  				$scope.enregistrement.typ = "2";
  				$scope.enregistrement.initiateur = 'agent';
  				angular.element('#nouvelleSaisie').collapse('show');
  			}

  		});

      // Lance l'appel avec le service MakeCall
      
      console.log('Poste agent : '+ $scope.agent.poste);
      var appel = MakeCall.appeler(posteagent, number, 0);


  	};

    $scope.callInterne = function(number, ev)
    {
      // Affiche la notification correspondante
      ev.preventDefault();

      // Enregistre appel sortant
      var data = {
        "type" : "TEL",
        "IDPART" : $scope.currentPartenaire,
        "AGENT_EMMETEUR" : $scope.agent.poste,
        "CIBLE" : number,
        "OBJET" : '',
        "CONTENU" : ''
      };

      $http.post(routes.postContact, data).then(function(res){
        console.log(res);
        console.log('Enregistrement tel effectué');
      }, function(err){
        console.log(err);
        console.log('Enregistrement tel non effectué');
      });

      $mdToast.show(
        $mdToast.simple()
          .parent(angular.element('#application'))
          .position('top right')
          //.class('notification')
            .hideDelay(false)
              .textContent('Appel sortant : '+number));
                //.highlightAction(true)
                //.highlightClass('md-accent')
                  //.action('Nouveau contact'));
      
      var appel = MakeCall.appeler($scope.agent.poste, number, 1);
      console.log(appel);
    };

  	// Fonctions sms
  	$scope.sms = function(number, ev)
  	{
      ev.preventDefault();
      $mdDialog.show({
        controller : 'SmsCtrl',
        templateUrl: 'dialogs/smsSending.tmpl.html',
        parent: angular.element('#synthese'),
        targetEvent: ev,
        clickOutsideToClose:true,
        locals : {
          num : number,
          client : $scope.compte,
          contexte : $scope.agent
        }
      })
      .then(function(res){
        $scope.enregistrement.objet = res.objet;
        $scope.enregistrement.info_utile = res.content;
        $scope.enregistrement.typ = '4';
        $scope.enregistrement.initiateur = 'agent';
        angular.element('#initagent').toggleClass('active');
        angular.element('#nouvelleSaisie').collapse('show');
      });
  	};

    // Fonctions Mail
    $scope.mail = function(email, ev)
    {
      ev.preventDefault();
      $mdDialog.show({
        controller : 'MailCtrl',
        templateUrl: 'dialogs/mailSending.tmpl.html',
        parent: angular.element('#synthese'),
        targetEvent: ev,
        clickOutsideToClose:true,
        locals : {
          email : email,
          client : $scope.compte,
          contexte : $scope.agent
        }
      })
      .then(function(res){
        console.log(res);
        $scope.enregistrement.objet = '';
        $scope.enregistrement.objet = res.objet;
        $scope.enregistrement.info_utile = res.content;
        $scope.enregistrement.typ = '3';
        $scope.enregistrement.initiateur = 'agent';
        angular.element('#initagent').toggleClass('active');
        angular.element('#nouvelleSaisie').collapse('show');
      });
    };

    // Fonctions Notification
    $scope.notify = function(ev)
    {
      console.log(ev);
      //ev.preventDefault();
      $mdDialog.show({
        controller : 'NotifyCtrl',
        templateUrl: 'dialogs/notification.tmpl.html',
        parent: angular.element('#synthese'),
        targetEvent: ev,
        clickOutsideToClose:true,
        locals : {
          ldt : ev,
        }
      })
      .then(function(res){
        console.log(res);
        $scope.enregistrement.objet = res.objet;
        $scope.enregistrement.info_utile = res.content;
        $scope.enregistrement.typ = 'Mail';
        $scope.enregistrement.initiateur = 'agent';
        angular.element('#initagent').toggleClass('active');
        angular.element('#nouvelleSaisie').collapse('show');
      });
    };
      


	// Gestion des canaux
	$scope.canaux = {};
	$scope.canaux.libels = ['Face à Face', 'Tél', 'Mail', 'Autres'];
	$scope.canaux.chiffres = [4, 0, 10, 2];
	$scope.canaux.options = {
		cutoutPercentage : 80,
		legend : {
			display : true,
			position : 'left',
		}
	};



  /********************
  * Enregistrement en ligne de temps *
  * Création d'un nouveau D2C *
  ********************/

	$scope.enregistrement = {};
  $scope.enregistrement.initiateur = 'agent';
  $scope.enregistrement.saving = false;

  $scope.scrollToTop = function()
  {
    var ldtBody = angular.element('#ldt');
    ldtBody.scrollTop(0);
  };



  
  $scope.saveEntry = function($event)
  {
    // Progression du save à true
    $scope.saveInProgress = true;

    // Mise en disable le click sur bouton "enregistrer"
    angular.element($event.currentTarget).addClass('disabled');

    // Création d'une date au format Timestam UNIX en secondes
    $scope.enregistrement.date_dcc = Math.floor( Date.now()/1000 );

    // Création du lntcn (objet sous titre D2C)
    $scope.enregistrement.lntcn = $scope.enregistrement.typ + ' - INITIE - ' + $scope.enregistrement.initiateur.toUpperCase();

    // Création de l'agent Emmeteur
    $scope.enregistrement.agent = $scope.agent.matricule.substring(2);

    // Création du nom Agent
    $scope.enregistrement.nom_agent = $scope.agent.PrenomNom;

    // Création de l'EDS Utilisateur
    $scope.enregistrement.eds_agent = $scope.agent.EDSNom;

    // Création du type eds
    $scope.enregistrement.Type_Eds = $scope.agent.TypeEds;

    // Création num eds
    $scope.enregistrement.num_eds = $scope.agent.EDSSigle;

    // Récupération de l'ID Calculé client
    $scope.enregistrement.idcli_calcule = $scope.idCliCalcule;

    $scope.enregistrement.saving = true;
    
    console.log('Objet à enregistrer :');
    console.log($scope.enregistrement);


    /********************
    * L'objet à enregistrer est prêt *
    ********************/
    

    // On réalise le post de la data
    $http({
      method : 'POST',
      url : routes.postD2c,
      data : $scope.enregistrement,
      headers: {
        'Content-Type': 'application/json'
      }

    }).then(function(res){

      $scope.saveInProgress = false;
      $scope.enregistrement.saving = false;

      // Emmet un event pour piwik
      $analytics.eventTrack($scope.agent.matricule , {  category: 'D2C', label: 'Nouvelle Ligne' });
      
      console.log('Retour du controller POST D2C OK : ');
      console.log(res.data);

      $scope.enregistrementOk = true;

      var lastInsertion = res.data[0];
      lastInsertion.Initiales = lastInsertion.nom_agent.match(/\b\w/g).join('').toUpperCase();
      lastInsertion.Telephone = $scope.agent.poste;
      lastInsertion.Mail = $scope.agent.email;
      lastInsertion.date_ligne = Math.floor(Date.now()/1000);
      lastInsertion.type_eds = $scope.agent.TypeEds;
      $scope.lignesDT.push(lastInsertion);

      // Ferme la fenetre de saisie
      angular.element('#nouvelleSaisie').collapse('hide');
      angular.element($event.currentTarget).removeClass('disabled');

    }, function(err){
      // Si pas de retour de réponse
      console.log('Retour du controller POST D2C NOK : ');
      console.log(err);
    });

    console.log($scope.enregistrement);
  };

  // Récupère le nombre de réclamations
  // Gestion des réclamations
  $http.get('http://cep10-iucrprdapa.ca-technologies.fr:81/CRPG/D2C/controleurs/getReclamations.php?ncpt='+$scope.ncpt).then(function(res){
    $scope.wait = true;
    $scope.nbReclamations = res.data[0].length;
  }, function(err){
    $scope.err = err;
  });

  
  // Gestion des enregistrements

  /**********************************************************************************/
  /*
    Création d'un objet de base puis renseignement via le ng-model dans la vue.
    Vérification de l'existence des champs requis pour activer le bouton enregistrer
    si champs manquant affiche les indications à suivre.
  */


	$scope.resetForm = function()
	{
		$scope.enregistrement = {};
		$scope.enregistrement.error = true;
		$scope.enregistrement.canal = null;
		$scope.enregistrement.objet = '';
		$scope.enregistrement.infosPratiques = '';
		$scope.enregistrement.conseilsDonnes = '';
		$scope.enregistrement.donneesConfidentielles = '';
		$scope.enregistrement.initiateur='';
	};

	// Ajoute le sens de la relation agent -> client ou Client -> agent
	$scope.setSoliciteur = function(i)
	{
		$scope.enregistrement.initiateur = i;
	};

	// Cas des champs requis



	/**********************************************************************************/

	// Fonction qui affiche le panel de saisie d'un nouveau contact client
    //$http.get('fakedata/canaux.json').then(function(res){
    $http.get(routes.canaux).then(function(res){
     $scope.canauxCom = res.data[0];
     console.log('Canaux disponibles :'); 
     console.log($scope.canauxCom); 
    }, function(err){
      console.log('Erreur : impossible de récupérer les canaux'+err);
    });

	// Gestion des différentes modales

	$scope.showValidationDialog = function(ev) {
		$mdDialog.show({
		  controller : 'DialogCtrl',
		  templateUrl: 'dialogs/operation_distance.tmpl.html',
		  parent: angular.element('#synthese'),
		  targetEvent: ev,
		  clickOutsideToClose:true,
      num : 'XXXXXXX'
    });
  };

    $scope.showReclamationDialog = function(ev) {
    $mdDialog.show({
      controller : 'DialogCtrl',
      templateUrl: 'dialogs/reclamations.tmpl.html',
      parent: angular.element('#synthese'),
      targetEvent: ev,
      clickOutsideToClose:true,
      num : 'XXXXXXX'
		});
	  };
  });



	/**********************************************************************************/