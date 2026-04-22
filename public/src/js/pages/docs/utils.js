/**
 * Utils
 *
 * Clase utilitaria que agrupa funciones auxiliares reutilizables
 * para la documentación de Eidos.
 *
 * Responsabilidades:
 * - Copiar bloques de código al portapapeles
 * - Obtener la página actual desde la URL
 *
 * Nota:
 * Los métodos son estáticos, por lo que no es necesario instanciar la clase.
 */
class Utils {

    /**
     * Copia el contenido de un bloque de código al portapapeles.
     *
     * Flujo:
     * 1. Busca el bloque <code> más cercano al botón presionado
     * 2. Obtiene su contenido textual
     * 3. Lo copia al portapapeles usando la API del navegador
     * 4. Cambia temporalmente el texto del botón para indicar éxito
     *
     * Estructura esperada del DOM:
     * .code-block
     *   └── pre
     *       └── code
     *
     * @param {HTMLElement} button - Botón que activó la acción de copiar
     */
    static copyCode(button) {
        const codeBlock = button
            .closest('.code-block')
            .querySelector('pre code');

        const code = codeBlock.textContent;

        navigator.clipboard.writeText(code).then(() => {
            const originalText = button.textContent;

            // Feedback visual al usuario
            button.textContent = '✓ Copiado';

            // Restaurar texto original después de 2 segundos
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    }

    /**
     * Obtiene el nombre de la página actual a partir de la URL.
     *
     * Prioridad:
     * 1. Query param ?page=nombre
     * 2. Nombre del archivo en la ruta (fallback)
     *
     * Ejemplos:
     * - /doc.html?page=introduction → "introduction"
     * - /syntax.html → "syntax"
     *
     * @returns {string} Nombre de la página actual
     */
    static getPageFromURL() {
        const params = new URLSearchParams(window.location.search);
        const pageName = params.get('page');

        // Caso 1: query param
        if (pageName) {
            return pageName;
        }

        // Caso 2: fallback por ruta
        const path = window.location.pathname;
        const filename = path.split('/').pop();

        return filename.replace('.html', '');
    }
}

/**
 * Wrapper global para facilitar el uso desde HTML (onclick).
 *
 * Permite usar:
 * <button onclick="copyCode(this)">Copiar</button>
 *
 * @param {HTMLElement} button
 */
function copyCode(button) {
    Utils.copyCode(button);
}

/**
 * Compatibilidad con entornos Node/CommonJS.
 *
 * Permite importar Utils en pruebas o scripts fuera del navegador.
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}