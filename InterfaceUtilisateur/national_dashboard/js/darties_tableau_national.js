//valeur pou rles filtres lorsque l'on veut tput sélectionner 
// => aucun filtre
const TOUT = "tout";
// nom du filtre indicateur dans le tableau de bord
const INDICATEUR_FILTER = "Abbreviation";
// nom du filtre Type produit dans le tableau de bord
const PRODUIT_FILTER = "Type Produit";
// Nom du filtre pour sélectionner la région a afficher
// dans le tableau de bord
const BL_REGION_FILTRE = "BL Filtre Region";
// Nom du filtre pour sélectionner la région parente
// dans le tableau de bord
const BL_FILTRE_REGION_PARENTE = "BL Filtre région parente";                                  
// Nom du filtre pour sélectionner le profile
// dans le tableau de bord
const PROFILE = "Profile";
// Nom du champ donnant la sous région sélectionnée dans le tableau de bord
const BL_SOUS_REGION = "BL Sous Region";
const UI_NOM_VILLE_AFFICHEE = "UI Nom Ville Affichée";
const UI_NOM_REGION_AFFICHEE = "UI Nom Région affichée";

var viz = null;
var workbook = null;
var activesheet = null; 

var start_filtre_region;
var start_filtre_region_parente;    
var start_profile;    

var current_filtre_region;
var current_filtre_region_parente;    
var current_profile;    

//dictionnaire des profiles enfants
const subProfile = new Object();
subProfile["Directeur commercial"]="Directeur Régional";
subProfile["Directeur Régional"]="Responsable magasin";
subProfile["Responsable magasin"]="Chef produit";


function initDarties() {
    //capture les évènement "onchage" des input dans le script HTML
    // cela afin de modifier les filtres dans les feuilles de Tableau Software

    resetFilters();

    $('#taux').on('change',  tauxchange);
    $('#regions').on('change',  regionschange);
    $('#indicateurs').on('change',  indicateurschange);
    $('#produits').on('change',  produitschange);
    $('#enseignes').on('change',  enseigneschange);
    $('#periodes').on('change',  periodeschange);
    
    //retour au premier écran
    $('#retour_accueille').on('click', backToStartScreen);

    //l'on désative les filtres le temps que le tableau de bord soit chargé
    $(".filter").prop('disabled', true);

    //$(".menu-item").on("click", switchView);

    //récupère le placeholder qui contiendra les feuilles de Tableau software
    var placeholderDiv = document.getElementById('tableauViz');

    //récupère les filtres région à appliquer
    start_filtre_region = $.urlParam("filtre_region");
    start_filtre_region_parente = $.urlParam("filtre_region_parente");    
    start_profile = $.urlParam("profile");
    
    current_filtre_region = $.urlParam("filtre_region");
    current_filtre_region_parente = $.urlParam("filtre_region_parente");    
    current_profile = $.urlParam("profile");    

    console.log("Region : " + start_filtre_region);
    console.log("Region parente : " + start_filtre_region_parente);
    console.log("profile : " + start_profile);

    // mémorise les profile de départ pour revenir à la hiérarchie initiale

    //URL où sont sauvegardé les tableau de bord
    const url = "https://eu-west-1a.online.tableau.com/t/dartiesap/views/DARTIES/Acceuil?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link";
    //const url = "https://public.tableau.com/views/DARTIES/Carte"; //?:embed=y&:display_count=yes&publish=yes&:origin=viz_share_link#6";

    var options = {
        hideTabs: false,
        hideToolbar: true,
        width: "1400px",
        height: "924px",   

        //Cette fonction est appellé par l'API Javascript de Tableau 
        //lorsque le tableau de bord est prêt à l'utilisation.
        onFirstInteractive: function() {

            // The viz is now ready and can be safely used.
            workbook = viz.getWorkbook();
            activesheet = workbook.getActiveSheet();   

            switchTosubRegion(start_profile, start_filtre_region_parente, start_filtre_region);

            //l'on peut réactiver les filtres
            $(".filter").prop('disabled', false);
        }
    };

    //Valorise les filtres de départ
    // options[PROFILE] = start_profile;
    // options[BL_REGION_FILTRE] = start_filtre_region;
    // options[BL_FILTRE_REGION_PARENTE] = start_filtre_region_parente;    

    //créer l'objet vis de Tableau software
    viz = new tableau.Viz(placeholderDiv, url, options);

    //on intercept la capture de l'évènement changement d'onglet    
    viz.addEventListener(tableau.TableauEventName.TAB_SWITCH, tabViewchange);
    viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, function(marksEvent) { return marksEvent.getMarksAsync().then(reportSelectedMarks); } );
}

//applique un filtre à la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuille de l'objet pour appliquer le filtre
function applyFilter(filterName, values) {
    const activesheet = viz.getWorkbook().getActiveSheet();

    if ( activesheet.getSheetType() == 'worksheet') {
        console.log("c'est bien une feuille");
        return activesheet.applyFilterAsync(filterName, values, tableau.FilterUpdateType.REPLACE);
    } else {
        console.log("ce n'est pas une feuille");
        const sheetArray = activesheet.getWorksheets();
        
        var lastCall = null;
        for(var i=0; i < sheetArray.length; ++i) {
           if ( lastCall == null) 
            lastCall =  sheetArray[i].applyFilterAsync(filterName, values, tableau.FilterUpdateType.REPLACE);
           else 
            lastCall.then(function(){ return sheetArray[i].applyFilterAsync(filterName, values, tableau.FilterUpdateType.REPLACE); });
        }

        return lastCall;        
    }
}

//efface un filtre de la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuille de l'objet pour appliquer le filtre
function clearFilter(filterName) {
    const activesheet = viz.getWorkbook().getActiveSheet();

    if ( activesheet.getSheetType() == 'worksheet') {
        console.log("c'est bien une feuille");
        return activesheet.clearFilterAsync(filterName);
    } else {
        console.log("ce n'est pas une feuille");
        const sheetArray = activesheet.getWorksheets();

        var lastCall = null;
        for(var i=0; i < sheetArray.length; ++i) {
           if ( lastCall == null) 
            lastCall =  sheetArray[i].clearFilterAsync(filterName);
           else 
            lastCall.then(function(){ return sheetArray[i].clearFilterAsync(filterName); });
        }

        return lastCall;        
    }
}

//efface une sélection de la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuille de l'objet pour appliquer le filtre
function clearSelectedMark() {
    const activesheet = viz.getWorkbook().getActiveSheet();

    if ( activesheet.getSheetType() == 'worksheet') {
        console.log("c'est bien une feuille");
        return activesheet.clearSelectedMarksAsync();
    } else {
        console.log("ce n'est pas une feuille");
        const sheetArray = activesheet.getWorksheets();

        var lastCall = null;
        for(var i=0; i < sheetArray.length; ++i) {
           if ( lastCall == null) 
            lastCall =  sheetArray[i].clearSelectedMarksAsync();
           else 
            lastCall.then(function(){ return sheetArray[i].clearSelectedMarksAsync(); });
        }

        return lastCall;
    }
}

// remet tous les filtres sur "Tous ..."
function resetFilters() {
    $(".filter").val(TOUT);
}

// appellé lorsque l'utilisateur change de vue
function tabViewchange(e) {
    console.log("TAB_SWITCH");
    resetFilters();
}

// evènement lorsque l'utilisateur clique sur un menu en haut à gauche
// function switchView(e) {
//     console.log($(e.target).html());
//     viz.getWorkbook().activateSheetAsync($(e.target).html());
// }

////////////////////////////////////////////
// Les fonctions suivantes sont les callback
// des évènement "onchange" des filtres
// que l'utilisateur peut modifier
////////////////////////////////////////////

function tauxchange(e) {

}

function regionschange(e) {

}

function indicateurschange(e) {     
    if (e.target.value==TOUT) {
        clearFilter(INDICATEUR_FILTER);
    } else {
        applyFilter(INDICATEUR_FILTER, e.target.value);
    }
}

function produitschange(e) {    
    if (e.target.value==TOUT) {
        clearFilter(PRODUIT_FILTER);
    } else {
        applyFilter(PRODUIT_FILTER, e.target.value);
    }    
}

function enseigneschange(e) {

}

function periodeschange(e) {

}

////////////////////////////////////////////
// Fonctions de navigations dans la hiérarchie
////////////////////////////////////////////

function backToStartScreen() {
    switchTosubRegion(start_profile, start_filtre_region_parente, start_filtre_region);  
}

//fonction utilitaire pour récupérer un paramètre depuis l'URL
$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return decodeURIComponent(results[1] || 0);
}
  
function reportSelectedMarks(marks) {
    // parcourt la liste des marques sélectionnées
    // Normalement une seule    

    var blSousRegion = "";
    var uiNomvilleAffichee = "";
    var uiNomRegionAffichee = "";
debugger;
    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        //récupère les champs associé à la marque
        var pairs = marks[markIndex].getPairs();

        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
            var pair = pairs[pairIndex];

            switch(pair.fieldName) {
                case BL_SOUS_REGION :
                {
                    blSousRegion = pair.value;
                    break;    
                }
                case UI_NOM_REGION_AFFICHEE :
                {
                    uiNomRegionAffichee = pair.value;
                    break;    
                }
                case UI_NOM_VILLE_AFFICHEE :
                {
                    uiNomvilleAffichee = pair.value;
                    break;    
                }                                
            }
        }
    }

    // on efface la sélection de l'utilisateur
    return clearSelectedMark().then( function() {
        if ( (uiNomRegionAffichee != "" ||uiNomRegionAffichee != "")
            && blSousRegion != "") {
            // l'utilisateur a cliqué sur une région de la carte
            // donc il est dirigé vers la sous région
            // efface d'abord la région sélectionnée car Tableau 
            // la mémorise.        
            return switchTosubRegion(getSubProfile(current_profile), current_filtre_region, blSousRegion);                    
        }
    });

}

//modifie les filtres pour naviguer vers la sous région
function switchTosubRegion(profile, region_parente, region) {

    console.log(`Changement de région. Destination : '${region}' avec le profile '${profile}' et région parente : '${region_parente}'`);

    //re définit les filtres courant
    current_filtre_region_parente = region_parente;
    current_filtre_region = region;                    
    current_profile = profile;

    // applique les filtres au Tableau de bord
    // pour naviguer dans les sous région
    return workbook.changeParameterValueAsync(PROFILE,current_profile)        
    .then(
        function() {
            return applyFilter(BL_FILTRE_REGION_PARENTE,current_filtre_region_parente);
        }
    ).then(
        function() {
            return applyFilter(BL_REGION_FILTRE,current_filtre_region);        
        }
    );        
}

// retourne le profile enfant du profile passé en paramètre
function getSubProfile(profile) {    
    return subProfile[profile];
}
