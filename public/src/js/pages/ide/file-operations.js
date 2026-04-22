import { createFile, createFolder, deleteFile, renameFile } from '../../localStorage/editor.adapter.js';

/**
 * Renombra un elemento del explorador de archivos.
 *
 * Flujo:
 * 1. Llama al adaptador para renombrar el elemento
 * 2. Recarga el árbol de archivos mediante el callback
 * 3. Reaplica visualmente la selección de la carpeta actual si existe
 *
 * @param {number|string} itemId - Identificador del elemento a renombrar
 * @param {string} newName - Nuevo nombre del elemento
 * @param {Object} callbacks - Objeto con callbacks auxiliares
 * @param {Function} callbacks.onReloadFiles - Función para recargar el árbol de archivos
 * @param {number|string} [callbacks.selectedFolderId] - Id de la carpeta actualmente seleccionada
 * @returns {Promise<void>}
 */
export async function renameItem(itemId, newName, callbacks) {
    try {
        await renameFile(itemId, newName);
        await callbacks.onReloadFiles();
        
        setTimeout(() => {
            if (callbacks.selectedFolderId) {
                const folderEl = document.querySelector(`[data-id="${callbacks.selectedFolderId}"]`);
                if (folderEl) {
                    folderEl.classList.add('selected');
                }
            }
        }, 100);
    } catch (err) {
        alert('No se pudo renombrar');
    }
}

/**
 * Elimina un elemento del explorador de archivos.
 *
 * Flujo:
 * 1. Llama al adaptador para eliminar el elemento
 * 2. Recarga el árbol de archivos
 * 3. Reaplica visualmente la selección de la carpeta actual si existe
 *
 * @param {number|string} itemId - Identificador del elemento a eliminar
 * @param {Object} callbacks - Objeto con callbacks auxiliares
 * @param {Function} callbacks.onReloadFiles - Función para recargar el árbol de archivos
 * @param {number|string} [callbacks.selectedFolderId] - Id de la carpeta actualmente seleccionada
 * @returns {Promise<void>}
 */
export async function deleteItem(itemId, callbacks) {
    try {
        await deleteFile(itemId);
        await callbacks.onReloadFiles();
        
        setTimeout(() => {
            if (callbacks.selectedFolderId) {
                const folderEl = document.querySelector(`[data-id="${callbacks.selectedFolderId}"]`);
                if (folderEl) {
                    folderEl.classList.add('selected');
                }
            }
        }, 100);
    } catch (err) {
        alert('No se pudo eliminar');
    }
}

/**
 * Crea dinámicamente un nodo temporal en el árbol de archivos para permitir
 * al usuario ingresar el nombre de un nuevo archivo o carpeta.
 *
 * Flujo:
 * 1. Inserta un input temporal al inicio del árbol
 * 2. Enfoca automáticamente el input
 * 3. Si el usuario presiona Enter y el nombre es válido:
 *    - crea el archivo o carpeta correspondiente
 *    - recarga el árbol de archivos
 *    - reaplica la selección visual de la carpeta padre
 * 4. Si el usuario presiona Escape:
 *    - cancela la operación
 * 5. Si el input pierde foco:
 *    - elimina el nodo temporal con un pequeño retraso
 *
 * @param {string} type - Tipo de nodo a crear: "file" o "folder"
 * @param {number|string|null} parentId - Id de la carpeta padre
 * @param {HTMLElement} fileTree - Contenedor DOM del árbol de archivos
 * @param {number|string} projectId - Id del proyecto actual
 * @param {Object} callbacks - Objeto con callbacks auxiliares
 * @param {Function} callbacks.onReloadFiles - Función para recargar el árbol de archivos
 */
export function createNewNode(type, parentId, fileTree, projectId, callbacks) {
    const inputContainer = document.createElement('div');
    inputContainer.className = `file-tree-item new-${type}`;
    inputContainer.innerHTML = `<div class="file-tree-item-header" style="padding-left: 8px;"><input type="text" placeholder="Nombre del ${type}" /></div>`;
    fileTree.prepend(inputContainer);

    const input = inputContainer.querySelector('input');
    input.focus();

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            const name = input.value.trim();

            try {
                if (type === 'file') {
                    await createFile(projectId, name, parentId);
                } else {
                    await createFolder(projectId, name, parentId);
                }
                await callbacks.onReloadFiles();
                
                setTimeout(() => {
                    const folderEl = document.querySelector(`[data-id="${parentId}"]`);
                    if (folderEl) {
                        folderEl.classList.add('selected');
                    }
                }, 100);
            } catch (err) {
                alert(`No se pudo crear el ${type}`);
                inputContainer.remove();
            }
        }
        
        if (e.key === 'Escape') {
            inputContainer.remove();
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            if (inputContainer.parentNode) {
                inputContainer.remove();
            }
        }, 100);
    });
}