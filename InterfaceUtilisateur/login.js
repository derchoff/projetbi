function login(username, pwd) {

  const GET_USER_QUERY = 'SELECT fullname, profile, pays, region, magasin FROM users WHERE username=? AND password=SHA2(?, 224)';
  const mysql      = require('mysql');
  const connection = mysql.createConnection({
    host     : 'localhost',
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
        connection.query(GET_USER_QUERY, [username, pwd], function (error, results, fields) {
          
          //ferme la connection
          connection.end();

          if (error) {
            reject('error query: ' + error.stack);
          }

          if ( results == null || results.length == 0)  {
            reject('no user');
          }         
          else {                      
            resolve(results[0]);
          }                        
        }); 

    });        
  }); // fin du Promise         
}

module.exports.login=login;
