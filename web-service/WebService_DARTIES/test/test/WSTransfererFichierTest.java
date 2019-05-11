/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import Darties.DARTIES_WS;
import org.junit.Test;
import org.junit.Assert;

import utils.Fonctions;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author APOIZAT
 */
public class WSTransfererFichierTest {
    
    final String FICHIER = "C:\\Users\\apoizat\\Documents\\Miage\\D234\\Fichier\\Annee.xls";
    final static int BAD_REQUEST=400;
    final static int INTERNAL_SERVER_ERROR=500;
    final static int OK=201;
    
    public WSTransfererFichierTest() {
    }
    
    // TODO add test methods here.
    // The methods must be annotated with annotation @Test. For example:
    //
     @Test
     public void testTransfererFichier() throws FileNotFoundException, IOException {        
        File file = new File(FICHIER);
        String fileName = file.getName();

        InputStream in = new BufferedInputStream(new FileInputStream(FICHIER));

        byte[] buffer = new byte[4096];
        int n;
        while ((n=in.read(buffer, 0, buffer.length)) > 0) 
        {
        }
      
        Fonctions.load(fileName, buffer);
     }
     
     
    // DENIS : ajout des teste sur l'interface même du webservice
    // The methods must be annotated with annotation @Test. For example:
    //
     @Test
     public void testEnvoisnomFichierVide() throws IOException {
        String fileName = "";        
        byte[] buffer = new byte[4096];

        DARTIES_WS ws = new DARTIES_WS();
        
        int wsret = ws.TransfererFichier(fileName, buffer);
        
        Assert.assertEquals(BAD_REQUEST, wsret);                
     }
     
     // DENIS : Test un retour INTERNAL_SERVER_ERROR
     //
     @Test
     public void testEnvoisNomFichier() throws IOException {
        //un seprator de dossier gènère une IOEXception 
        // lorsque l'on écrit un fichier
        String fileName = File.separator + ".xls";        
        byte[] buffer = new byte[4096];        
        
        DARTIES_WS ws = new DARTIES_WS();
        
        int wsret = ws.TransfererFichier(fileName, buffer);
        
        Assert.assertEquals(INTERNAL_SERVER_ERROR, wsret);                 
     }
     
}
