/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Darties;

import java.io.IOException;
import javax.jws.WebService;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import utils.Fonctions;

/**
 *
 * @author d_erc
 */
@WebService(serviceName = "DARTIES_WS")
public class DARTIES_WS {

    //DENIS : pas de "hard coding" des constantes;
    final static int BAD_REQUEST=400;
    final static int INTERNAL_SERVER_ERROR=500;
    final static int OK=201;         
    
    /**
     * This is a sample web service operation
     * @param fileName nom du fichier re�u
     * @param buffer contenu du fichier � enregistrer
     * @return un HTTP status code
     * @throws java.io.IOException si il y a une erreur lors de /
     *                              l'enregistrement du fichier
     * 
     */
    @WebMethod(operationName = "TransfererFichier")
    public int TransfererFichier(@WebParam(name = "filename") String fileName, 
            @WebParam(name = "buffer") byte[] buffer) {
                
        if("".equals(fileName) || fileName == null) {
            //return -1; DENIS : un webservice doit retourner les codes
            //conformes au standard W3C : https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP
            //le client qui interroge le WS ne doit pas se retrouver
            //avec des codes inconnus -> -1 n'est pas conforme aux exigences            
            System.out.println("PROJETBI : Nom de fichier vide");
            return BAD_REQUEST;//bad request
        }

        
        if(buffer == null || buffer.length == 0) {
            System.out.println("PROJETBI : Buffer vide");
            return BAD_REQUEST;//bad request
        }
        
        //vérification que le contenu est bien un fichier
        try {
            Fonctions.load(fileName, buffer);
            return OK;
        }
        //DENIS : capture les Exceptions lié à CompletableFuture
        catch(IOException ex) {
            System.out.println("PROJETBI : EXCEPTION : " + ex.getLocalizedMessage());
            return INTERNAL_SERVER_ERROR;
        }
    }
}
