<%-- 
    Document   : gestionWSFichier
    Created on : 27 avr. 2019, 17:40:33
    Author     : APOIZAT
--%>

<%@page import="java.nio.file.Paths"%>
<%@page import="java.nio.file.Path"%>
<%@page import="java.nio.file.Files"%>
<%@page import="java.io.*"%>
<%@page import="WebService.DARTIESTransfererFichier"%>
<%@page import="WebService.DARTIESTransfererFichier_Service"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Web Service DARTIES</title>
        <link rel="stylesheet" href="style.css"/>
    </head>
    <body>
        <img src="<%=request.getContextPath() + "/image/darties.JPG"%>" width="88" height="87" alt="darties"/>

        <center>
        <%
            try{
                String fichier = request.getParameter("parcourirFichier");
                File file = new File(fichier);
                String fileName = file.getName();

                InputStream in = new BufferedInputStream(new FileInputStream(fichier));
                
                byte[] buffer = new byte[4096];
                int n;
                while ((n=in.read(buffer, 0, buffer.length)) > 0) 
                {
                }
                
                in.close();
                DARTIESTransfererFichier_Service wsDarties = new DARTIESTransfererFichier_Service();
                DARTIESTransfererFichier ws = wsDarties.getDARTIESTransfererFichierPort();
                int retour = ws.transfererFichier(fileName, buffer);
                
                if (retour == 200) 
                {
                %>
                    <h2> Transfert Réussi </h2>
                <%
                }
                else 
                {
                %>
                    <h2> <label name="erreur">Impossible de transférer le fichier </label> </h2>
                <%
                }
            } catch(Exception ex)
            {
                String erreur = ex.getMessage();
             %>
             <h2> <label name="erreur">Impossible de transférer le fichier <%ex.getMessage();%> </label> </h2>
             <%
            }
        %>     
        <br/></br>
        <a href="pageTelechargementFichier.jsp">Transférer un autre fichier</a>
        </center>
    </body>
    
</html>
