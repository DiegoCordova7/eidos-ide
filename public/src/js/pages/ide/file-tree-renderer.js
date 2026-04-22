/**
 * Renderiza recursivamente un nodo del árbol de archivos.
 *
 * Puede representar tanto:
 * - archivos
 * - carpetas
 *
 * Responsabilidades:
 * - crear la estructura visual del nodo
 * - aplicar indentación según el nivel jerárquico
 * - renderizar hijos en caso de carpeta
 * - marcar visualmente carpetas seleccionadas
 * - asociar listeners de click y menú contextual
 *
 * @param {Object} file - Nodo del árbol a renderizar
 * @param {number|string} file.id - Identificador del nodo
 * @param {string} file.name - Nombre del nodo
 * @param {string} file.type - Tipo del nodo: "file" o "folder"
 * @param {Array<Object>} [file.children] - Hijos del nodo si es carpeta
 * @param {number} indentLevel - Nivel de profundidad dentro del árbol
 * @param {Object} callbacks - Objeto con funciones de interacción
 * @param {number|string} [callbacks.selectedFolderId] - Id de la carpeta actualmente seleccionada
 * @param {Function} callbacks.onHeaderClick - Callback al hacer click en el encabezado
 * @param {Function} callbacks.onContextMenu - Callback al abrir menú contextual
 *
 * @returns {HTMLElement} Elemento DOM del nodo renderizado
 */
export function renderNode(file, indentLevel, callbacks) {
    /**
     * Contenedor principal del nodo.
     */
    const node = document.createElement('div');
    node.className = 'file-tree-item ' + file.type;
    node.dataset.type = file.type;
    node.dataset.id = file.id;

    /**
     * Encabezado del nodo.
     * Incluye icono de expansión y nombre.
     */
    const header = document.createElement('div');
    header.className = 'file-tree-item-header';

    /**
     * Aplica indentación visual según el nivel jerárquico.
     */
    header.style.paddingLeft = `${8 + indentLevel * 16}px`;

    /**
     * Ícono de expansión para carpetas.
     */
    const expandIcon = document.createElement('span');
    expandIcon.className = 'file-expand';

    if (file.type === 'folder') {
        expandIcon.textContent = '▶';
    }

    header.appendChild(expandIcon);

    /**
     * Nombre visible del archivo o carpeta.
     */
    const nameSpan = document.createElement('span');
    nameSpan.className = 'file-name';
    nameSpan.textContent = file.name;
    header.appendChild(nameSpan);

    node.appendChild(header);

    /**
     * Contenedor de hijos para carpetas.
     * Se crea colapsado por defecto.
     */
    let childrenContainer = null;

    if (file.type === 'folder') {
        childrenContainer = document.createElement('div');
        childrenContainer.className = 'file-children collapsed';
        
        if (file.children && file.children.length > 0) {
            file.children.forEach(child => {
                const childElement = renderNode(child, indentLevel + 1, callbacks);
                childrenContainer.appendChild(childElement);
            });
        }
        
        node.appendChild(childrenContainer);
    }

    /**
     * Marca visualmente la carpeta seleccionada si coincide con el estado actual.
     */
    if (file.type === 'folder' && callbacks.selectedFolderId === file.id) {
        node.classList.add('selected');
    }

    /**
     * Evento: click en el encabezado del nodo.
     *
     * Se delega el comportamiento al callback recibido.
     */
    header.addEventListener('click', (e) => {
        callbacks.onHeaderClick(e, file, node, childrenContainer, expandIcon);
    });

    /**
     * Evento: menú contextual (click derecho).
     *
     * Se delega el comportamiento al callback recibido.
     */
    header.addEventListener('contextmenu', (e) => {
        callbacks.onContextMenu(e, file.id, file.name, file.type);
    });

    return node;
}

/**
 * Renderiza el estado vacío del árbol de archivos.
 *
 * Se usa cuando el proyecto no contiene archivos ni carpetas.
 *
 * @param {HTMLElement} fileTree - Contenedor principal del árbol
 */
export function renderEmptyState(fileTree) {
    fileTree.innerHTML = `<div class="file-tree-empty">
        <div class="file-tree-empty-icon">📂</div>
        <div class="file-tree-empty-text">El proyecto está vacío</div>
    </div>`;
}

/**
 * Renderiza el estado de error del árbol de archivos.
 *
 * Se usa cuando ocurre un problema al cargar la estructura del proyecto.
 *
 * @param {HTMLElement} fileTree - Contenedor principal del árbol
 */
export function renderErrorState(fileTree) {
    fileTree.innerHTML = `<div class="file-tree-empty">
        <div class="file-tree-empty-text">Error cargando archivos</div>
    </div>`;
}