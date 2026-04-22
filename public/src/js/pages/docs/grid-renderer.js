/**
 * GridRenderer
 *
 * Clase encargada de renderizar estructuras tipo grid dentro del
 * sistema de documentación de Eidos.
 *
 * Se utiliza para representar información en formato visual distribuido:
 * - Tipos de datos
 * - Paradigmas
 * - Features
 * - Estado de progreso (progress board)
 *
 * Nota:
 * Todos los métodos son estáticos → no requiere instanciación.
 */
class GridRenderer {

    /**
     * Renderiza un grid de tipos de datos.
     *
     * Cada tarjeta incluye:
     * - Nombre del tipo
     * - Descripción
     * - Ejemplo de uso
     *
     * @param {Object} item
     * @param {Array} item.types
     * @param {string} item.types[].name
     * @param {string} item.types[].description
     * @param {string} item.types[].example
     *
     * @returns {string} HTML generado
     */
    static renderTypesGrid(item) {
        return `
            <div class="types-grid">
                ${(item.types || []).map(type => `
                    <div class="type-card">
                        <div class="type-name">${type.name}</div>
                        <div class="type-desc">${type.description}</div>
                        <div class="type-example">${type.example}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza un grid de paradigmas.
     *
     * Cada tarjeta incluye:
     * - Icono
     * - Título
     * - Descripción
     * - Color opcional (para destacar visualmente)
     *
     * @param {Object} item
     * @param {Array} item.paradigms
     * @param {string} item.paradigms[].icon
     * @param {string} item.paradigms[].title
     * @param {string} item.paradigms[].description
     * @param {string} [item.paradigms[].color]
     *
     * @returns {string} HTML generado
     */
    static renderParadigmsGrid(item) {
        return `
            <div class="paradigms-grid">
                ${(item.paradigms || []).map(p => `
                    <div class="paradigm-card" style="border-color: ${p.color || 'var(--color-border)'}">
                        <span class="paradigm-icon">${p.icon}</span>
                        <h3>${p.title}</h3>
                        <p>${p.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza un grid de características (features).
     *
     * Cada tarjeta incluye:
     * - Icono
     * - Título
     * - Descripción
     *
     * @param {Object} item
     * @param {Array} item.features
     * @param {string} item.features[].icon
     * @param {string} item.features[].title
     * @param {string} item.features[].description
     *
     * @returns {string} HTML generado
     */
    static renderFeatureGrid(item) {
        return `
            <div class="feature-grid">
                ${(item.features || []).map(f => `
                    <div class="feature-card">
                        <span class="feature-icon">${f.icon}</span>
                        <h3>${f.title}</h3>
                        <p>${f.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza un tablero de progreso (progress board).
     *
     * Cada tarjeta representa una feature o módulo con estado:
     * - done (listo)
     * - active (en progreso)
     * - pending (pendiente)
     *
     * Incluye:
     * - Badge de estado
     * - Icono
     * - Título
     * - Descripción
     *
     * @param {Object} item
     * @param {Array} item.cards
     * @param {string} item.cards[].status
     * @param {string} item.cards[].icon
     * @param {string} item.cards[].title
     * @param {string} item.cards[].description
     *
     * @returns {string} HTML generado
     */
    static renderProgressBoard(item) {
        const statusLabels = {
            'done': 'Listo',
            'active': 'En progreso',
            'pending': 'Pendiente'
        };
        
        return `
            <div class="progress-board">
                ${(item.cards || []).map(card => `
                    <div class="progress-card ${card.status}">
                        <div class="progress-card-header">
                            <span class="progress-badge ${card.status}">
                                ${statusLabels[card.status] || card.status}
                            </span>
                        </div>
                        <span class="progress-icon">${card.icon}</span>
                        <h3>${card.title}</h3>
                        <p>${card.description}</p>
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
    module.exports = GridRenderer;
}