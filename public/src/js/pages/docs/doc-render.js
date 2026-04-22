/**
 * DocRenderer
 *
 * Clase principal encargada de cargar y renderizar una página individual
 * de documentación. Su función es:
 * - determinar qué página debe mostrarse
 * - obtener el contenido desde localStorage
 * - renderizar título, breadcrumbs, tabla de contenidos y artículo
 * - delegar la representación de bloques de contenido a los renderers especializados
 * - mostrar una vista de error si el contenido no existe
 */
class DocRenderer {
    /**
     * Constructor de la clase.
     *
     * Obtiene el nombre de la página actual desde la URL mediante Utils
     * y ejecuta el proceso de inicialización.
     */
    constructor() {
        /**
         * Nombre de la página actual a renderizar.
         * @type {string}
         */
        this.currentPage = Utils.getPageFromURL();

        this.init();
    }

    /**
     * Inicializa el renderer.
     *
     * Flujo:
     * 1. Carga el contenido correspondiente a la página actual
     * 2. Si se encuentra correctamente, lo renderiza
     * 3. Si ocurre un error, muestra la vista de error
     *
     * @returns {Promise<void>}
     */
    async init() {
        try {
            const content = await this.loadContent(this.currentPage);
            this.render(content);
        } catch (error) {
            console.error('Error loading content:', error);
            this.renderError();
        }
    }

    /**
     * Carga el contenido de una página desde localStorage.
     *
     * Busca la clave `docs_content`, la parsea y recupera
     * la página cuyo nombre coincida con `pageName`.
     *
     * @param {string} pageName - Nombre de la página a cargar
     * @returns {Promise<Object>} Objeto con la definición de la página
     * @throws {Error} Si no existe documentación en localStorage
     * @throws {Error} Si la página solicitada no existe
     */
    async loadContent(pageName) {
        const raw = localStorage.getItem('docs_content');

        if (!raw) {
            throw new Error('No hay documentación en localStorage');
        }

        const docs = JSON.parse(raw);
        const page = docs[pageName];

        if (!page) {
            throw new Error(`No existe la página: ${pageName}`);
        }

        return page;
    }

    /**
     * Renderiza todos los elementos principales de la página.
     *
     * Incluye:
     * - título
     * - breadcrumbs
     * - tabla de contenidos
     * - artículo principal
     * - navegación entre páginas
     *
     * @param {Object} data - Datos completos de la página
     */
    render(data) {
        this.renderTitle(data.title);
        this.renderBreadcrumbs(data.breadcrumbs);
        this.renderTOC(data.sections);
        this.renderArticle(data);
        NavRenderer.renderPageNavigation(data.navigation);
    }

    /**
     * Renderiza el título de la página en el encabezado.
     *
     * @param {string} title - Título principal de la página
     */
    renderTitle(title) {
        document.getElementById('pageTitle').textContent = `${title}`;
    }

    /**
     * Renderiza la ruta de navegación (breadcrumbs).
     *
     * Si el crumb es el actual, se renderiza como texto.
     * Si no, se renderiza como enlace.
     *
     * @param {Array<Object>} breadcrumbs - Lista de breadcrumbs
     */
    renderBreadcrumbs(breadcrumbs) {
        const container = document.getElementById('breadcrumbs');
        if (!breadcrumbs || breadcrumbs.length === 0) return;
        
        container.innerHTML = breadcrumbs.map(crumb => {
            if (crumb.current) {
                return `<span class="breadcrumb-current">${crumb.label}</span>`;
            }

            return `
                <a href="${crumb.url}">${crumb.label}</a>
                <span class="breadcrumb-separator">/</span>
            `;
        }).join('');
    }
    
    /**
     * Renderiza la tabla de contenidos (TOC) a partir de las secciones.
     *
     * Cada entrada enlaza a una sección interna de la página.
     *
     * @param {Array<Object>} sections - Secciones del artículo
     */
    renderTOC(sections) {
        const container = document.getElementById('tocList');
        if (!sections || sections.length === 0) return;
        
        container.innerHTML = sections.map(section => `
            <li><a href="#${section.id}">${section.title}</a></li>
        `).join('');
    }
    
    /**
     * Renderiza el contenido principal del artículo.
     *
     * Estructura:
     * - h1 principal
     * - lead opcional
     * - secciones del artículo
     *
     * @param {Object} data - Datos de la página completa
     */
    renderArticle(data) {
        const container = document.getElementById('articleContent');
        
        let html = `<h1>${data.title}</h1>`;
        
        if (data.lead) {
            html += `<p class="lead">${data.lead}</p>`;
        }
        
        if (data.sections && Array.isArray(data.sections)) {
            data.sections.forEach(section => {
                html += this.renderSection(section);
            });
        }
        
        container.innerHTML = html;
    }

    /**
     * Renderiza una sección individual del artículo.
     *
     * Cada sección contiene:
     * - id para navegación interna
     * - título
     * - lista de bloques de contenido
     *
     * @param {Object} section - Definición de la sección
     * @returns {string} HTML renderizado de la sección
     */
    renderSection(section) {
        let html = `<section id="${section.id}">`;
        html += `<h2>${section.title}</h2>`;
        
        if (section.content && Array.isArray(section.content)) {
            section.content.forEach(item => {
                html += this.renderContent(item);
            });
        }
        
        html += `</section>`;
        return html;
    }
    
    /**
     * Renderiza un bloque de contenido individual según su tipo.
     *
     * Este método actúa como dispatcher central del sistema de documentación:
     * delega cada tipo de bloque al renderer especializado correspondiente.
     *
     * Tipos soportados:
     * - TextRenderer
     * - CodeRenderer
     * - GridRenderer
     * - ListRenderer
     * - NavRenderer
     * - DiagramRenderer
     *
     * Si el tipo no es reconocido:
     * - registra una advertencia en consola
     * - devuelve una cadena vacía
     *
     * @param {Object} item - Bloque de contenido
     * @returns {string} HTML generado para ese bloque
     */
    renderContent(item) {
        if (!item || !item.type) return '';
        
        switch (item.type) {
            case 'text':
                return TextRenderer.renderText(item);
            case 'statusbanner':
                return TextRenderer.renderStatusBanner(item);
            case 'infobox':
                return TextRenderer.renderInfoBox(item);
            case 'ctacard':
                return TextRenderer.renderCTACard(item);
            case 'trybox':
                return TextRenderer.renderTryBox(item);

            case 'code':
            case 'codeblock':
                return CodeRenderer.renderCode(item);
            case 'syntaxbox':
                return CodeRenderer.renderSyntaxBox(item);

            case 'typesgrid':
                return GridRenderer.renderTypesGrid(item);
            case 'paradigmsgrid':
                return GridRenderer.renderParadigmsGrid(item);
            case 'featuregrid':
                return GridRenderer.renderFeatureGrid(item);
            case 'progressboard':
                return GridRenderer.renderProgressBoard(item);

            case 'list':
                return ListRenderer.renderList(item);
            case 'principlelist':
                return ListRenderer.renderPrincipleList(item);
            case 'stepslist':
                return ListRenderer.renderStepsList(item);
            case 'roadmap':
                return ListRenderer.renderRoadmap(item);

            case 'howgrid':
                return NavRenderer.renderHowGrid(item);
            case 'nextsteps':
                return NavRenderer.renderNextSteps(item);
            case 'comparisontable':
                return NavRenderer.renderComparisonTable(item);

            case 'flowdiagram':
            case 'pipeline':
                return DiagramRenderer.renderFlowDiagram(item);
            case 'vminternals':
                return DiagramRenderer.renderVMInternals(item);

            default:
                console.warn(`Tipo de contenido desconocido: ${item.type}`);
                return '';
        }
    }
    
    /**
     * Renderiza una vista de error cuando la página no puede cargarse.
     *
     * Muestra:
     * - título de error
     * - mensaje descriptivo
     * - enlace para volver a la documentación principal
     */
    renderError() {
        document.getElementById('articleContent').innerHTML = `
            <h1>Página no encontrada</h1>
            <p>El contenido de esta página aún no está disponible.</p>
            <a href="../docs.html" class="btn-primary">Volver a Documentación</a>
        `;
    }
}

/**
 * Inicializa automáticamente el renderer de página de documentación
 * cuando el DOM termina de cargar.
 *
 * También expone la instancia en window para depuración o acceso global.
 */
document.addEventListener('DOMContentLoaded', () => {
    window.docRenderer = new DocRenderer();
});