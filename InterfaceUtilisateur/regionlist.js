function regionlist(parentRegion, isCity) {

  const GET_REGIONS = "SELECT region.slug, region.nom FROM region INNER JOIN pays on pays.id=region.id_pays WHERE pays.nom=?";
  const GET_CITIES = "SELECT magasin.id, magasin.enseigne, magasin.ville FROM darties_db.magasin INNER JOIN region on region.id=magasin.id_region WHERE region.nom=?";
  const mysql      = require('mysql');
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
        let QUERY = isCity?GET_CITIES:GET_REGIONS;        
                
          //réclame l'utilisateur correspondant à l'username et le pwd
        connection.query(QUERY, [parentRegion], function (error, results, fields) {
          
          //ferme la connection
          connection.end();

          if (error) {
            reject('error query: ' + error.stack);
          }

          if ( results == null || results.length == 0)  {
            reject('no regions');
          }         
          else {                      
            resolve(results);
          }                        
        }); 

    });        
  }); // fin du Promise         
}

module.exports.regionlist=regionlist;
