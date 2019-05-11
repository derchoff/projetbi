
package DARTIES_WS;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the DARTIES_WS package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _TransfererFichierResponse_QNAME = new QName("http://Darties/", "TransfererFichierResponse");
    private final static QName _TransfererFichier_QNAME = new QName("http://Darties/", "TransfererFichier");
    private final static QName _TransfererFichierBuffer_QNAME = new QName("", "buffer");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: DARTIES_WS
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link TransfererFichierResponse }
     * 
     */
    public TransfererFichierResponse createTransfererFichierResponse() {
        return new TransfererFichierResponse();
    }

    /**
     * Create an instance of {@link TransfererFichier }
     * 
     */
    public TransfererFichier createTransfererFichier() {
        return new TransfererFichier();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TransfererFichierResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://Darties/", name = "TransfererFichierResponse")
    public JAXBElement<TransfererFichierResponse> createTransfererFichierResponse(TransfererFichierResponse value) {
        return new JAXBElement<TransfererFichierResponse>(_TransfererFichierResponse_QNAME, TransfererFichierResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TransfererFichier }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://Darties/", name = "TransfererFichier")
    public JAXBElement<TransfererFichier> createTransfererFichier(TransfererFichier value) {
        return new JAXBElement<TransfererFichier>(_TransfererFichier_QNAME, TransfererFichier.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link byte[]}{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "", name = "buffer", scope = TransfererFichier.class)
    public JAXBElement<byte[]> createTransfererFichierBuffer(byte[] value) {
        return new JAXBElement<byte[]>(_TransfererFichierBuffer_QNAME, byte[].class, TransfererFichier.class, ((byte[]) value));
    }

}
