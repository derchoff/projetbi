
package WebService;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the WebService package. 
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

    private final static QName _FileNotFoundException_QNAME = new QName("http://WebService/", "FileNotFoundException");
    private final static QName _IOException_QNAME = new QName("http://WebService/", "IOException");
    private final static QName _TransfererFichier_QNAME = new QName("http://WebService/", "TransfererFichier");
    private final static QName _TransfererFichierResponse_QNAME = new QName("http://WebService/", "TransfererFichierResponse");
    private final static QName _TransfererFichierBuffer_QNAME = new QName("", "buffer");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: WebService
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link FileNotFoundException }
     * 
     */
    public FileNotFoundException createFileNotFoundException() {
        return new FileNotFoundException();
    }

    /**
     * Create an instance of {@link IOException }
     * 
     */
    public IOException createIOException() {
        return new IOException();
    }

    /**
     * Create an instance of {@link TransfererFichier }
     * 
     */
    public TransfererFichier createTransfererFichier() {
        return new TransfererFichier();
    }

    /**
     * Create an instance of {@link TransfererFichierResponse }
     * 
     */
    public TransfererFichierResponse createTransfererFichierResponse() {
        return new TransfererFichierResponse();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link FileNotFoundException }{@code >}
     * 
     * @param value
     *     Java instance representing xml element's value.
     * @return
     *     the new instance of {@link JAXBElement }{@code <}{@link FileNotFoundException }{@code >}
     */
    @XmlElementDecl(namespace = "http://WebService/", name = "FileNotFoundException")
    public JAXBElement<FileNotFoundException> createFileNotFoundException(FileNotFoundException value) {
        return new JAXBElement<FileNotFoundException>(_FileNotFoundException_QNAME, FileNotFoundException.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link IOException }{@code >}
     * 
     * @param value
     *     Java instance representing xml element's value.
     * @return
     *     the new instance of {@link JAXBElement }{@code <}{@link IOException }{@code >}
     */
    @XmlElementDecl(namespace = "http://WebService/", name = "IOException")
    public JAXBElement<IOException> createIOException(IOException value) {
        return new JAXBElement<IOException>(_IOException_QNAME, IOException.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TransfererFichier }{@code >}
     * 
     * @param value
     *     Java instance representing xml element's value.
     * @return
     *     the new instance of {@link JAXBElement }{@code <}{@link TransfererFichier }{@code >}
     */
    @XmlElementDecl(namespace = "http://WebService/", name = "TransfererFichier")
    public JAXBElement<TransfererFichier> createTransfererFichier(TransfererFichier value) {
        return new JAXBElement<TransfererFichier>(_TransfererFichier_QNAME, TransfererFichier.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TransfererFichierResponse }{@code >}
     * 
     * @param value
     *     Java instance representing xml element's value.
     * @return
     *     the new instance of {@link JAXBElement }{@code <}{@link TransfererFichierResponse }{@code >}
     */
    @XmlElementDecl(namespace = "http://WebService/", name = "TransfererFichierResponse")
    public JAXBElement<TransfererFichierResponse> createTransfererFichierResponse(TransfererFichierResponse value) {
        return new JAXBElement<TransfererFichierResponse>(_TransfererFichierResponse_QNAME, TransfererFichierResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link byte[]}{@code >}
     * 
     * @param value
     *     Java instance representing xml element's value.
     * @return
     *     the new instance of {@link JAXBElement }{@code <}{@link byte[]}{@code >}
     */
    @XmlElementDecl(namespace = "", name = "buffer", scope = TransfererFichier.class)
    public JAXBElement<byte[]> createTransfererFichierBuffer(byte[] value) {
        return new JAXBElement<byte[]>(_TransfererFichierBuffer_QNAME, byte[].class, TransfererFichier.class, ((byte[]) value));
    }

}
