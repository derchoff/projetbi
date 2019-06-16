// URL du tableau sur Tableau Online

const TABLEAU_URL="https://eu-west-1a.online.tableau.com/t/pbily2019/views/DARTIES/Accueil?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no&:origin=viz_share_link"

//const TABLEAU_URL="https://eu-west-1a.online.tableau.com/t/projetbilyon/views/DARTIES/Accueil?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no&:origin=viz_share_link";
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


function initDataviz(placeholderDiv, id_date) {
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

    //configure les filtres de départ    
    //créer l'objet vis de Tableau software
    return new Promise(function(resolve,reject) { 
        
        let ret = new tableau.Viz(placeholderDiv, 
                                TABLEAU_URL, 
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
    });                                                                                                  
}

async function initDarties() {
    //capture les évènement "onchage" des input dans le script HTML
    // cela afin de modifier les filtres dans les feuilles de Tableau Software    

    $('#effacerFiltres').on('click',  effacerfiltresClick);
    $('#validerFiltres').on('click',  validerfiltresClick);
    
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

    // le responsable de magasin ne peut pas changer
    // le niveau hierarchique
    if (start_profile == PROFILE_RESPONSABLE_MAGASIN) {
        $('#regions').hide();
    }

    current_filtre_region = $.urlParam("filtre_region");
    current_filtre_region_parente = $.urlParam("filtre_region_parente");    
    current_profile = $.urlParam("profile");    

    console.log("Region : " + start_filtre_region);
    console.log("Region parente : " + start_filtre_region_parente);
    console.log("profile : " + start_profile);

    //modifie le titre du tableau de bord
    setBoardTitleFromProfile();
    fillsRegions();

    //initialise les périodes
    // ajoute les périodes de janvier jusqu'au mois courant
    const today = new Date();

    //définit la date du jour 
    $("#datedujour").html(`Date du jour:${today.toLocaleString()}`);
    //récupère la dernière date de mise à jour        
    var dartiesAPI = `${location.protocol}//${location.host}/lastupdate`;        
    $.getJSON(dartiesAPI)
    .done(function( data ) {        
        console.log("dernier update" + data);
        const dateParts = data.lastupdate.split("-");
        $("#datemiseajour").html(`Date de mise à jour : ${dateParts[2].substr(0,2)}/${dateParts[1]}/${dateParts[0]}`);
    });    

    const yyyy = today.getFullYear();
    //mois courant. Janvier = 0 d'ou le +1
    const mm = today.getMonth() + 1;
    //génere un tableau d'entier de 1 à today.getMonth() + 1
    //afin de remplir la dropdown avec la liste des mois depuis Janvier
    const months = Array.from({ length: mm }, (v, i) => i);

    //génère les options avec value = yyyymm
    $("#periodes").html( months.reverse() /* reverse car nous voulons le mois de janvier en dernier dans la liste*/
                                .map((e,i)=>  { const idx = e+1;
                                                today.setMonth(e);        
                                                return `<option value='${yyyy*100+idx}' ${idx==mm?'selected':''} >${today.toLocaleString('fr-FR', { month: 'long' })} ${yyyy}</option>` ;
                                            }));

    //Sélectionne la période courante        
    const id_date = yyyy * 100 + mm;

    try {
        //document.getElementById('tableauViz') => 
        //      récupère le placeholder qui contiendra les feuilles de Tableau software                
        viz = await initDataviz(document.getElementById('tableauViz'), id_date);        

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

//genère la liste des régions commerciale dans le filtre
function fillsRegions() {
    debugger;
    //récupère la liste des régions en fonction du profile
    var dartiesAPI = `${location.protocol}//${location.host}/regionlist`;        
    $.getJSON(dartiesAPI,
        {
            parentRegion:current_filtre_region,
            isCity:current_profile==PROFILE_DIRECTEUR_REGIONAL
        })
    .done(function( data ) {     
        if (current_profile!=PROFILE_DIRECTEUR_REGIONAL){
            $("#regions").html( [`<option value="" selected>Régions commerciales</option>`,...data.regions.map((e,i)=> `<option value='${e.slug}'>${e.nom}</option>`)] );                            
        } else {
            $("#regions").html( [`<option value="" selected>Régions commerciales</option>`,...data.regions.map((e,i)=> `<option value='${e.id}'>${e.enseigne} ${e.ville}</option>`)] );                            
        }
        debugger;
    });     
}

// retourne la liste des feuilles de la vue active
function getWorksheets() {
    
    const activesheet = viz.getWorkbook().getActiveSheet();

    if ( activesheet.getSheetType() == 'worksheet')
        return [activesheet];
     else 
        return activesheet.getWorksheets();        
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
    applyAllFilters();
}

function applyAllFilters() {

    //applique tous les filtres
    viz.getWorkbook().changeParameterValueAsync(INDICATEUR_PARAMETER, $("#indicateurs").val());
    viz.getWorkbook().changeParameterValueAsync(PRODUIT_PARAMETER, $("#produits").val());
    viz.getWorkbook().changeParameterValueAsync(ENSEIGNE_PARAMETER, $("#enseignes").val());

    viz.getWorkbook().changeParameterValueAsync(CUMULE_PARAMETER,$("#switchCumul").prop('checked')?'Vrai':'Faux');

    //période = yyyyMM
    const periode = parseInt($("#periodes").val());
    const periode_precedente = (periode-2019)==1?201812:periode-1;
    //on ne retiens que le mois pour la vue du cumulé
    const numero_mois = periode - 201900;

    if ($("#switchCumul").prop('checked')) {
        periode += 1000000;
        periode_precedente += 1000000;
    }
    
    viz.getWorkbook().changeParameterValueAsync(PERIODE_PARAMETER,periode);
    viz.getWorkbook().changeParameterValueAsync(PERIODE_PRECEDENTE_PARAMETER,periode_precedente);
    viz.getWorkbook().changeParameterValueAsync(MOIS_PARAMETER,numero_mois);
}

// appellé lorsque l'utilisateur change de vue
// via les onglets de Tableau
function tabViewchange(e) {
    console.log("TAB_SWITCH");
    current_tab_view = e.getNewSheetName();
    
    //réappliquer les filtres de région actuels
    applyRegionFilters();
    applyAllFilters();
}


////////////////////////////////////////////
// Les fonctions suivantes sont les callback
// des évènement "onchange" des filtres
// que l'utilisateur peut modifier
////////////////////////////////////////////

function effacerfiltresClick(e) {
    resetFilters();
}

function validerfiltresClick() {
    applyAllFilters();
}

////////////////////////////////////////////
// Fonctions d'exportation Pdf, excel et impression
////////////////////////////////////////////

//callback appellé lorsque l'utilisateur demande l'impression du tableau de bord.
// L'impression directe d'un tableau de bord génère des grosses erreurs d'affichage : les éléments se chevauchent
// donc il faut importer le tableau de bord au format image et imprimer la page
// après avoir caché les autres éléments.
async function printDashBoard() {  
    
    //indicateur visuel pour indiquer qu'il faut patienter
    $('#print').addClass('spinner-border');

    //créé une image HTML avec la génération du tableau au format PNG
    // Applications de tous les filtres courant 
    
    // les filtres liées au profile sont initialisés dans la fonction initDataviz()
    let url_parameters = `${PROFILE_PARAMETER}=${current_profile}`;
    url_parameters += `&${FILTRE_REGION_PARAMETER}=${current_filtre_region}`;
    url_parameters += `&${FILTRE_REGION_PARENTE_PARAMETER}=${current_filtre_region_parente}`;

    //indicateur
    url_parameters += `&${INDICATEUR_PARAMETER}=${$('#indicateurs').val()}`;

    //produit
    url_parameters += `&${PRODUIT_PARAMETER}=${$('#produits').val()}`;

    //période sélectionnée
    const periode = parseInt($('#periodes').val());
    //on ne retiens que le mois pour la vue du cumulé
    const numero_mois = periode - 201900;    
    const periode_precedente = (periode-2019)==1?201812:periode-1;

    if ($("#switchCumul").prop('checked')) {
        periode += 1000000;
        periode_precedente += 1000000;
    }

    url_parameters += `&${PERIODE_PARAMETER}=${periode}`;
    url_parameters += `&${PERIODE_PRECEDENTE_PARAMETER}=${periode_precedente}`;
    url_parameters += `&${MOIS_PARAMETER}=${numero_mois}`;

    //cumulé ? 
    url_parameters += `&${CUMULE_PARAMETER}=${$("#switchCumul").prop('checked')?'Vrai':'Faux'}`;

    //Enseigne
    url_parameters += `&${ENSEIGNE_PARAMETER}=${$("#enseignes").val()}`;

    let url =  `${viz.getWorkbook().getActiveSheet().getUrl()}${TABLEAU_PRINT_URL}`;
    url += `&${url_parameters}`;

    var $img = $('<img src="'+ url +'" style="width:'+ TABLEAU_WIDTH +'; height:'+ TABLEAU_HEIGHT + ';"/>');

    $img.on('load', function() {
    //dès que l'image est chargée il faut cacher les autres éléments et imprimer la page
            // afin de n'imprimer que l'image
            $('#print').removeClass('spinner-border');
            $("#titreTableauDeBord").hide();
            $("#panelFiltres").hide();
            $("#tableauViz").hide();
            $(".container-fluid").hide();
    
            $img.appendTo(document.getElementsByTagName('body')[0]);
            window.print();
            
            //impression terminée on réaffiche tout 
            // après avoir supprimé l'image
            $img.remove();
            
            $("#titreTableauDeBord").show();
            $("#panelFiltres").show();
            $("#tableauViz").show();
            $(".container-fluid").show();                
        });      
}

//les fonctions suivantes sont utilisées pour exporter au format excel
// inspiré de https://github.com/alexlokhov/export-to-excel/blob/master/xlsx_exporter.html						
async function exportToExcel(){
    
    $('#excel-export').addClass('spinner-border');

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

        sheetNames.push({sheetid:sheetName, headers:false})
        //sheets[i].getSummaryDataAsync (options).then(function(t) {
        let t = await sheets[i].getSummaryDataAsync(options);
        let niceData = buildData(t);
        exportData.push(niceData);
    }
    
    $('#excel-export').removeClass('spinner-border');

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
    fillsRegions();
}

function applyRegionFilters() {    
    viz.getWorkbook().changeParameterValueAsync(FILTRE_REGION_PARAMETER, current_filtre_region);
    viz.getWorkbook().changeParameterValueAsync(FILTRE_REGION_PARENTE_PARAMETER, current_filtre_region_parente);
}

// retourne le profile enfant du profile passé en paramètre
function getSubProfile(profile) {    
    return subProfile[profile];
}

