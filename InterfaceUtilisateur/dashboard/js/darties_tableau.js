// URL du tableau sur Tableau Online
const TABLEAU_URL="https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Accueil?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no&:origin=viz_share_link";
//                 https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Acceuil?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link;
//                 https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Accueil?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no&:origin=viz_share_link
//const TABLEAU_PRINT_URL="https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Acceuil?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link&format=png";
const TABLEAU_REQUEST_AS_IMAGE="format=png";
const TABLEAU_PRINT_URL="?:embed=yes&:display_count=no&:showVizHome=no&:origin=viz_share_link&format=png";
const TABLEAU_WIDTH="1300px";
const TABLEAU_HEIGHT="820px";

//Nom de l'onglet Palmarès
const TAB_NAME_PALMARES = "Palmarès";

// Nom du filtre pour sélectionner le profile
// dans le tableau de bord
const PROFILE_PARAMETER = "Profile";
//paramètre pour choisir la période
const PERIODE_PARAMETER ="Période";
//paramètre pour choisir la prériode de confrontation
const PERIODE_PRECEDENTE_PARAMETER ="Période précédente";
const MOIS_PARAMETER ="Mois";
const CUMULE_PARAMETER ="Cumulé";
// nom du filtre Type produit dans le tableau de bord
const PRODUIT_PARAMETER = "Produit";
// nom du filtre indicateur dans le tableau de bord
const INDICATEUR_PARAMETER = "Indicateur Filtre";
// nom du filtre enseigne dans le tableau de bord
const ENSEIGNE_PARAMETER = "Enseigne";
const FILTRE_REGION_PARAMETER = "Filtre région";
const FILTRE_REGION_PARENTE_PARAMETER = "Filtre région parente";

// Nom du champ donnant la sous région sélectionnée dans le tableau de bord
const BL_SOUS_REGION = "BL Sous Region";
const UI_NOM_VILLE_AFFICHEE = "UI Nom Ville Affichée";
const UI_NOM_REGION_AFFICHEE = "UI Nom Région affichée";

const MSG_APPLY_FILTER_SUCCES = "Filtre appliqué : ";
const MSG_CLEAR_FILTER_SUCCES = "Filtre effacé : ";
const MSG_APPLY_FILTER_ERROR = "Erreur lors de l'application du filtre : ";

// nom des feuilles dans les tableau de bord
// auxquelles il faut appliquer les filtres
const SHEET_TO_EXCLUDE_FROM_EXCEL_EXPORT = ["Carte", "Titre Carte", "Titre cumulé"];
var viz = null;

//nom de l'onglet courant
var current_tab_view = "Accueil";

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


function initDataviz(placeholderDiv, asImage, id_date, URLParameters) {
    var ret = null;    

    var options = {
        hideTabs: false,
        hideToolbar: true,
        width: TABLEAU_WIDTH,
        height: TABLEAU_HEIGHT,   

        "Filtre région":current_filtre_region,
        "Filtre région parente":current_filtre_region_parente,
        "Profile":current_profile,
        "Période":id_date,                
    };

    let URL = "";

    if ( asImage) {
        URL = TABLEAU_URL+"&"+TABLEAU_REQUEST_AS_IMAGE+"&"+URLParameters; 
    } else {
        URL = TABLEAU_URL; 
    }

    //configure les filtres de départ    
    //créer l'objet vis de Tableau software
    return new Promise(function(resolve,reject) { 
        
        let ret = new tableau.Viz(placeholderDiv, 
                                URL, 
                                {...options,                                                                 
                                    //Cette fonction est appellé par l'API Javascript de Tableau 
                                    //lorsque le tableau de bord est prêt à l'utilisation.
                                    // je la définie ici pour pouvoir appeler 
                                    // le "resolve" du Promise
                                    onFirstInteractive: function() {
                                        //je suis prêt!
                                        resolve(ret);
                                    }                                                                
                                });
        if (asImage) {
            //si réclamé comme une image, l'API n'exécute pas onFirstInteractive
            // donc je fais un truc asser moche parce l'event load 
            // des iframe ne répond pas très bien selon la navigateur.               
            function checkPlaceholderIsFilled(ph, resolve) {
                if ($(ph).find('iframe').length>0) {
                    
                    clearInterval(interval_id);

                    $(ph).find('iframe').on('load', function() {                                   
                        resolve(ret);
                    });
                }
            }

            var interval_id = setInterval(checkPlaceholderIsFilled, 20, placeholderDiv, resolve);
        }
    });  
                                                                                                
}

async function initDarties() {
    //capture les évènement "onchage" des input dans le script HTML
    // cela afin de modifier les filtres dans les feuilles de Tableau Software    

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

    $('#logout').on('click', function() { window.location.href = "/"; });

    //l'on désative les filtres le temps que le tableau de bord soit chargé
    $(".filter").prop('disabled', true);


    //récupère les filtres région à appliquer
    // mémorise les profiles de départ pour revenir à la hiérarchie initiale
    start_filtre_region = $.urlParam("filtre_region");
    start_filtre_region_parente = $.urlParam("filtre_region_parente");    
    start_profile = $.urlParam("profile");
    
    //désactive les filtres du directeur commercial si besoin
    if ( start_profile != PROFILE_DIRECTEUR_COMMERCIAL ) {
        $(".directeur-commercial").hide();
    }

    current_filtre_region = $.urlParam("filtre_region");
    current_filtre_region_parente = $.urlParam("filtre_region_parente");    
    current_profile = $.urlParam("profile");    

    console.log("Region : " + start_filtre_region);
    console.log("Region parente : " + start_filtre_region_parente);
    console.log("profile : " + start_profile);

    //modifie le titre du tableau de bord
    setBoardTitleFromProfile();

    //Sélectionne la période courante
    const today = new Date();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const id_date = yyyy * 100 + mm;

    try {
        //document.getElementById('tableauViz') => 
        //      récupère le placeholder qui contiendra les feuilles de Tableau software        
        viz = await initDataviz(document.getElementById('tableauViz'), false, id_date);
        debugger;
        //remise à zéro des filtres
        resetFilters();
            
        //on intercept la capture de l'évènement changement d'onglet    
        viz.addEventListener(tableau.TableauEventName.TAB_SWITCH, tabViewchange);
        viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, function(marksEvent) { return marksEvent.getMarksAsync().then(reportSelectedMarks); } );            

        //l'on peut réactiver les filtres
        // appeler lorsque le tableau de bord est prêt
        // sinon si l'utilisateur modifie un filtre pendant
        // l'initialisation c'est le bazard!
        $(".filter").prop('disabled', false);

    } catch(e) {
        console.error(e);
    }
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
// alors il faut parcourir toutes les feuilles de l'objet pour appliquer le filtre
async function applyFilter(filterName, values) {    

    const sheetArray = getWorksheets();        

    var lastCall = null;
    //retrouve la première feuille master dans la vue
    sheetArray.forEach(el => lastCall = el.applyFilterAsync(filterName, values, tableau.FilterUpdateType.REPLACE));
    return lastCall;
}


//efface une sélection de la vue active
// ATTENTION  : si la vue n'est pas une feuille (c'est un dashboard ou une histoire)
// alors il faut parcourir toutes les feuilles de l'objet pour appliquer le filtre
function clearSelectedMark() {
    const sheetArray = getWorksheets();    

    sheetArray.forEach( el => lastCall = el.clearSelectedMarksAsync());    

    return lastCall;        
}

// remet tous les filtres sur "Tous ..."
function resetFilters() {
    $(".select-filter").val("");

    const today = new Date();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const id_date = yyyy * 100 + mm;

    $(".checkbox-filter").prop("checked", false);
    $("#periodes").val(id_date);    

    //et on appliqueles filtres
    applyAllFilters()
}

function applyAllFilters() {
    //les triggers ne fonctionne pas très bien
    // parce la fonction est appellée dans un "event"
    $(".select-filter").change();
    //$(".checkbox-filter").trigger("onclick");
    cumulClick(null);
}

// appellé lorsque l'utilisateur change de vue
// via les onglets de Tableau
function tabViewchange(e) {
    console.log("TAB_SWITCH");
    current_tab_view = e.getNewSheetName();
    debugger;
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
    viz.getWorkbook().changeParameterValueAsync(INDICATEUR_PARAMETER,e.target.value);
}

function produitschange(e) {        
    viz.getWorkbook().changeParameterValueAsync(PRODUIT_PARAMETER,e.target.value);
}

function enseigneschange(e) {
    viz.getWorkbook().changeParameterValueAsync(ENSEIGNE_PARAMETER,e.target.value);
}

function periodeschange(e) {    
    
    //période = yyyyMM
    const periode = parseInt(e.target.value);
    const periode_precedente = (periode-2019)==1?201812:periode-1;
    //on ne retiens que le mois pour la vue du cumulé
    const numero_mois = periode - 201900;

    if ($("#switchCumul").prop('checked')) {
        periode += 1000000;
        periode_precedente += 1000000;
    }
    debugger;
    viz.getWorkbook().changeParameterValueAsync(PERIODE_PARAMETER,periode);
    viz.getWorkbook().changeParameterValueAsync(PERIODE_PRECEDENTE_PARAMETER,periode_precedente);
    viz.getWorkbook().changeParameterValueAsync(MOIS_PARAMETER,numero_mois);        
}

function cumulClick(e) {    
    viz.getWorkbook().changeParameterValueAsync(CUMULE_PARAMETER,$("#switchCumul").prop('checked')?'Vrai':'Faux');
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
async function printDashBoard() {  
    
    //créé une image HTML avec la génération du tableau au format PNG
    // Applications de tous les filtres courant 
    
    // les filtres liées au profile sont initialisés dans la fonction initDataviz()
    let url = `${BL_REGION_FILTRE_CARTE}=${encodeURIComponent(current_filtre_region)}&${BL_FILTRE_REGION_PARENTE_CARTE}=${encodeURIComponent(current_filtre_region_parente)}`;

    //indicateur
    if ($('#indicateurs').val()!="") {
        url += `&${encodeURIComponent(INDICATEUR_FILTER)}=${encodeURIComponent($('#indicateurs').val())}`;
    }

    //produit
    if ($('#produits').val()!="") {
        url += `&${encodeURIComponent(PRODUIT_FILTER)}=${encodeURIComponent($('#produits').val())}`;
    }    

    //période sélectionnée
    const periode = parseInt($('#periodes').val());
    //on ne retiens que le mois pour la vue du cumulé
    const numero_mois = periode - 201900;    
    url += `&${encodeURIComponent(PERIODE_CUMULE_FILTER_NAME)}=${numero_mois}`;

    //cumulé ? 
    url += `&${encodeURIComponent(CUMULE_FILTER_NAME)}=${$("#switchCumul").prop('checked')?1:0}`;

    debugger;
    const $fake_div = $('<div id="printdiv" style="width:'+ TABLEAU_WIDTH +'; height:'+ TABLEAU_HEIGHT + ';"></div>');

    //dès que l'image est chargée il faut cacher les autres éléments et imprimer la page
    // afin de n'imprimer que l'image
    $("#titreTableauDeBord").hide();
    $("#panelFiltres").hide();
    $("#tableauViz").hide();
    $(".container-fluid").hide();
        
    $fake_div.appendTo(document.getElementsByTagName('body')[0]);    

    //document.getElementById('tableauViz') => 
    //      récupère le placeholder qui contiendra les feuilles de Tableau software
    let img_viz = img_viz = await initDataviz($fake_div[0], true, periode, url);

    window.print();

    //libéaration de l'objet et nettoyage
    img_viz.dispose();

    //impression terminée on réaffiche tout 
    // après avoir supprimer l'image
    $fake_div.remove();

    $("#titreTableauDeBord").show();
    $("#panelFiltres").show();
    $("#tableauViz").show();
    $(".container-fluid").show();
}

//les fonctions suivantes sont utilisées pour exporter au format excel
// inspiré de https://github.com/alexlokhov/export-to-excel/blob/master/xlsx_exporter.html						
async function exportToExcel(){
    
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

        //la cartes ne sont pas à exporter ( elle exporte des latitudes!)
        if ( SHEET_TO_EXCLUDE_FROM_EXCEL_EXPORT.findIndex(it => it==sheetName) >=0) continue;

        sheetNames.push({sheetid:sheetName, header:false})
        //sheets[i].getSummaryDataAsync (options).then(function(t) {
        let t = await sheets[i].getSummaryDataAsync(options);
        let niceData = buildData(t);
        exportData.push(niceData);
    }

    writeToFile(dashboardname,sheetNames, exportData);
}
			
function buildData(table) {
    let columns = table.getColumns();
    let data = table.getData();
    
    function reduceToObjects(cols, data) {
        fieldNameMap = cols.map(col => col.getFieldName())
                            //.filter( col => !col.startsWith("BL") )
                            .map(col => {switch(col) {
                                            case 'Abbreviation' : return 'Indicateur';
                                            case 'Id (Date)' : return 'Date';
                                            default: return col;
                                        }});

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

//Reviens à la région de départ = celle juste après le login.
function backToStartScreen() {
    switchTosubRegion(start_profile, start_filtre_region_parente, start_filtre_region);  
}

//fonction utilitaire pour récupérer un paramètre depuis l'URL
$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return decodeURIComponent(results[1] || 0);
}
  
//appellée lorsque l'utilisateur clique une région 
// ou un nom de ville => permet de changer de région
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


function setBoardTitleFromProfile() {

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

//modifie les filtres pour naviguer vers la sous région
function switchTosubRegion(profile, region_parente, region) {

    console.log(`Changement de région. Destination : '${region}' avec le profile '${profile}' et région parente : '${region_parente}'`);

    //re définit les filtres courant
    current_filtre_region_parente = region_parente;
    current_filtre_region = region;                    
    current_profile = profile;

    // applique les filtres au Tableau de bord
    // pour naviguer dans les sous région
    viz.getWorkbook().changeParameterValueAsync(PROFILE_PARAMETER,current_profile);
    applyRegionFilters();
    setBoardTitleFromProfile();
}

function applyRegionFilters() {    
    viz.getWorkbook().changeParameterValueAsync(FILTRE_REGION_PARAMETER, current_filtre_region);
    viz.getWorkbook().changeParameterValueAsync(FILTRE_REGION_PARENTE_PARAMETER, current_filtre_region_parente);
}

// retourne le profile enfant du profile passé en paramètre
function getSubProfile(profile) {    
    return subProfile[profile];
}