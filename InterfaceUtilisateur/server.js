const PROFILE_DIRECTEUR_COMMERCIAL = "Directeur commercial";
const PROFILE_DIRECTEUR_REGIONAL = "Directeur Régional";
const PROFILE_RESPONSABLE_MAGASIN = "Responsable magasin";

var express = require('express');
var bodyParser = require("body-parser");
var login = require("./login");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('dashboard',{
   index: false
 }));
app.use(express.static('common', {
   index: 'login.html'
 }));

//gère le login
app.post('/login', async function(request,response) {   
      const username=request.body.username;
      const password=request.body.password;   
      try {
         const user = await login.login(username, password);
         var URL ="";

         switch(user.profile) {
            case PROFILE_DIRECTEUR_COMMERCIAL : 
            {
               URL = `/index.html?profile=${PROFILE_DIRECTEUR_COMMERCIAL}&filtre_region=${user.pays}&filtre_region_parente=Europe`;
               break;
            }
            case PROFILE_DIRECTEUR_REGIONAL : 
            {
               URL = `/index.html?profile=${PROFILE_DIRECTEUR_REGIONAL}&filtre_region=${user.region}&filtre_region_parente=${user.pays}`;
               break;
            }
            case PROFILE_RESPONSABLE_MAGASIN : 
            {
               URL = `/index.html?profile=${PROFILE_RESPONSABLE_MAGASIN}&filtre_region=${user.magasin}&filtre_region_parente=${user.region}`;
               break;
            }                        
         }
         response.redirect(URL);
         //response.sendFile( __dirname + '/national_dashboard/index.html');
      }
      catch(e) {
         //erreur lors du login
         console.log(e);
         response.sendFile( __dirname + '/common/logininvalide.html');
      }
   });

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("projet BI - DARTIES listening at http://%s:%s", host, port);
})