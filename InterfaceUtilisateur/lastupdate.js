function lastupdate() {

  const GET_LAST_UPDATE = 'SELECT MAX(date_update) AS dt FROM data_update';
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

          //réclame l'utilisateur correspondant à l'username et le pwd
        connection.query(GET_LAST_UPDATE, [], function (error, results, fields) {
          
          //ferme la connection
          connection.end();

          if (error) {
            reject('error query: ' + error.stack);
          }

          if ( results == null || results.length == 0)  {
            reject('no update date');
          }         
          else {                      
            resolve(results[0]);
          }                        
        }); 

    });        
  }); // fin du Promise         
}

module.exports.lastupdate=lastupdate;
