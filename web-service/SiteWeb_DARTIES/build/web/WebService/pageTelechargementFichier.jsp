<%-- 
    Document   : gestionFichier
    Created on : 27 avr. 2019, 15:00:00
    Author     : APOIZAT
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>DARTIES</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta charset="UTF-8">
        <link rel="stylesheet" href="style.css"/>
    </head>
    <body>
        <img src="<%=request.getContextPath() + "/image/darties.JPG"%>" width="88" height="87" alt="darties"/>

        <center> 
            <h2>ESPACE - TRANSFERER UN FICHIER</h2> 
            <form action="./FileuploadServelet" method="post" enctype='multipart/form-data'> 
                <br/>
                <label for="file" class="label-file">Sélectionner un fichier</label>
                <input type="file" class="input-file" name="parcourirFichier" id="parcourirFichier"/>
                <br/></br>
                <input type="submit" value="Transférer" class="bouton" style="width: 10%"> 
            </form>
        </center>
    </body>
</html>
