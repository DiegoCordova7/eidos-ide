/**
 * Muestra un menú contextual (click derecho) para elementos del explorador de archivos.
 *
 * Este menú permite realizar acciones básicas sobre un item:
 * - Renombrar
 * - Eliminar
 *
 * Comportamiento:
 * - Se posiciona dinámicamente según la posición del cursor
 * - Solo puede existir un menú activo a la vez
 * - Se cierra automáticamente al hacer clic fuera
 *
 * @param {MouseEvent} e - Evento del mouse que dispara el menú (usualmente click derecho)
 * @param {number|string} itemId - Identificador único del elemento
 * @param {string} itemName - Nombre actual del elemento
 * @param {string} itemType - Tipo del elemento (ej. "archivo", "carpeta")
 * @param {Object} callbacks - Callbacks para manejar acciones
 * @param {Function} callbacks.onRename - Función a ejecutar al renombrar (itemId, newName)
 * @param {Function} callbacks.onDelete - Función a ejecutar al eliminar (itemId)
 */
export function showContextMenu(e, itemId, itemName, itemType, callbacks) {

    /**
     * Elimina cualquier menú contextual existente para evitar duplicados.
     */
    const existingMenu = document.querySelector('.file-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    /**
     * Crea el contenedor del menú contextual.
     */
    const menu = document.createElement('div');
    menu.className = 'file-context-menu';

    /**
     * Posicionamiento dinámico en base al cursor.
     */
    menu.style.position = 'fixed';
    menu.style.top = e.clientY + 'px';
    menu.style.left = e.clientX + 'px';
    menu.style.zIndex = '1000';

    /**
     * ===== Opción: Renombrar =====
     *
     * - Solicita nuevo nombre con prompt
     * - Valida que no sea vacío ni igual al actual
     * - Ejecuta callback onRename
     */
    const renameBtn = document.createElement('div');
    renameBtn.className = 'context-menu-item';
    renameBtn.innerHTML = '✏️ Renombrar';

    renameBtn.addEventListener('click', () => {
        const newName = prompt(`Nuevo nombre para ${itemType}:`, itemName);

        if (newName && newName.trim() && newName !== itemName) {
            callbacks.onRename(itemId, newName.trim());
        }

        menu.remove();
    });

    menu.appendChild(renameBtn);

    /**
     * ===== Opción: Eliminar =====
     *
     * - Solicita confirmación
     * - Ejecuta callback onDelete si el usuario acepta
     */
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'context-menu-item delete';
    deleteBtn.innerHTML = '🗑️ Eliminar';

    deleteBtn.addEventListener('click', () => {
        if (confirm(`¿Eliminar ${itemType} "${itemName}"?`)) {
            callbacks.onDelete(itemId);
        }

        menu.remove();
    });

    menu.appendChild(deleteBtn);

    /**
     * Inserta el menú en el DOM.
     */
    document.body.appendChild(menu);

    /**
     * Cierre automático al hacer clic fuera del menú.
     *
     * Se usa setTimeout para evitar que el mismo click que abrió el menú lo cierre inmediatamente.
     */
    setTimeout(() => {
        document.addEventListener('click', function cerrarMenu() {
            if (menu.parentNode) {
                menu.remove();
            }

            document.removeEventListener('click', cerrarMenu);
        });
    }, 0);
}