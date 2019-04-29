/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package WebService;

import utils.Fonctions;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
/**
 *
 * @author APOIZAT | modifications par Denis
 */
@WebService(serviceName = "DARTIES_TransfererFichier")
public class DARTIES_TransfererFichier {

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
            return BAD_REQUEST;//bad request
        }

        //vérification que le contenu est bien un fichier
        try {
            //DENIS : utilisation d'un CompletableFuture pour appel async
            //          car l'écriture de fichier est "long" pour un WS.
            //          Ainsi le "controller" du WS est libéré et il 
            //          peut traiter d'autres appels des clients
            CompletableFuture<Integer> completable =  CompletableFuture.supplyAsync(() -> { 
                try {
                    Fonctions.load(fileName, buffer);
                    return OK;
                } catch (IOException ex) {
                    return INTERNAL_SERVER_ERROR;
                }});

            //DENIS : capture les exceptions qui ne sont pas IOException
            return completable.handle((r,t) -> t!= null ? INTERNAL_SERVER_ERROR : OK).get();
        }
        //DENIS : capture les Exceptions lié à CompletableFuture
        catch(InterruptedException | ExecutionException ex) {
            return INTERNAL_SERVER_ERROR;
        }
    }
}
