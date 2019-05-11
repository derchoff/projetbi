/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utils;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.io.File;

/**
 *
 * @author APOIZAT
 */
public class Fonctions {
    
    //DENIS : pas de hard coding
    final static String DOSSIER_A_TRAITER = "DossierATraiter";
    final static String PROPERTIES_RESOURCE_NAME = "wsDarties.properties";
    
    /*
        permet de copier un fichier.
        @param fileName nom du fichier � sauvegarder
        @param buffer contenu du fichier.
    
        La responsabilit� de cette fonction est de sauvegarder
        un fichier dans le r�pertoire DOSSIER_A_TRAITER
    
        DENIS : la classe de copy des fichiers ne doit pas conna�tre
                les codes HTTP Status : cette responsabilit� appartient
                au "controller" du web service.
        DENIS : convention java -> premi�re lettre des noms
                de m�thode en minuscule.
    */
    public static void load(String fileName, byte[] buffer) throws IOException {
        Properties prop = new Properties();
        //récupération du fichier properties
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        InputStream intFic = classLoader.getResourceAsStream(PROPERTIES_RESOURCE_NAME);
        prop.load(intFic);
        
        String dossierATraiter = prop.getProperty(DOSSIER_A_TRAITER);
        
        System.out.println("PROJETBI : FICHIER SORTIE : " + dossierATraiter + File.separator + fileName);
        
        FileOutputStream outputFile = null;
        
        try {                        
            //copie le fichier                              
            //DENIS : utilisation de la variable File.separator
            //          car dépend du système d'exploitation
            //          où sera exécuter le WS
            outputFile = new FileOutputStream(dossierATraiter + File.separator + fileName);
            
            outputFile.write(buffer, 0, buffer.length);
        }
        catch(IOException e) {
            System.out.println("PROJETBI : EXCEPTION : " + e.getLocalizedMessage());
            throw e;
        }
        finally {
            //DENIS : le close doit être dans le finally
            //          Sinon en cas d'exception à répetition
            //          Les ressources système exploserons car
            //          les handle de fichier ne seront pas libérés = serveur à genoux!
            if (outputFile != null)
                outputFile.close();
        }
    }
}
