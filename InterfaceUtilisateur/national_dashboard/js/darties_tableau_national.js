// URL du tableau sur Tableau Online
const TABLEAU_URL="https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Acceuil?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link";
//const TABLEAU_PRINT_URL="https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Acceuil?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link&format=png";
const TABLEAU_PRINT_URL="?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link&format=png";
const TABLEAU_WIDTH="1300px";
const TABLEAU_HEIGHT="850px";
//valeur pou rles filtres lorsque l'on veut tput sélectionner 
// => aucun filtre
const TOUT = "tout";
// nom du filtre indicateur dans le tableau de bord
const INDICATEUR_FILTER = "Abbreviation";
// nom du filtre Type produit dans le tableau de bord
const PRODUIT_FILTER = "Type Produit";
// nom du filtre enseigne dans le tableau de bord
const CODE_POSTAL_FILTER = "Code Postal";
// Nom du filtre pour sélectionner la région a afficher
// dans le tableau de bord
const BL_REGION_FILTRE = "BL Filtre Region";
// Nom du filtre pour sélectionner la région parente
// dans le tableau de bord
const BL_FILTRE_REGION_PARENTE = "BL Filtre région parente";                                  
const BL_REGION_FILTRE_CARTE = "BL Filtre Region Carte";
// Nom du filtre pour sélectionner la région parente
// dans le tableau de bord
const BL_FILTRE_REGION_PARENTE_CARTE = "BL Filtre région parente Carte";

// Nom du filtre pour sélectionner la période
// dans le tableau de bord
const PERIODE_FILTER_NAME = "Id (Date)";                                  

// Nom du filtre pour afficher les résultats cumulé
// dans le tableau de bord
const CUMULE_FILTER_NAME = "cumulé";                                  


// Nom du filtre pour la période cumulée
// dans le tableau de bord
const PERIODE_CUMULE_FILTER_NAME = "BL Numéro Mois";

// Nom du filtre pour sélectionner le profile
// dans le tableau de bord
const PROFILE = "Profile";
// Nom du champ donnant la sous région sélectionnée dans le tableau de bord
const BL_SOUS_REGION = "BL Sous Region";
const UI_NOM_VILLE_AFFICHEE = "UI Nom Ville Affichée";
const UI_NOM_REGION_AFFICHEE = "UI Nom Région affichée";

const MSG_APPLY_FILTER_SUCCES = "Filtre appliqué : ";
const MSG_CLEAR_FILTER_SUCCES = "Filtre effacé : ";
const MSG_APPLY_FILTER_ERROR = "Erreur lors de l'application du filtre : ";

// nom des feuilles dans les tableau de bord
// auxquelles il faut appliquer les filtres
const MASTER_SHEET_NAMES_REGION =  ["Carte", "Détails par produit", "Cumulé", "Palmarès Détails", "Total par sous région"];
const MASTER_SHEET_NAMES_DATES =  ["Détails par produit", "Cumulé", "Palmarès Détails", "Total par sous région", "Détails par poids produit"];

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
const PROFILE_DIRECTEUR_COMMERCIAL = "Directeur commercial";
const PROFILE_DIRECTEUR_REGIONAL = "Directeur Régional";
const PROFILE_RESPONSABLE_MAGASIN = "Responsable magasin";
const subProfile = new Object();
subProfile[PROFILE_DIRECTEUR_COMMERCIAL]=PROFILE_DIRECTEUR_REGIONAL;
subProfile[PROFILE_DIRECTEUR_REGIONAL]=PROFILE_RESPONSABLE_MAGASIN;
subProfile[PROFILE_RESPONSABLE_MAGASIN]="Chef produit";


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
    $('#switchCumul').on('click',  cumulClick);
    $('#effacerFiltres').on('click',  effacerfiltresClick);
    
    $('#pdf-export').on('click', e => viz.showExportPDFDialog());
    $('#excel-export').on('click', e => exportToExcel());
    $('#print').on('click', e => printDashBoard());
    $('#email').on('click', e => viz.showShareDialog());

    //retour au premier écran
    $('#retour_accueille').on('click', backToStartScreen);

    $('#debbugButton').on('click', debugListeFiltre);

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
    // const url = "https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Acceuil?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link";
    //const url = "https://public.tableau.com/views/DARTIES/Carte"; //?:embed=y&:display_count=yes&publish=yes&:origin=viz_share_link#6";

    var options = {
        hideTabs: false,
        hideToolbar: true,
        width: TABLEAU_WIDTH,
        height: TABLEAU_HEIGHT,   

        //Cette fonction est appellé par l'API Javascript de Tableau 
        //lorsque le tableau de bord est prêt à l'utilisation.
        onFirstInteractive: function() {

            // The viz is now ready and can be safely used.
            workbook = viz.getWorkbook();
            activesheet = workbook.getActiveSheet();   

            //on intercept la capture de l'évènement changement d'onglet    
            viz.addEventListener(tableau.TableauEventName.TAB_SWITCH, tabViewchange);
            viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, function(marksEvent) { return marksEvent.getMarksAsync().then(reportSelectedMarks); } );            

            switchTosubRegion(start_profile, start_filtre_region_parente, start_filtre_region);

            //Sélectionne la péiode courante
            const today = new Date();
            const mm = today.getMonth() + 1;
            const yyyy = today.getFullYear();
            const id_date = yyyy * 100 + mm;

            $("#periodes").val(id_date);

            applyFilter(PERIODE_FILTER_NAME,`${id_date}`, MASTER_SHEET_NAMES_DATES).then(e=>console.log(MSG_APPLY_FILTER_SUCCES + e), 
                                                            err => console.log(MSG_APPLY_FILTER_ERROR + err));            


            //l'on peut réactiver les filtres
            $(".filter").prop('disabled', false);

        }
    };

    //Valorise les filtres de départ
    // options[`${PROFILE}`] = start_profile;
    // options[`${BL_REGION_FILTRE}`] = start_filtre_region;
    // options[`${BL_FILTRE_REGION_PARENTE}`] = start_filtre_region_parente;
    //options[`${PERIODE_FILTER_NAME}`] = '201903';

    //créer l'objet vis de Tableau software
    viz = new tableau.Viz(placeholderDiv, TABLEAU_URL, options);

}

// retourne la liste des feuilles de la vue active
function getWorksheets() {
    
    const activesheet = viz.getWorkbook().getActiveSheet();

    if ( activesheet.getSheetType() == 'worksheet')
        return [activesheet];
     else 
        return activesheet.getWorksheets();        
}

//applique un filtre à la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuille de l'objet pour appliquer le filtre
function applyFilter(filterName, values, masterSheet) {    

    const sheetArray = getWorksheets();        

    var lastCall = null;
    //retrouve la première feuille master dans la vue
    sheetArray.filter( el => masterSheet.findIndex(it => it==el.getName()) >=0 )
                     .forEach(el => lastCall = el.applyFilterAsync(filterName, values, tableau.FilterUpdateType.REPLACE));
    return lastCall;
}


//applique le filtre ALL à la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuille de l'objet pour appliquer le filtre
function applyFilterALL(filterName, masterSheet) {

    const sheetArray = getWorksheets();        

    var lastCall = null;
    //retrouve la première feuille master dans la vue
    sheetArray.filter( el => masterSheet.findIndex(it => it==el.getName()) >=0 )
                        .forEach(el => lastCall = el.applyFilterAsync(filterName, "", tableau.FilterUpdateType.ALL));
    return lastCall;
                        
}

//efface un filtre de la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuille de l'objet pour appliquer le filtre
function clearFilter(filterName, masterSheet) {

    const sheetArray = getWorksheets();    

    var lastCall = null;
    //retrouve la première feuille master dans la vue
    sheetArray.filter( el => masterSheet.findIndex(it => it==el.getName()) >=0 )
                        .forEach(el => lastCall = el.clearFilterAsync(filterName));
    return lastCall;

}

//efface une sélection de la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuille de l'objet pour appliquer le filtre
function clearSelectedMark() {
    const sheetArray = getWorksheets();    

    sheetArray.forEach( el => lastCall = el.clearSelectedMarksAsync());    

    return lastCall;        
}

// remet tous les filtres sur "Tous ..."
function resetFilters() {
    $(".select-filter").val(TOUT);

    const today = new Date();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const id_date = yyyy * 100 + mm;

    $("#periodes").val(id_date);
    $(".checkbox-filter").prop("checked", false);
    
    $(".select-filter").trigger("onchange");
    $(".checkbox-filter").trigger("onclick");
}

function applyAllFilters() {
    $('#taux').on('change',  tauxchange);
    $('#regions').on('change',  regionschange);
    $('#indicateurs').on('change',  indicateurschange);
    $('#produits').on('change',  produitschange);
    $('#enseignes').on('change',  enseigneschange);
    $('#periodes').on('change',  periodeschange);
    $('#switchCumul').on('click',  cumulClick);
    $('#effacerFiltres').on('click',  effacerfiltresClick);

    $(".select-filter").trigger("onchange");
    $(".checkbox-filter").trigger("onclick");
}

// appellé lorsque l'utilisateur change de vue
// via les onglets de Tableau
function tabViewchange(e) {
    console.log("TAB_SWITCH");
    //réappliquer les filtres de région actuels
    applyRegionFilters();
    applyAllFilters();
}


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
        applyFilterALL(INDICATEUR_FILTER, MASTER_SHEET_NAMES_REGION).then(e=>console.log(MSG_APPLY_FILTER_ERROR + e), 
                                            err => console.log(MSG_APPLY_FILTER_ERROR + err));
    } else {
        applyFilter(INDICATEUR_FILTER, e.target.value, MASTER_SHEET_NAMES_REGION).then(e=>console.log(MSG_APPLY_FILTER_SUCCES + e), 
                                                            err => console.log(MSG_APPLY_FILTER_ERROR + err));
    }
}

function produitschange(e) {    
    if (e.target.value==TOUT) {
        applyFilterALL(PRODUIT_FILTER, MASTER_SHEET_NAMES_REGION).then(e=>console.log(MSG_APPLY_FILTER_ERROR + e), 
                                            err => console.log(MSG_APPLY_FILTER_ERROR + err));
    } else {
        applyFilter(PRODUIT_FILTER, e.target.value, MASTER_SHEET_NAMES_REGION).then(e=>console.log(MSG_APPLY_FILTER_SUCCES + e), 
                                                        err => console.log(MSG_APPLY_FILTER_ERROR + err));
    }    
}

function enseigneschange(e) {
    if (e.target.value==TOUT) {
        applyFilterALL(CODE_POSTAL_FILTER, MASTER_SHEET_NAMES_REGION).then(e=>console.log(MSG_APPLY_FILTER_ERROR + e), 
                                            err => console.log(MSG_APPLY_FILTER_ERROR + err));
    } else {
        applyFilter(CODE_POSTAL_FILTER, e.target.value, MASTER_SHEET_NAMES_REGION).then(e=>console.log(MSG_APPLY_FILTER_SUCCES + e), 
                                                        err => console.log(MSG_APPLY_FILTER_ERROR + err));
    }
}

function periodeschange(e) {    
    
    const periode = parseInt(e.target.value);

    //on ne retiens que le mois pour la vue du cumulé
    const numero_mois = periode - 201900;
    
    //filtre le mois courant
    //ces dates ont leur id = yyyyMM
    // et 1yyyyMM pour les dates correspodnates aux cumulés
    applyFilter(PERIODE_FILTER_NAME, periode , MASTER_SHEET_NAMES_DATES).then(e=>console.log(MSG_APPLY_FILTER_SUCCES + e), 
                                                            err => console.log(MSG_APPLY_FILTER_ERROR + err) );

    applyFilter(PERIODE_CUMULE_FILTER_NAME, numero_mois, MASTER_SHEET_NAMES_DATES).then(e=>console.log(MSG_APPLY_FILTER_SUCCES + e), 
                                                            err => console.log(MSG_APPLY_FILTER_ERROR + err) );
                                                            
                                                            
}

function cumulClick(e) {    
    //Number($("#switchCumul").prop('checked'))
    //applique le filtre en convertissant le boolean en entier
    applyFilter(CUMULE_FILTER_NAME,$("#switchCumul").prop('checked')?1:0, MASTER_SHEET_NAMES_REGION).then(e=>console.log(MSG_APPLY_FILTER_SUCCES + e), 
                                                                                                            err => console.log(MSG_APPLY_FILTER_ERROR + err) );    
}

function effacerfiltresClick(e) {
    resetFilters();
}

////////////////////////////////////////////
// Fonctions d'exportation Pdf, excel et impression
////////////////////////////////////////////

//callback appellé lorsque l'utilisateur demande l'impression du tableau de bord.
// L'impression directe d'un tableau de bord génère des grosse erreur d'affichage : les éléments se chevauche
// donc il faut importer le tableau de bord au format image et imprimer la page
// après avoir caché les autres éléments.
function printDashBoard() {  
    
    //créé une image HTML avec la génération du tableau au format PNG
    // Applications de tous les filtres courant 
    debugger;
    let url =  `${viz.getWorkbook().getActiveSheet().getUrl()}${TABLEAU_PRINT_URL}`;

    //définit le profile courrant
    url += `profile=${encodeURIComponent(current_profile)}&filtre_region=${encodeURIComponent(current_filtre_region)}&filtre_region_parente=${encodeURIComponent(current_filtre_region_parente)}`;

    //indicateur
    if ($('#indicateurs').val()!=TOUT) {
        url += `&${encodeURIComponent(INDICATEUR_FILTER)}=${encodeURIComponent($('#indicateurs').val())}`;
    }

    //produit
    if ($('#produits').val()!=TOUT) {
        url += `&${encodeURIComponent(PRODUIT_FILTER)}=${encodeURIComponent($('#produits').val())}`;
    }    

    //période sélectionnée
    const periode = parseInt($('#periodes').val());
    //on ne retiens que le mois pour la vue du cumulé
    const numero_mois = periode - 201900;    
    url += `&${encodeURIComponent(PERIODE_FILTER_NAME)}=${periode}`;
    url += `&${encodeURIComponent(PERIODE_CUMULE_FILTER_NAME)}=${numero_mois}`;

    //cumulé ? 
    url += `&${encodeURIComponent(CUMULE_FILTER_NAME)}=${$("#switchCumul").prop('checked')?1:0}`;

    var $img = $('<img src="'+ url +'" style="width:'+ TABLEAU_WIDTH +'; height:'+ TABLEAU_HEIGHT + ';"/>');

    $img.on('load', function() {

        //dès que l'image est chargée il faut cacher les autres éléments et imprimer la page
        // afin de n'imprimer que l'image
        $("#titreTableauDeBord").hide();
        $("#panelFiltres").hide();
        $("#tableauViz").hide();
        $(".container-fluid").hide();
            
        $img.appendTo(document.getElementsByTagName('body')[0]);

        window.print();

        //impression terminée on réaffiche tout 
        // après avoir supprimer l'image
        $img.remove();

        $("#titreTableauDeBord").show();
        $("#panelFiltres").show();
        $("#tableauViz").show();
        $(".container-fluid").show();    
    });
}

//les fonctions suivantes sont utilisées pour exporter au format excel
// inspiré de https://github.com/alexlokhov/export-to-excel/blob/master/xlsx_exporter.html						
function exportToExcel(){
    let dashboardname = '';
    let exportData = [];
    let sheetNames = [];
    let doneSheets = 0;
    let sheets = [];
    
    workbook = viz.getWorkbook();
    
    dashboardname = workbook.getActiveSheet().getName()
    sheets = workbook.getActiveSheet().getWorksheets()
    
    options = {
        maxRows: 0, 
        ignoreSelection: true,
        ignoreAliases: false,
        includeAllColumns: false
    };
    
    for (let i = 0; i < sheets.length; i++) {
        sheetName = sheets[i].getName()
        sheetNames.push({sheetid:sheetName, header:true})
        //sheets[i].getSummaryDataAsync (options).then(function(t) {
        sheets[i].getUnderlyingDataAsync (options).then(function(t) {             
            let niceData = buildData(t);
            exportData.push(niceData);
            doneSheets++;
            if (doneSheets == sheets.length)
                writeToFile(dashboardname,sheetNames, exportData);
        });
    }
}
			
function buildData(table) {
    let columns = table.getColumns();
    let data = table.getData();
    
    function reduceToObjects(cols, data) {
        debugger;
        let fieldNameMap = $.map(cols, function(col) {
            return col.getFieldName()
        });
        let dataToReturn = $.map(data, function(d) {
            return d.reduce(function(memo, value, idx) {
                memo[fieldNameMap[idx]] = value.formattedValue; //value.value;
                return memo;
            }, {});
        });
        return dataToReturn;
    }
    
    let niceData = reduceToObjects(columns, data);
    return (niceData)
}
			
function writeToFile(dashboardname, sheetNames, exportData) {
    let sql = 'SELECT INTO XLSX("' + dashboardname + '.xlsx",?) FROM ?';
    let res = alasql(sql, [sheetNames, exportData]);
}

////////////////////////////////////////////
// Fonctions de navigation dans la hiérarchie
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
    debugger;
    clearSelectedMark();
    if ( (uiNomRegionAffichee != "" 
            || uiNomvilleAffichee != "")
            && blSousRegion != "") {
        // l'utilisateur a cliqué sur une région de la carte
        // donc il est dirigé vers la sous région
        // efface d'abord la région sélectionnée car Tableau 
        // la mémorise.        
        switchTosubRegion(getSubProfile(current_profile), current_filtre_region, blSousRegion);        
    }    
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
    workbook.changeParameterValueAsync(PROFILE,current_profile);
    applyRegionFilters();

    switch(current_profile) {
        case PROFILE_DIRECTEUR_COMMERCIAL: {
            $("#TitreTableauDeBord").html(`Tableau de bord national ${current_filtre_region}`)
            break;
        }
        case PROFILE_DIRECTEUR_REGIONAL: {
            $("#TitreTableauDeBord").html(`Tableau de bord régional ${current_filtre_region}`)
            break;
        }
        case PROFILE_RESPONSABLE_MAGASIN: {
            $("#TitreTableauDeBord").html(`Tableau de bord magasin ${current_filtre_region}`)
            break;
        }
    }
}

function applyRegionFilters() {

    applyFilter(BL_FILTRE_REGION_PARENTE_CARTE,current_filtre_region_parente, MASTER_SHEET_NAMES_REGION);        
    applyFilter(BL_REGION_FILTRE_CARTE,current_filtre_region, MASTER_SHEET_NAMES_REGION);        

    applyFilter(BL_FILTRE_REGION_PARENTE,current_filtre_region_parente, MASTER_SHEET_NAMES_REGION);        
    applyFilter(BL_REGION_FILTRE,current_filtre_region, MASTER_SHEET_NAMES_REGION);        
}

// retourne le profile enfant du profile passé en paramètre
function getSubProfile(profile) {    
    return subProfile[profile];
}


function debugListeFiltre() {
    const activesheet = viz.getWorkbook().getActiveSheet();

    var filtre = null;

    if ( activesheet.getSheetType() == 'worksheet') {
        console.log("c'est bien une feuille");
        filtre = activesheet.getFiltersAsync();
    } else {
        console.log("ce n'est pas une feuille");
        const sheetArray = activesheet.getWorksheets();
        
        var lastCall = null;
        for(var i=0; i < sheetArray.length; ++i) {
           if ( lastCall == null) {
            lastCall =  sheetArray[i].getFiltersAsync();
           }
           else 
           lastCall.then(function(x){ debugger; return sheetArray[i].getFiltersAsync();})
        }

        filter = lastCall;
    }

        filter.then(x=> { debugger; console.log("filter : " + x);});       
}