package routines;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Arrays;
import java.text.DateFormatSymbols;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.text.Normalizer;

/*
 * user specification: the function's comment should contain keys as follows: 1. write about the function's comment.but
 * it must be before the "{talendTypes}" key.
 * 
 * 2. {talendTypes} 's value must be talend Type, it is required . its value should be one of: String, char | Character,
 * long | Long, int | Integer, boolean | Boolean, byte | Byte, Date, double | Double, float | Float, Object, short |
 * Short
 * 
 * 3. {Category} define a category for the Function. it is required. its value is user-defined .
 * 
 * 4. {param} 's format is: {param} <type>[(<default value or closed list values>)] <name>[ : <comment>]
 * 
 * <type> 's value should be one of: string, int, list, double, object, boolean, long, char, date. <name>'s value is the
 * Function's parameter name. the {param} is optional. so if you the Function without the parameters. the {param} don't
 * added. you can have many parameters for the Function.
 * 
 * 5. {example} gives a example for the Function. it is optional.
 */
public class projetBi {

	final static int YEAR = 1;
	final static int MONTH = 2;
	final static int ZERO_MILLISECOND = 0;
	
    /**
     * monthList: retourne la liste des nom de mois
     * 
     * 
     * {talendTypes} String[]
     * 
     * {Category} User Defined
     * 
     * 
     * {example} getMonthList # {"janvier", "février", ... }
     */
    public static String[] getMonthList() {
    	
    	String[] ret = new String[12];
    	Object[] liste = Arrays.asList(DateFormatSymbols.getInstance().getMonths())
    									.stream()
    									.limit(12)
    									.toArray();
    	for (int i = 0; i < liste.length; ++i)
    	{
    		ret[i] = (String)liste[i];
    	}
    	return ret;
    }

    private static String normalizeMonth(String month) {
    	return Normalizer.normalize(month.substring(0, 1).toUpperCase() + month.substring(1).toLowerCase(), Normalizer.Form.NFD)
	              .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }
    
    /**
     * getNormalizedMonthList: retourne la liste des nom de mois normalisés
     * Par normalisé il faut entendre : pas d'accent, première lettre en majuscule
     * 
     * 
     * {talendTypes} String[]
     * 
     * {Category} User Defined
     * 
     * 
     * {example} getNormalizedMonthList # {"Janvier", "Fevrier", ... }
     */
    public static List<String> getNormalizedMonthList() {

    	return Arrays.asList(getMonthList()).stream()
									.map( s -> normalizeMonth(s))    													
									.collect(Collectors.toList());

    }
    
        
    /**
     * getDateFromMonth: génère une date 01/month/année
     * month est 0 indexed
     * 
     * {talendTypes} Date
     * 
     * {Category} User Defined
     * 
     * {example} getDateFromMonth(5,2019) # 01/05/2019
     */
    public static Date getDateFromMonthAndYear(int month, int year) {
    	Calendar cal = Calendar.getInstance();
    	cal.set(year, month, 1, 0, 0, 0);
    	//MILLISECOND à zéro sinon les dates seront considérées comme différentes
    	//et Talend les ajoutera en bdd même si elles existent déjà
    	cal.set(Calendar.MILLISECOND, ZERO_MILLISECOND);
    	    	
    	return cal.getTime();
    }     
    
    /**
     * getDateFromMonth: génère une date 01/month/année
     * month est 0 indexed
     * 
     * {talendTypes} Date
     * 
     * {Category} User Defined
     * 
     * {example} getDateFromMonth(5,2019) # 01/05/2019
     * @throws Exception si le mois 'month' n'est pas trouvé
     */
    public static Date getDateFromMonthAndYear(String month, int year) throws Exception {
    	//Première letter en majusculen,sans accent
    	String normalizedMonth = normalizeMonth(month);
    	
    	//recherche l'index du mois à l'aide de sont nom
    	// sur une liste normalisée : minuscule sans accent
    	int idx_month = getNormalizedMonthList().indexOf(normalizedMonth);
    	
    	//si le mois n'a pas été trouvé alors exception
    	if (idx_month == -1) {
    		throw new Exception(String.format("mois %s non trouvé", month));
    	}
    	    	    	
    	return getDateFromMonthAndYear(idx_month, year);
    }      
        
    /**
     * getCurrentYear: retourne l'année courante.
     * L'intérêt de cette méthode est que
     * 'Calendar' ne semble pas accessible depuis
     * les composants de Talend
     * 
     * {talendTypes} Integer
     * 
     * {Category} User Defined
     * 
     * {example} getCurrentYear() # 2019
     */
    public static int getCurrentYear() {
    	return Calendar.getInstance().get(Calendar.YEAR);
    }
    
    /**
     * getYearFromFile: retourne l'année depuis le nom de fichier
     * 
     * {talendTypes} Integer
     * 
     * {Category} User Defined
     * 
     * {example} getYearFromFile("XXX_YYY_ZZZ_2019.xxx") # 2019
     */
    public static Integer getYearFromFile(String filename) {    	
    	String[] filename_parts = filename.split("\\.")[0].split("_");
    	return Integer.parseInt(filename_parts[filename_parts.length-YEAR]);
    }

    /**
     * getMonthFromFile: retourne le mois depuis le nom de fichier
     * 
     * {talendTypes} String
     * 
     * {Category} User Defined
     * 
     * {example} getMonthFromFile("XXX_YYY_Mars_2019.xxx") # Mars
     */
    public static String getMonthFromFile(String filename) {    	
    	String[] filename_parts = filename.split("\\.")[0].split("_");
    	
    	return filename_parts[filename_parts.length-MONTH];
    }
}
