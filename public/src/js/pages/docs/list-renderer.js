/**
 * ListRenderer
 *
 * Clase encargada de renderizar estructuras basadas en listas dentro
 * del sistema de documentación de Eidos.
 *
 * Maneja diferentes variantes:
 * - Listas simples (<ul>)
 * - Listas de principios (numeradas + contenido)
 * - Listas de pasos (tipo tutorial)
 * - Roadmaps (estado de features)
 *
 * Nota:
 * Todos los métodos son estáticos → no requiere instanciación.
 */
class ListRenderer {

    /**
     * Renderiza una lista simple HTML (<ul>).
     *
     * @param {Object} item
     * @param {Array<string>} item.items - Elementos de la lista
     *
     * @returns {string} HTML generado
     */
    static renderList(item) {
        return `
            <ul>
                ${(item.items || []).map(i => `<li>${i}</li>`).join('')}
            </ul>
        `;
    }

    /**
     * Renderiza una lista de principios.
     *
     * Cada elemento incluye:
     * - Número (manual o automático)
     * - Título
     * - Descripción
     *
     * @param {Object} item
     * @param {Array} item.principles
     * @param {string} item.principles[].title
     * @param {string} item.principles[].description
     * @param {number} [item.principles[].number]
     *
     * @returns {string} HTML generado
     */
    static renderPrincipleList(item) {
        return `
            <div class="principle-list">
                ${(item.principles || []).map((p, idx) => `
                    <div class="principle-item">
                        <div class="principle-number">${p.number || idx + 1}</div>
                        <div class="principle-content">
                            <h3>${p.title}</h3>
                            <p>${p.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza una lista de pasos (tipo tutorial o guía).
     *
     * Cada paso incluye:
     * - Número automático
     * - Título
     * - Descripción
     *
     * @param {Object} item
     * @param {Array} item.steps
     * @param {string} item.steps[].title
     * @param {string} item.steps[].description
     *
     * @returns {string} HTML generado
     */
    static renderStepsList(item) {
        return `
            <div class="steps-list">
                ${(item.steps || []).map((step, idx) => `
                    <div class="step-item">
                        <div class="step-header">
                            <div class="step-number">${idx + 1}</div>
                            <h3>${step.title}</h3>
                        </div>
                        <p>${step.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza un roadmap visual (estado de features o desarrollo).
     *
     * Cada item incluye:
     * - Estado (done, active, pending)
     * - Título
     * - Descripción
     *
     * Nota:
     * El estado se usa como clase CSS para estilos visuales.
     *
     * @param {Object} item
     * @param {Array} item.items
     * @param {string} item.items[].title
     * @param {string} item.items[].description
     * @param {string} item.items[].status
     *
     * @returns {string} HTML generado
     */
    static renderRoadmap(item) {
        const statusLabels = {
            'done': 'Completado',
            'active': 'En progreso',
            'pending': 'Planeado'
        };
        
        return `
            <div class="roadmap-list">
                ${(item.items || []).map(i => `
                    <div class="roadmap-item ${i.status}">
                        <div class="roadmap-status"></div>
                        <div class="roadmap-content">
                            <h3>${i.title}</h3>
                            <p>${i.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

/**
 * Compatibilidad con Node/CommonJS
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ListRenderer;
}