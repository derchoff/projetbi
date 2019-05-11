/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package darties;

import DARTIES_WS.DARTIESWS;
import DARTIES_WS.DARTIESWS_Service;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URLEncoder;
import javax.servlet.http.Part;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author d_erc
 */
@MultipartConfig(fileSizeThreshold=1024*1024*10, 	// 10 MB 
                 maxFileSize=1024*1024*50,      	// 50 MB
                 maxRequestSize=1024*1024*100)   	// 100 MB
public class FileuploadServelet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        
        String msg = "";
        Boolean erreur = false;
        
        try (PrintWriter out = response.getWriter()) {
            try { 
                byte[] buffer = null;

                //récupère le flux du fichier
                Part uploadedFile = request.getPart("parcourirFichier"); // Retrieves <input type="file" name="parcourirFichier">
                InputStream content = uploadedFile.getInputStream();                

                //initialise un buffer de la bonne taille
                //et lit le stream 
                buffer = new byte[(int)uploadedFile.getSize()];
                content.read(buffer);

                // Get the uploaded file parameters
                String fileName = getFileName(uploadedFile);
                //supprime le chemin complet
                fileName = fileName.substring(fileName.lastIndexOf("\\")+1);
                System.out.println("PROJET BI : FICHIER : " + fileName);

                //transfert le contenu du fichier au webservice
                 DARTIESWS_Service wsDarties = new DARTIESWS_Service();
                 DARTIESWS ws = wsDarties.getDARTIESWSPort();
                 int retour = ws.transfererFichier(fileName, buffer);

                 System.out.println("PROJET BI : code retour : " + retour);                        
                 
                 if (retour == 201) 
                 {
                    msg = "Transfert Réussi";
                 }
                 else 
                 {
                    msg ="Impossible de transférer le fichier";
                    erreur = true;
                 }                  
            } catch(Exception ex)
            {                        
                //DENIS : message localisé
                msg = "Impossible de transférer le fichier : " + ex.getLocalizedMessage();
                erreur = true;
                System.out.println(msg);
            }     
            
            
            //request.setAttribute("message", msg);
            //getServletContext().getRequestDispatcher("response.jsp").forward(request, response);
            response.sendRedirect("./response.jsp?message="+URLEncoder.encode(msg, "UTF-8"));
        }
    }
   
//récupère le nom du fichier à partir des informations de content-disposition
private String getFileName(final Part part) {    
    for (String content : part.getHeader("content-disposition").split(";")) {
        if (content.trim().startsWith("filename")) {
            return content.substring(
                    content.indexOf('=') + 1).trim().replace("\"", "");
        }
    }
    return null;
}    

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
