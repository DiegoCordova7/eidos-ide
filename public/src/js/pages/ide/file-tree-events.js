import { loadFile } from '../../localstorage/editor.adapter.js';

/**
 * Crea y devuelve el listener principal para el click sobre el encabezado
 * de un nodo del árbol de archivos.
 *
 * Este listener controla tres comportamientos según el tipo de nodo:
 *
 * 1. Carpeta + Shift:
 *    - selecciona la carpeta como carpeta activa
 *
 * 2. Carpeta:
 *    - expande o colapsa sus hijos
 *
 * 3. Archivo:
 *    - carga su contenido en el editor
 *    - marca visualmente el archivo como activo
 *
 * @param {Object} file - Objeto del nodo actual
 * @param {number|string} file.id - Identificador del archivo o carpeta
 * @param {string} file.name - Nombre del archivo o carpeta
 * @param {string} file.type - Tipo del nodo: "file" o "folder"
 * @param {HTMLElement} node - Elemento DOM del nodo actual
 * @param {HTMLElement|null} childrenContainer - Contenedor de hijos de una carpeta
 * @param {HTMLElement|null} expandIcon - Ícono de expansión/colapso de la carpeta
 * @param {Object} editorInstance - Instancia del editor de código
 * @param {Function} editorInstance.setValue - Método para actualizar el contenido del editor
 * @param {Object} callbacks - Callbacks auxiliares del árbol
 * @param {Function} callbacks.setSelectedFolder - Marca la carpeta seleccionada en el estado externo
 *
 * @returns {Function} Listener listo para ser asociado a un evento click
 */
export function setupHeaderClickListener(file, node, childrenContainer, expandIcon, editorInstance, callbacks) {
    return async (e) => {
        e.stopPropagation();
        if (file.type === 'folder' && e.shiftKey) {
            document.querySelectorAll('.file-tree-item.selected').forEach(el => {
                el.classList.remove('selected');
            });

            node.classList.add('selected');
            callbacks.setSelectedFolder(file.id, file.name);
            return;
        }
        if (file.type === 'folder') {
            if (childrenContainer) {
                const isCollapsed = childrenContainer.classList.contains('collapsed');

                if (isCollapsed) {
                    childrenContainer.classList.remove('collapsed');
                    expandIcon.classList.add('expanded');
                } else {
                    childrenContainer.classList.add('collapsed');
                    expandIcon.classList.remove('expanded');
                }
            }

            return;
        }
        if (file.type === 'file') {
            try {
                const data = await loadFile(file.id);

                editorInstance.setValue(data.content || '');
                editorInstance.currentFileId = file.id;

                document.querySelectorAll('.file-tree-item.active').forEach(el => {
                    el.classList.remove('active');
                });

                node.classList.add('active');
            } catch (err) {
                alert('No se pudo cargar el archivo');
            }
        }
    };
}