<%-- 
    Document   : response
    Created on : 27 avr. 2019, 17:40:33
    Author     : APOIZAT
--%>

<%@page import="org.apache.tomcat.util.http.fileupload.FileItem"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload"%>
<%@page import="org.apache.tomcat.util.http.fileupload.disk.DiskFileItemFactory"%>
<%@page import="org.apache.tomcat.util.http.fileupload.RequestContext"%>
<%@page import="javax.jws.WebService"%>
<%@page import="java.nio.file.Paths"%>
<%@page import="java.nio.file.Path"%>
<%@page import="java.nio.file.Files"%>
<%@page import="java.io.*"%>
<%@page import="DARTIES_WS.DARTIESWS"%>
<%@page import="DARTIES_WS.DARTIESWS_Service"%>
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
            <h2> <label name="erreur"><%= request.getParameter("message") %></label> </h2>
            
        <br/></br>
        <a href="pageTelechargementFichier.jsp">Transférer un autre fichier</a>
        </center>
    </body>
    
</html>
