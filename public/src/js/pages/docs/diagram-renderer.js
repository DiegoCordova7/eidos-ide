/**
 * DiagramRenderer
 *
 * Clase encargada de renderizar diagramas visuales dentro del sistema
 * de documentación de Eidos.
 *
 * A diferencia de otros renderers, este módulo está enfocado en:
 * - Representación gráfica de flujos (pipelines)
 * - Visualización de arquitectura interna (ej: VM)
 *
 * Nota:
 * Todos los métodos son estáticos → no requiere instanciación.
 */
class DiagramRenderer {

    /**
     * Renderiza un diagrama de flujo (pipeline).
     *
     * Representa una secuencia de pasos conectados visualmente,
     * útil para explicar procesos como compilación, ejecución, etc.
     *
     * Cada paso incluye:
     * - icono
     * - label (texto principal)
     * - sublabel (opcional)
     * - tipo (para estilos CSS)
     *
     * @param {Object} item
     * @param {string} [item.title]
     * @param {Array} item.steps
     * @param {string} item.steps[].icon
     * @param {string} item.steps[].label
     * @param {string} [item.steps[].sublabel]
     * @param {string} [item.steps[].type]
     *
     * @returns {string} HTML generado
     */
    static renderFlowDiagram(item) {
        let html = '';
        
        if (item.title) {
            html += `<h3>${item.title}</h3>`;
        }
        
        html += '<div class="arch-pipeline">';
        
        (item.steps || []).forEach((step, index) => {
            html += `
                <div class="pipeline-node ${step.type}">
                    <span class="pipeline-icon">${step.icon}</span>
                    <div class="pipeline-label">${step.label}</div>
                    ${step.sublabel ? `<div class="pipeline-sublabel">${step.sublabel}</div>` : ''}
                </div>
            `;
            
            if (index < (item.steps || []).length - 1) {
                html += `
                    <div class="pipeline-connector">
                        <div class="pipeline-arrow"></div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Renderiza la sección de internos de la VM (EidosVM).
     *
     * Se utiliza para mostrar módulos o componentes internos
     * de forma visual en un grid.
     *
     * Cada módulo incluye:
     * - icono
     * - nombre
     * - descripción
     *
     * @param {Object} item
     * @param {string} [item.title]
     * @param {string} [item.badge]
     * @param {Array} item.modules
     * @param {string} item.modules[].icon
     * @param {string} item.modules[].name
     * @param {string} item.modules[].description
     *
     * @returns {string} HTML generado
     */
    static renderVMInternals(item) {
        return `
            <div class="vm-internals">
                ${item.title ? `
                    <div class="vm-internals-title">
                        <h3>${item.title}</h3>
                    </div>
                ` : ''}

                ${item.badge ? `
                    <span class="vm-rust-badge">${item.badge}</span>
                ` : ''}

                <div class="vm-internals-grid">
                    ${(item.modules || []).map(module => `
                        <div class="vm-internal-card">
                            <div class="vm-internal-icon">${module.icon}</div>
                            <div class="vm-internal-name">${module.name}</div>
                            <div class="vm-internal-desc">${module.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

/**
 * Compatibilidad con Node/CommonJS
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiagramRenderer;
}