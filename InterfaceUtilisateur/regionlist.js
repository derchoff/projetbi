const mysql      = require('mysql');

function execQuery(query, data) {  
  //il faudrait utiliser un mecanisme centralisé 
  // pour la configuration de la bdd
  const connection = mysql.createConnection({
    host     : '35.180.255.232',
    user     : 'darties_app',
    password : 'darties_apppwd',
    database : 'darties_db'
  });
  
  
  return new Promise(function(resolve, reject) { 
    //connection à la BDD
    connection.connect(function(err) {
      if (err) {
        reject('error connecting: ' + err.stack);
      }
        console.log('connected as id ' + connection.threadId);                
        //exécution de la requête
        connection.query(query, data, function (error, results, fields) {
          
          //ferme la connection
          connection.end();

          if (error) {
            reject('error query: ' + error.stack);
          }

          if ( results == null || results.length == 0)  {
            reject('no data');
          }         
          else {                      
            resolve(results);
          }                        
        }); 

    });        
  }); // fin du Promise         
}

function regionlist(parentRegion, isCity) {

  const GET_REGIONS = "SELECT region.slug, region.nom FROM region INNER JOIN pays on pays.id=region.id_pays WHERE pays.nom=?";
  const GET_CITIES = "SELECT magasin.id, magasin.enseigne, magasin.ville FROM darties_db.magasin INNER JOIN region on region.id=magasin.id_region WHERE region.nom=?";

  return execQuery(isCity?GET_CITIES:GET_REGIONS, [parentRegion]);
}

function produitlist() {

  const GET_PRODUIT = "SELECT type_produit FROM produit";

  return execQuery(GET_PRODUIT, []);
}

function indicateurlist() {

  const GET_INDICATEUR = "SELECT abbreviation, nom FROM indicateur";

  return execQuery(GET_INDICATEUR, []);        
}

function enseignelist() {

  const GET_ENSEIGNE = "SELECT DISTINCT enseigne FROM magasin";

  return execQuery(GET_ENSEIGNE, []);        
}

module.exports.regionlist=regionlist;
module.exports.produitlist=produitlist;
module.exports.indicateurlist=indicateurlist;
module.exports.enseignelist=enseignelist;
