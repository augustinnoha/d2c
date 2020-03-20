'use strict';

/**
 * @ngdoc function
 * @name d2cApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the d2cApp
 */
angular.module('d2cApp')
  .controller('MainCtrl', function ($rootScope, $scope, $filter, $location, $http, $mdToast, $mdDialog,feedback,routes, $analytics) {
    

    // Détection du type de saisie.
    
    /* Si la saisie ne comporte que des chiffres au nombre de 11, passe sur la route synthèse avec en paramètre le n°compte
    *  Comportement détecté en keyup.
    *  Si détécte une lettre, alors découpe la saisie en 2 champs et pousse le getClientNom controller
    */

    $scope.checkInputType = function()
    {
        // Défini par défaut que la recherche n'est pas un compte
        $scope.isCompte = false;
        $scope.isClientNomPrenom = false;
        $scope.isSiren = false;

        // Si input == 11 chiffres, alors définit comme recherche compte
        if ( isFinite($scope.recherche) && $scope.recherche.length === 11 ) {
            $scope.isCompte = true;
        }

        // Si input comprend des lettres alors on cherche par nom / prénom
        // Test d'égalité entre la longueur tableeau match et saisie pour limiter les caratères
        // à A-Z a-z avec "-"

        var correspondance = $scope.recherche.match(/[A-Za-z ,.'-]/gi) || [];
        if (correspondance.length === $scope.recherche.length) {
            $scope.isClientNomPrenom = true;
        }

        // Si input de 9 chiffres seulement, alors infère que recherche type = SIREN
        if ( isFinite($scope.recherche) && $scope.recherche.length === 9 ) {
            $scope.isSiren = true;
            console.log('Siren :'+$scope.isSiren);
        }
    };
    
    $analytics.setCustomDimension(1, "F005453");
    $location.search('matricule', "F005453");

    // Détection du contexte
    $http.get(routes.contexte).then(function(res){
        var agent = {};
        agent.matricule = res.data.User;
        agent.PrenomNom = res.data.Nom_User;
        agent.poste = res.data.Workstation;
        agent.EDSSigle = res.data.Eds_Connecte;
        agent.EDSNom = res.data.Nom_Eds;
        agent.TypeEds = res.data.Type_Eds;

        $scope.agent = agent;
        $rootScope.agent = agent;

        // Emmet le matricule agent en variable personalisée pour PIWIK
        $analytics.setCustomDimension(1, agent.matricule);

        // Injecte le matricule en paramètre d'URL
        $location.search('matricule', agent.matricule);

        getRdv(agent.matricule);
        //getRdv('F002927');

        console.log('Contexte : ');
        console.log($scope.agent);

    }, function(err){

        $scope.errorMessage = err;
        console.log('Contexte : ');
        console.log($scope.errorMessage);

    });


    var getRdv = function(matricule){
        //$http.get('fakedata/rdv.json').then(function(res){
        $http.get(routes.rdvs + '?matricule=' + matricule).then(function(res){


            $scope.rdvs = [];
            var rdvs = res.data[0] || null;
            var path = 'http://cep10-iucrprdapa.ca-technologies.fr:81/CRCE/fichePreparationEntretien/ressources/fichiers/';
            
            for (var i = rdvs.length - 1; i >= 0; i--) {
                var date = rdvs[i].dateRdv.split(' ');
                var heure = rdvs[i].heureDebut.split('.');
                // Reconstitution du nom de la fape courante
                rdvs[i].fape = rdvs[i].idAgent+'_du_'+date[0]+'_a_'+heure[0]+'h'+heure[1]+'.pdf';
                // Reconstruction de l'url de la fape courante
                rdvs[i].fapeUrl = path +''+ rdvs[i].fape;
                // Réinjecte le rdv courant dans le tableau général
                $scope.rdvs.push(rdvs[i]);
            }   

            console.log('Get Rendez-vous :');
            console.log($scope.rdvs);

        },function(err){
            console.log('Erreur get RDVS :');
            console.log(err);
        });
    };

    /* Création du tableau d'outils */
    $rootScope.outils = [
    	{
    		'nom':'Simulateur CAC',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/simuCac'
    	},
    	{
    		'nom':'E-roue',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/eRoue'
    	},
    	{
    		'nom':'Connexion',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/connexion'
    	},
    	{
    		'nom':'Simulateur Cartes',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/simulCartes'
    	},
    	{
    		'nom':'Téo',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/teo'
    	},
    	{
    		'nom':'Simulateur CAC',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/simuCAC'
    	},
    	{
    		'nom':'Simulateur CAC',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/simuCAC'
    	},
    	{
    		'nom':'Simulateur CAC',
    		'url': 'https://www.web-pi.fr/cacp/d2c/images/simuCAC'
    	}
    ];

    $scope.recherche = '';
    $scope.typeRecherche = '';
    $scope.dnaissance ='';

    // Gestion des rdv
    $scope.showRDV = function(e)
    {
        e.preventDefault();
        var megamenu = angular.element('#megamenu_rdv');
        $analytics.setCustomDimension(2, "F005453");
        megamenu.toggleClass('closed');
    };

    // Gestion des redirections / routes
    $scope.searchNcpt = function(e)
    {
        if ($scope.isCompte) {
            e.preventDefault();
            // comptabilisation en tracking mode de recherche
            $analytics.eventTrack('Recherche', {category:'Recherche client', label:'Recherche par compte', value:'F005453'});
            $analytics.setCustomDimension(2, "F005453");
            $location.path('/synthese').search({ncpt : $scope.recherche});

        } else if ($scope.isSiren)
        {
            e.preventDefault();
            // comptabilisation en tracking mode de recherche
            $analytics.eventTrack('Recherche', {category:'Recherche client', label:'Recherche par SIREN'});
            $analytics.setCustomDimension(2, "F005453");
            var siren = $scope.recherche;
            $http.get(routes.getClientSiren + siren).then(function(res){
                var compte = res.data[0].COMPTE;
                console.log(compte);
                $location.path('/synthese').search({ncpt : compte});
            },function(err){
                console.log('Erreur lors de la récupération SIREN : ');
                console.log(err);
            });

        } else if($scope.isClientNomPrenom) // Si recherche par nom / prénom / danais
        {
            e.preventDefault();
            // comptabilisation en tracking mode de recherche
            $analytics.eventTrack('Recherche', {category:'Recherche client', label:'Recherche par Nom Prénom'});
            var nom,danais;
            nom = encodeURI($scope.recherche);
            danais = $scope.dnaissance;

            console.log('Nom: '+nom);
            console.log('Date Naissance :'+$scope.dnaissance);

            var client = $http.get(routes.getClientNom + nom + '&naissance=' + danais);
            console.log(client);
            client.then(function(res){
                $scope.clientsFound = true;
                $scope.clients = res.data;
            }, function(err){
                console.log(err);
                $scope.errorMessage = 'Aucun client ne semble correspondre';
            });
            console.log($scope.clients);
        }
        else
        {
            $analytics.eventTrack('Recherche', {category:'Recherche client', label:'Recherche non reconnue'});
            $scope.errorMessage = 'Le format de donnée saisie n\'existe pas';
        }
    };

    // gestion des feedbacks
    $scope.showFeedBack = function(e)
    {
        e.preventDefault();
        $mdDialog.show({
          controller : 'FeedbackCtrl',
          templateUrl: 'dialogs/feedback.tmpl.html',
          parent: angular.element('#synthese'),
          targetEvent: e,
          clickOutsideToClose:true,
          locals : {
            utilisateur : $scope.agent
          }
        })
        .then(function(res){
            $scope.res = res;
            console.log('Message envoyé.');
        });
    };
  });