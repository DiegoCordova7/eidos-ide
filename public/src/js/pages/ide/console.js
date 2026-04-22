import { runCode } from '../../localstorage/editor.adapter.js';
/**
 * Inicializa la consola del IDE y registra los eventos principales
 * asociados a la ejecución de código.
 *
 * Este módulo se encarga de:
 * - conectar botones del UI con acciones de consola
 * - manejar la salida visual en el textarea de consola
 * - integrar (parcialmente) la ejecución de código
 *
 * NOTA:
 * - La ejecución real aún no está conectada (solo muestra mensaje)
 * - Debug está placeholder (no implementado)
 *
 * @param {Object} editorInstance - Instancia del editor (ej. Monaco, CodeMirror, etc.)
 */
export function initConsole(editorInstance) {
    /**
     * Elemento principal de salida de la consola.
     * Se asume que es un <textarea>.
     */
    const consoleArea = document.getElementById('console');

    /**
     * Botones de acción del IDE.
     */
    const btnRun = document.getElementById('btnRun');
    const btnDebug = document.getElementById('btnDebug');
    const btnClear = document.getElementById('btnClearConsole');

    /**
     * Evento: Ejecutar código.
     *
     * Actualmente solo imprime un mensaje en la consola.
     * Está preparado para integrar runCode(...) en el futuro.
     */
    btnRun.addEventListener('click', async () => {
        consoleArea.value = `▶ Ejecutado codigo\n`;
    });

    /**
     * Evento: Debug.
     *
     * Por ahora es un placeholder.
     * Valida que exista una instancia de editor antes de continuar.
     */
    btnDebug.addEventListener('click', async () => {
        if (!editorInstance) return;
        consoleArea.value = `🐛 Debug no implementado aún...\n`;
        consoleArea.scrollTop = consoleArea.scrollHeight;
    });

    /**
     * Evento: Limpiar consola.
     *
     * Simplemente vacía el contenido del textarea.
     */
    btnClear.addEventListener('click', () => {
        consoleArea.value = '';
    });
}