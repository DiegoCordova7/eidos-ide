/**
 * DocPage
 *
 * Clase encargada de gestionar el comportamiento dinámico de una página
 * de documentación. Implementa funcionalidades como:
 *
 * - Recolección de secciones del documento
 * - ScrollSpy (resaltado automático en tabla de contenidos)
 * - Scroll suave hacia secciones
 *
 * Interactúa principalmente con:
 * - encabezados dentro de `.doc-article`
 * - enlaces dentro de `.toc-list` (tabla de contenidos)
 */
class DocPage { 
    /**
     * Constructor de la clase.
     * Inicializa referencias y ejecuta la configuración principal.
     */
    constructor() {
        /**
         * Contenedor de la tabla de contenidos (TOC).
         * @type {HTMLElement|null}
         */
        this.toc = document.querySelector('.toc-list');

        /**
         * Lista de secciones detectadas en el documento.
         * Cada sección contiene:
         * - id
         * - elemento DOM
         * - enlace asociado en el TOC
         * @type {Array<Object>}
         */
        this.sections = [];

        this.init();
    }
    
    /**
     * Método de inicialización principal.
     * Ejecuta la configuración de todas las funcionalidades.
     */
    init() {
        this.collectSections();
        this.setupScrollSpy();
        this.setupSmoothScroll();
    }
    
    /**
     * Recolecta todos los encabezados relevantes del documento (h2 y h3 con id)
     * y los vincula con sus respectivos enlaces en la tabla de contenidos.
     *
     * Estructura generada por sección:
     * {
     *   id: string,
     *   element: HTMLElement,
     *   link: HTMLElement|null
     * }
     */
    collectSections() {
        const headings = document.querySelectorAll('.doc-article h2[id], .doc-article h3[id]');
        
        this.sections = Array.from(headings).map(heading => ({
            id: heading.id,
            element: heading,
            link: document.querySelector(`.toc-list a[href="#${heading.id}"]`)
        }));
    }
    
    /**
     * Configura el sistema de ScrollSpy utilizando IntersectionObserver.
     *
     * Detecta qué sección está visible en pantalla y actualiza automáticamente
     * el enlace activo en la tabla de contenidos.
     *
     * Configuración:
     * - rootMargin ajusta la zona de activación para mejorar la experiencia UX
     */
    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target.id);
                }
            });
        }, {
            rootMargin: '-80px 0px -80% 0px'
        });
        
        this.sections.forEach(section => {
            if (section.element) {
                observer.observe(section.element);
            }
        });
    }
    
    /**
     * Marca como activo el enlace correspondiente a una sección.
     *
     * - Remueve la clase `active` de todos los enlaces
     * - Aplica la clase `active` al enlace correspondiente al id
     *
     * @param {string} id - ID de la sección activa
     */
    setActiveLink(id) {
        document.querySelectorAll('.toc-list a').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.toc-list a[href="#${id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    /**
     * Configura el comportamiento de scroll suave para los enlaces
     * de la tabla de contenidos.
     *
     * Características:
     * - Previene el comportamiento por defecto del navegador
     * - Aplica desplazamiento animado
     * - Ajusta el offset para compensar headers fijos
     */
    setupSmoothScroll() {
        document.querySelectorAll('.toc-list a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/**
 * Inicialización automática cuando el DOM está listo.
 *
 * Crea una instancia global accesible como:
 * window.docPage
 */
document.addEventListener('DOMContentLoaded', () => {
    window.docPage = new DocPage();
});