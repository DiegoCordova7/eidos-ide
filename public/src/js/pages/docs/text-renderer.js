/**
 * TextRenderer
 *
 * Clase responsable de renderizar elementos de contenido textual
 * dentro del sistema de documentación de Eidos.
 *
 * Convierte objetos JSON (items) en HTML listo para inyectarse en el DOM.
 *
 * Responsabilidades:
 * - Renderizar texto simple
 * - Renderizar banners de estado
 * - Renderizar cajas informativas (info/warning)
 * - Renderizar tarjetas CTA (Call To Action)
 * - Renderizar cajas interactivas tipo "Try it"
 *
 * Nota:
 * Todos los métodos son estáticos → no requiere instanciación.
 */
class TextRenderer {

    /**
     * Renderiza un párrafo de texto simple.
     *
     * @param {Object} item
     * @param {string} item.value - Contenido HTML o texto
     * @returns {string} HTML generado
     */
    static renderText(item) {
        return `<p>${item.value}</p>`;
    }

    /**
     * Renderiza un banner de estado (ej: aviso de beta, en desarrollo, etc).
     *
     * Soporta enlace opcional.
     *
     * @param {Object} item
     * @param {string} item.text - Texto principal del banner
     * @param {Object} [item.link] - Enlace opcional
     * @param {string} item.link.url
     * @param {string} item.link.label
     *
     * @returns {string} HTML generado
     */
    static renderStatusBanner(item) {
        return `
            <div class="status-banner">
                <span class="status-dot"></span>
                <span>${item.text}</span>
                ${item.link ? `<a href="${item.link.url}">${item.link.label}</a>` : ''}
            </div>
        `;
    }

    /**
     * Renderiza una caja informativa.
     *
     * Puede funcionar como:
     * - Info box normal
     * - Warning box (si item.warning === true)
     *
     * @param {Object} item
     * @param {string} item.icon - Icono visual
     * @param {string} item.content - Contenido HTML
     * @param {boolean} [item.warning] - Indica si es advertencia
     *
     * @returns {string} HTML generado
     */
    static renderInfoBox(item) {
        const className = item.warning ? 'info-box warning' : 'info-box';

        return `
            <div class="${className}">
                <span class="info-box-icon">${item.icon}</span>
                <div class="info-box-content">${item.content}</div>
            </div>
        `;
    }

    /**
     * Renderiza una tarjeta CTA (Call To Action).
     *
     * Usada para dirigir al usuario a otra sección/página.
     *
     * @param {Object} item
     * @param {string} item.icon
     * @param {string} item.title
     * @param {string} item.description
     * @param {string} item.url
     * @param {string} [item.buttonText]
     *
     * @returns {string} HTML generado
     */
    static renderCTACard(item) {
        return `
            <div class="cta-card">
                <span class="cta-icon">${item.icon}</span>
                <div class="cta-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <a href="${item.url}" class="btn-primary">
                    ${item.buttonText || 'Leer más'} →
                </a>
            </div>
        `;
    }

    /**
     * Renderiza una caja tipo "Try it yourself".
     *
     * Diseñada para invitar a interacción (ej: abrir IDE).
     *
     * @param {Object} item
     * @param {string} item.title
     * @param {string} item.description
     * @param {string} item.url
     * @param {string} [item.icon]
     * @param {string} [item.buttonText]
     *
     * @returns {string} HTML generado
     */
    static renderTryBox(item) {
        return `
            <div class="try-box">
                <div class="try-box-content">
                    <span class="try-icon">${item.icon || '💻'}</span>
                    <div>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
                <a href="${item.url}" class="btn-primary">
                    ${item.buttonText || 'Abrir'} →
                </a>
            </div>
        `;
    }
}

/**
 * Compatibilidad con Node/CommonJS
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextRenderer;
}