/**
 * Módulo principal del explorador de archivos del IDE.
 *
 * Este módulo coordina:
 * - la carga del árbol de archivos del proyecto
 * - la renderización visual del árbol
 * - la creación de nuevos archivos y carpetas
 * - el refresco manual del explorador
 * - la selección de carpetas
 * - la integración con el editor y el menú contextual
 */

import { renderNode, renderEmptyState, renderErrorState } from './file-tree-renderer.js';
import { setupHeaderClickListener } from './file-tree-events.js';
import { showContextMenu } from './file-context-menu.js';
import { renameItem, deleteItem, createNewNode } from './file-operations.js';
import { getProjectTree } from '../../localStorage/project.adapter.js';

/**
 * Inicializa el explorador de archivos para un proyecto específico.
 *
 * Responsabilidades:
 * - obtener referencias del DOM
 * - mantener el estado local de selección de carpeta
 * - registrar eventos de UI
 * - cargar y renderizar el árbol de archivos
 *
 * @param {Object} editorInstance - Instancia del editor de código
 * @param {number|string} projectId - Identificador del proyecto actual
 */
export function initFileExplorer(editorInstance, projectId) {
    /**
     * Referencias principales del DOM.
     */
    const fileTree = document.getElementById('fileTree');
    const btnNewFile = document.getElementById('btnNewFile');
    const btnNewFolder = document.getElementById('btnNewFolder');
    const btnRefresh = document.getElementById('btnRefresh');

    /**
     * Estado local del explorador.
     *
     * - selectedFolderId: carpeta actualmente seleccionada
     * - selectedFolderName: nombre de la carpeta seleccionada
     * - isLoading: evita cargas simultáneas del árbol
     */
    let selectedFolderId = null;
    let selectedFolderName = null;
    let isLoading = false;

    /**
     * Objeto de callbacks compartidos entre distintos submódulos.
     *
     * Permite comunicar:
     * - carpeta seleccionada
     * - callbacks de recarga
     * - callbacks de header/context menu
     */
    const callbacks = {
        selectedFolderId: null,

        /**
         * Actualiza el estado interno de carpeta seleccionada.
         *
         * @param {number|string} id - Id de la carpeta
         * @param {string} name - Nombre de la carpeta
         */
        setSelectedFolder: (id, name) => {
            selectedFolderId = id;
            selectedFolderName = name;
            callbacks.selectedFolderId = id;
        },

        /**
         * Callback base de click sobre encabezados del árbol.
         *
         * Se inicializa con placeholders y se reutiliza luego
         * al renderizar cada nodo real.
         */
        onHeaderClick: setupHeaderClickListener(null, null, null, null, editorInstance, {
            setSelectedFolder: (id, name) => {
                selectedFolderId = id;
                selectedFolderName = name;
                callbacks.selectedFolderId = id;
            }
        }),

        /**
         * Callback global de menú contextual.
         *
         * Permite renombrar o eliminar nodos usando el menú contextual.
         */
        onContextMenu: (e, itemId, itemName, itemType) => {
            showContextMenu(e, itemId, itemName, itemType, {
                onRename: (id, name) => renameItem(id, name, { ...callbacks, onReloadFiles: loadFiles }),
                onDelete: (id) => deleteItem(id, { ...callbacks, onReloadFiles: loadFiles })
            });
        },

        /**
         * Callback de recarga del árbol.
         */
        onReloadFiles: loadFiles
    };

    /**
     * Evento: crear nuevo archivo.
     *
     * Si hay una carpeta seleccionada, el archivo se crea dentro de ella.
     * Si no, se crea en la raíz del proyecto.
     */
    btnNewFile.addEventListener('click', () => {
        const parentId = selectedFolderId || null;
        createNewNode('file', parentId, fileTree, projectId, { onReloadFiles: loadFiles });
    });

    /**
     * Evento: crear nueva carpeta.
     *
     * Si hay una carpeta seleccionada, la carpeta nueva se crea dentro de ella.
     * Si no, se crea en la raíz del proyecto.
     */
    btnNewFolder.addEventListener('click', () => {
        const parentId = selectedFolderId || null;
        createNewNode('folder', parentId, fileTree, projectId, { onReloadFiles: loadFiles });
    });
    
    /**
     * Evento: refrescar árbol de archivos.
     *
     * Vuelve a cargar el árbol y luego reaplica la selección visual
     * de la carpeta seleccionada, si existe.
     */
    btnRefresh.addEventListener('click', () => {
        loadFiles();

        setTimeout(() => {
            if (selectedFolderId) {
                const folderEl = document.querySelector(`[data-id="${selectedFolderId}"]`);
                if (folderEl) {
                    folderEl.classList.add('selected');
                }
            }
        }, 100);
    });

    /**
     * Carga el árbol de archivos del proyecto y lo renderiza.
     *
     * Flujo:
     * 1. Evita cargas simultáneas si ya hay una en progreso
     * 2. Limpia visualmente el árbol actual
     * 3. Obtiene la estructura jerárquica desde el adapter
     * 4. Si no hay archivos, muestra estado vacío
     * 5. Si hay archivos, renderiza cada nodo raíz de forma recursiva
     * 6. Si ocurre un error, muestra estado de error
     *
     * @returns {Promise<void>}
     */
    async function loadFiles() {
        if (isLoading) return;
        isLoading = true;

        fileTree.innerHTML = '';
        
        try {
            const files = await getProjectTree(projectId);
            
            if (!files || files.length === 0) {
                renderEmptyState(fileTree);
                isLoading = false;
                return;
            }

            files.forEach(file => {
                /**
                 * Callbacks específicos por render de nodo.
                 *
                 * Se regeneran por cada nodo raíz para capturar
                 * correctamente el estado actual del explorador.
                 */
                const callbacks_render = {
                    selectedFolderId: selectedFolderId,

                    /**
                     * Callback para click en encabezado de nodo.
                     *
                     * Genera dinámicamente el listener real usando setupHeaderClickListener.
                     */
                    onHeaderClick: (e, file, node, childrenContainer, expandIcon) => {
                        setupHeaderClickListener(file, node, childrenContainer, expandIcon, editorInstance, {
                            setSelectedFolder: (id, name) => {
                                selectedFolderId = id;
                                selectedFolderName = name;
                            }
                        })(e);
                    },

                    /**
                     * Callback para menú contextual de nodo.
                     *
                     * Integra acciones de renombrado y eliminación.
                     */
                    onContextMenu: (e, itemId, itemName, itemType) => {
                        showContextMenu(e, itemId, itemName, itemType, {
                            onRename: (id, name) => renameItem(id, name, { selectedFolderId, onReloadFiles: loadFiles }),
                            onDelete: (id) => deleteItem(id, { selectedFolderId, onReloadFiles: loadFiles })
                        });
                    }
                };
                
                const element = renderNode(file, 0, callbacks_render);
                fileTree.appendChild(element);

                isLoading = false;
            });

        } catch (err) {
            renderErrorState(fileTree);
        } finally {
            isLoading = false;
        }
    }

    /**
     * Primera carga automática del árbol al inicializar el explorador.
     */
    loadFiles();
}