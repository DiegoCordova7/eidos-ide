/**
 * NavRenderer
 *
 * Clase encargada de renderizar componentes de navegación y layouts
 * estructurados dentro del sistema de documentación.
 *
 * A diferencia de TextRenderer, aquí se manejan estructuras más complejas:
 * - Grids de pasos
 * - Tablas comparativas
 * - Navegación entre páginas
 * - Cards de siguiente paso
 *
 * Nota:
 * Todos los métodos son estáticos → no requiere instanciación.
 */
class NavRenderer {

    /**
     * Renderiza un grid de pasos ("How it works", pipelines, etc).
     *
     * Cada paso incluye número, icono, título, descripción y opcionalmente tag.
     *
     * @param {Object} item
     * @param {Array} item.steps
     * @param {string} item.steps[].number
     * @param {string} item.steps[].icon
     * @param {string} item.steps[].title
     * @param {string} item.steps[].description
     * @param {string} [item.steps[].tag]
     *
     * @returns {string} HTML generado
     */
    static renderHowGrid(item) {
        return `
            <div class="how-grid">
                ${(item.steps || []).map(steps => `
                    <div class="how-card">
                        <div class="how-number">${steps.number}</div>
                        <span class="how-icon">${steps.icon}</span>
                        <h3>${steps.title}</h3>
                        <p>${steps.description}</p>
                        ${steps.tag ? `<span class="how-tag">${steps.tag}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza una sección de "siguientes pasos" (cards clickeables).
     *
     * Cada card es un enlace que lleva a otra sección o recurso.
     *
     * @param {Object} item
     * @param {Array} item.cards
     * @param {string} item.cards[].icon
     * @param {string} item.cards[].title
     * @param {string} item.cards[].description
     * @param {string} item.cards[].url
     *
     * @returns {string} HTML generado
     */
    static renderNextSteps(item) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 24px 0;">
                ${(item.cards || []).map(card => `
                    <a href="${card.url}" style="text-decoration: none; padding: 24px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; transition: all 0.2s; display: flex; flex-direction: column; gap: 12px; color: inherit;">
                        <span style="font-size: 32px;">${card.icon}</span>
                        <h3 style="font-size: 16px; font-weight: 600; margin: 0; color: var(--color-text-primary);">${card.title}</h3>
                        <p style="font-size: 14px; color: var(--color-text-muted); margin: 0;">${card.description}</p>
                    </a>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza una tabla comparativa simple.
     *
     * Usada para contrastar conceptos (ej: lenguajes, paradigmas, etc).
     *
     * @param {Object} item
     * @param {Array} item.comparisons
     * @param {string} item.comparisons[].label
     * @param {string} item.comparisons[].value
     *
     * @returns {string} HTML generado
     */
    static renderComparisonTable(item) {
        return `
            <div class="comparison-table">
                ${(item.comparisons || []).map(c => `
                    <div class="comparison-row">
                        <div class="comparison-label">${c.label}</div>
                        <div class="comparison-value">${c.value}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza la navegación entre páginas (Anterior / Siguiente).
     *
     * Este método modifica directamente el DOM en lugar de retornar HTML,
     * ya que depende de elementos existentes en la página.
     *
     * @param {Object} nav
     * @param {Object} [nav.prev]
     * @param {string} nav.prev.url
     * @param {string} nav.prev.title
     *
     * @param {Object} [nav.next]
     * @param {string} nav.next.url
     * @param {string} nav.next.title
     */
    static renderPageNavigation(nav) {
        if (!nav) return;

        if (nav.prev) {
            document.getElementById('navPrev').innerHTML = `
                <a href="${nav.prev.url}">
                    <span class="doc-nav-label">← Anterior</span>
                    <span class="doc-nav-title">${nav.prev.title}</span>
                </a>
            `;
        }

        if (nav.next) {
            document.getElementById('navNext').innerHTML = `
                <a href="${nav.next.url}">
                    <span class="doc-nav-label">Siguiente →</span>
                    <span class="doc-nav-title">${nav.next.title}</span>
                </a>
            `;
        }
    }
}

/**
 * Compatibilidad con Node/CommonJS
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavRenderer;
}