/**
 * DocsGenerator
 *
 * Clase principal encargada de generar dinámicamente la página principal
 * de documentación de Eidos a partir del objeto DOCS_DATA.
 *
 * Responsabilidades:
 * - renderizar todas las secciones de documentación
 * - generar tarjetas normales y tarjetas de ejemplos
 * - inicializar búsqueda
 * - configurar atajos de teclado
 * - aplicar animaciones de aparición al hacer scroll
 */
class DocsGenerator {
    /**
     * Inicializa el generador de documentación.
     *
     * Propiedades:
     * - main: contenedor principal donde se insertan las secciones
     */
    constructor() {
        this.main = document.getElementById('docsMain');
        this.init();
    }
    
    /**
     * Ejecuta el proceso completo de inicialización.
     *
     * Flujo:
     * 1. Renderiza las secciones
     * 2. Configura la búsqueda
     * 3. Configura atajos de teclado
     * 4. Activa animaciones de entrada
     */
    init() {
        this.renderSections();
        this.setupSearch();
        this.setupKeyboardShortcuts();
        this.setupAnimations();
    }
    
    /**
     * Recorre todas las secciones definidas en DOCS_DATA
     * y las inserta en el contenedor principal.
     */
    renderSections() {
        Object.keys(DOCS_DATA).forEach(key => {
            const section = DOCS_DATA[key];
            const sectionEl = this.createSection(section);
            this.main.appendChild(sectionEl);
        });
    }
    
    /**
     * Crea un bloque de sección de documentación.
     *
     * Cada sección contiene:
     * - encabezado con icono y título
     * - grid de tarjetas
     *
     * Si la sección es de tipo "examples", usa un grid especial
     * y renderiza tarjetas de ejemplo.
     *
     * @param {Object} section - Objeto de sección definido en DOCS_DATA
     * @returns {HTMLElement} Elemento <section> listo para insertar
     */
    createSection(section) {
        const sectionEl = document.createElement('section');
        sectionEl.className = 'docs-section';
        
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `
            <span class="section-icon">${section.icon}</span>
            <h3>${section.title}</h3>
        `;
        sectionEl.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = section.type === 'examples' ? 'examples-grid' : 'cards-grid';
        
        section.cards.forEach(card => {
            const cardEl = section.type === 'examples'
                ? this.createExampleCard(card)
                : this.createDocCard(card);

            grid.appendChild(cardEl);
        });
        
        sectionEl.appendChild(grid);
        return sectionEl;
    }
    
    /**
     * Crea una tarjeta estándar de documentación.
     *
     * La tarjeta enlaza a una página interna de docs usando el parámetro ?page=.
     * Si la tarjeta define un color, se interpreta como tarjeta de paradigma
     * y se añade metadata visual adicional.
     *
     * @param {Object} card - Objeto de tarjeta
     * @returns {HTMLAnchorElement} Enlace renderizado como tarjeta
     */
    createDocCard(card) {
        const a = document.createElement('a');
        a.href = `./docs/doc.html?page=${card.url}`;
        a.className = 'doc-card';
        
        if (card.color) {
            a.classList.add('paradigm-card');
            a.dataset.color = card.color;
        }
        
        a.innerHTML = `
            <div class="card-icon">${card.icon}</div>
            <h4>${card.title}</h4>
            <p>${card.desc}</p>
        `;
        
        return a;
    }
    
    /**
     * Crea una tarjeta de ejemplo de código.
     *
     * Estas tarjetas muestran:
     * - título del ejemplo
     * - badge o nivel
     * - snippet de código
     *
     * @param {Object} card - Objeto de ejemplo
     * @returns {HTMLAnchorElement} Enlace renderizado como tarjeta de ejemplo
     */
    createExampleCard(card) {
        const a = document.createElement('a');
        a.href = `./docs/doc.html?page=${card.url}`;
        a.className = 'example-card';
        
        a.innerHTML = `
            <div class="example-header">
                <span class="example-title">${card.title}</span>
                <span class="example-badge">${card.badge}</span>
            </div>
            <pre class="example-code">${card.code}</pre>
        `;
        
        return a;
    }
    
    /**
     * Configura la búsqueda en la página principal de documentación.
     *
     * Comportamiento actual:
     * - escucha cambios en el input de búsqueda
     * - transforma la consulta a minúsculas
     * - ignora búsquedas menores a 2 caracteres
     * - actualmente solo registra la búsqueda en consola
     *
     * Nota:
     * La implementación real de filtrado o búsqueda aún está pendiente.
     */
    setupSearch() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) return;
            
            // TODO: Implementar búsqueda real
            console.log('Searching:', query);
        });
    }
    
    /**
     * Configura atajos de teclado globales para la página de documentación.
     *
     * Atajos:
     * - Ctrl/Cmd + K: enfoca el campo de búsqueda
     * - Escape: limpia y desenfoca el campo de búsqueda
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
            
            if (e.key === 'Escape') {
                const input = document.getElementById('searchInput');
                if (input) {
                    input.value = '';
                    input.blur();
                }
            }
        });
    }
    
    /**
     * Configura animaciones de entrada para las secciones de documentación.
     *
     * Usa IntersectionObserver para detectar cuándo una sección entra
     * en el viewport y aplicar una transición de aparición.
     *
     * Efectos:
     * - opacity: 0 -> 1
     * - transform: translateY(20px) -> translateY(0)
     */
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.docs-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(section);
        });
    }
}

/**
 * Inicializa automáticamente el generador de documentación
 * cuando el DOM está completamente cargado.
 *
 * También expone la instancia en window para depuración o acceso global.
 */
document.addEventListener('DOMContentLoaded', () => {
    window.docsGenerator = new DocsGenerator();
});