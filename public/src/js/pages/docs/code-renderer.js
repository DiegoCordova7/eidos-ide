/**
 * CodeRenderer
 *
 * Clase utilitaria encargada de renderizar bloques de código dentro del
 * sistema de documentación. Proporciona funciones para:
 * - escapar HTML de forma segura
 * - aplicar resaltado básico de sintaxis
 * - renderizar bloques de código con botón de copiado
 * - renderizar salidas de ejecución
 * - renderizar cajas de sintaxis estructurada
 */
class CodeRenderer {
    /**
     * Escapa caracteres HTML especiales para evitar que el contenido
     * sea interpretado como marcado en lugar de texto.
     *
     * Ejemplo:
     * "<div>" -> "&lt;div&gt;"
     *
     * @param {string} text - Texto a escapar.
     * @returns {string} Texto convertido a una representación HTML segura.
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Aplica resaltado sintáctico básico al código fuente.
     *
     * Flujo:
     * 1. Escapa el código para evitar inyección HTML
     * 2. Si el lenguaje no es "eidos", devuelve el código escapado sin resaltar
     * 3. Si el lenguaje es "eidos", aplica expresiones regulares para envolver
     *    distintos tokens en <span> con clases CSS específicas
     *
     * Tokens resaltados:
     * - Strings
     * - Comentarios de línea
     * - Constantes tipadas (#Integer, #Double, etc.)
     * - Tipos primitivos
     * - Palabras clave de control
     * - Booleanos
     * - Números
     * - Funciones built-in como print
     *
     * @param {string} code - Código fuente a resaltar.
     * @param {string} lang - Lenguaje del código.
     * @returns {string} Código como HTML con clases para resaltado visual.
     */
    static highlightCode(code, lang) {
        code = CodeRenderer.escapeHtml(code);
        
        if (lang !== 'eidos') return code;
        
        return code
            .replace(/"([^"]*)"/g, '<span class="c-str">"$1"</span>')
            .replace(/(\/\/.*$)/gm, '<span class="c-comment">$1</span>')
            .replace(/#(Integer|Double|Boolean|String)\b/g, '<span class="c-const">#$1</span>')
            .replace(/\b(Integer|Double|Boolean|String)\b/g, '<span class="c-type">$1</span>')
            .replace(/\b(if|else|match|for|while|do|return|break|continue)\b/g, '<span class="c-kw">$1</span>')
            .replace(/\b(true|false)\b/g, '<span class="c-bool">$1</span>')
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="c-num">$1</span>')
            .replace(/\b(print)\b/g, '<span class="c-fn">$1</span>');
    }

    /**
     * Renderiza un bloque de código completo.
     *
     * Puede incluir:
     * - bloque principal de código con header
     * - nombre del lenguaje
     * - botón para copiar el contenido
     * - bloque opcional de salida (output)
     *
     * Estructura esperada de item:
     * {
     *   code: string,
     *   lang?: string,
     *   output?: string
     * }
     *
     * @param {Object} item - Objeto con la definición del bloque de código.
     * @param {string} [item.code] - Código fuente a mostrar.
     * @param {string} [item.lang] - Lenguaje del código.
     * @param {string} [item.output] - Salida esperada del código.
     * @returns {string} HTML del bloque de código y su salida opcional.
     */
    static renderCode(item) {
        let html = '';

        if (item.code) {
            const highlighted = CodeRenderer.highlightCode(item.code, item.lang || '');

            html += `
                <div class="code-block">
                    <div class="code-block-header">
                        <span class="code-lang">${item.lang || ''}</span>
                        <button class="code-copy" onclick="copyCode(this)">Copiar</button>
                    </div>
                    <pre>${highlighted}</pre>
                </div>
            `;
        }

        if (item.output) {
            html += `
                <div class="code-output">
                    <div class="output-label">▶ Output</div>
                    <pre>${CodeRenderer.escapeHtml(item.output)}</pre>
                </div>
            `;
        }

        return html;
    }

    /**
     * Renderiza una caja de sintaxis visual basada en piezas.
     *
     * Cada pieza representa una parte semántica de la sintaxis,
     * por ejemplo:
     * - tipo
     * - identificador
     * - valor
     * - separadores
     *
     * Estructura esperada:
     * {
     *   pieces: [
     *     { type: 'type', value: 'Integer', separator: ' ' },
     *     { type: 'name', value: 'edad', separator: ' = ' },
     *     { type: 'value', value: '25', separator: ';' }
     *   ]
     * }
     *
     * @param {Object} item - Objeto que describe la sintaxis a renderizar.
     * @param {Array<Object>} item.pieces - Fragmentos de sintaxis.
     * @returns {string} HTML de la caja de sintaxis.
     */
    static renderSyntaxBox(item) {
        return `
            <div class="syntax-box">
                ${item.pieces.map(piece => `
                    <span class="syntax-piece ${piece.type}">${CodeRenderer.escapeHtml(piece.value)}</span>
                    ${piece.separator ? `<span class="syntax-sep">${piece.separator}</span>` : ''}
                `).join('')}
            </div>
        `;
    }
}

/**
 * Exportación compatible con entornos CommonJS / Node.js.
 *
 * Permite reutilizar la clase fuera del navegador en pruebas
 * o scripts que usen module.exports.
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeRenderer;
}