/**
 * Carga un archivo a partir de su identificador.
 *
 * Flujo:
 * 1. Obtiene la lista de proyectos almacenados
 * 2. Recorre cada proyecto buscando su colección de archivos
 * 3. Busca un elemento cuyo id coincida y cuyo tipo sea "file"
 * 4. Si lo encuentra, lo devuelve
 * 5. Si no aparece en ningún proyecto, lanza un error
 *
 * @param {number|string} fileId - Identificador del archivo a cargar
 * @returns {Promise<Object>} Archivo encontrado
 * @throws {Error} Si el archivo no existe
 */
export async function loadFile(fileId) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    for (let project of projects) {
        const files = JSON.parse(localStorage.getItem(`files_${project.id}`) || '[]');
        const file = files.find(f => f.id == fileId && f.type === 'file');
        
        if (file) {
            return file;
        }
    }
    
    throw new Error('Archivo no encontrado');
}

/**
 * Guarda el contenido de un archivo existente.
 *
 * Flujo:
 * 1. Obtiene todos los proyectos
 * 2. Recorre sus colecciones de archivos
 * 3. Busca el índice del archivo solicitado
 * 4. Si lo encuentra, actualiza su contenido y fecha de modificación
 * 5. Persiste los cambios en localStorage
 * 6. Devuelve un mensaje de confirmación
 *
 * @param {number|string} fileId - Identificador del archivo a guardar
 * @param {string} content - Nuevo contenido del archivo
 * @returns {Promise<Object>} Resultado de la operación de guardado
 * @throws {Error} Si el archivo no existe
 */
export async function saveFile(fileId, content) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    for (let project of projects) {
        const files = JSON.parse(localStorage.getItem(`files_${project.id}`) || '[]');
        const fileIndex = files.findIndex(f => f.id == fileId);
        
        if (fileIndex !== -1) {
            files[fileIndex].content = content;
            files[fileIndex].updated_at = new Date().toISOString();
            localStorage.setItem(`files_${project.id}`, JSON.stringify(files));
            return { message: 'Archivo guardado', fileId };
        }
    }
    
    throw new Error('Archivo no encontrado');
}

/**
 * Crea un nuevo archivo dentro de un proyecto.
 *
 * Si parentId es 0, el archivo se crea en la raíz del proyecto.
 * En caso contrario, se asigna como hijo del elemento indicado.
 *
 * El archivo se inicializa con:
 * - tipo "file"
 * - contenido vacío
 * - marcas de tiempo de creación y actualización
 *
 * @param {number|string} projectId - Identificador del proyecto
 * @param {string} name - Nombre del nuevo archivo
 * @param {number|string} [parentId=0] - Carpeta padre; 0 indica raíz
 * @returns {Promise<Object>} Objeto del archivo creado
 */
export async function createFile(projectId, name, parentId = 0) {
    const files = JSON.parse(localStorage.getItem(`files_${projectId}`) || '[]');
    const parentValue = parentId === 0 ? null : parentId;
    
    const newFile = {
        id: Date.now(),
        project_id: projectId,
        parent_id: parentValue,
        name,
        type: 'file',
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    files.push(newFile);
    localStorage.setItem(`files_${projectId}`, JSON.stringify(files));
    
    return newFile;
}

/**
 * Crea una nueva carpeta dentro de un proyecto.
 *
 * Si parentId es 0, la carpeta se crea en la raíz del proyecto.
 * En caso contrario, se asigna como hija del elemento indicado.
 *
 * La carpeta se inicializa con:
 * - tipo "folder"
 * - marcas de tiempo de creación y actualización
 *
 * @param {number|string} projectId - Identificador del proyecto
 * @param {string} name - Nombre de la nueva carpeta
 * @param {number|string} [parentId=0] - Carpeta padre; 0 indica raíz
 * @returns {Promise<Object>} Objeto de la carpeta creada
 */
export async function createFolder(projectId, name, parentId = 0) {
    const files = JSON.parse(localStorage.getItem(`files_${projectId}`) || '[]');
    const parentValue = parentId === 0 ? null : parentId;
    
    const newFolder = {
        id: Date.now(),
        project_id: projectId,
        parent_id: parentValue,
        name,
        type: 'folder',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    files.push(newFolder);
    localStorage.setItem(`files_${projectId}`, JSON.stringify(files));
    
    return newFolder;
}

/**
 * Elimina un archivo o carpeta a partir de su identificador.
 *
 * Flujo:
 * 1. Recorre todos los proyectos
 * 2. Busca si el elemento existe dentro de alguno de ellos
 * 3. Si existe, elimina ese elemento y todos sus descendientes
 *    mediante deleteRecursive
 * 4. Guarda la colección actualizada
 * 5. Devuelve confirmación
 *
 * Esta operación soporta borrado recursivo, por lo que si el elemento
 * es una carpeta también se eliminan sus hijos y subhijos.
 *
 * @param {number|string} fileId - Identificador del archivo o carpeta
 * @returns {Promise<Object>} Resultado de la operación
 * @throws {Error} Si el elemento no existe
 */
export async function deleteFile(fileId) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    for (let project of projects) {
        const files = JSON.parse(localStorage.getItem(`files_${project.id}`) || '[]');
        const exists = files.some(f => f.id == fileId);
        if (!exists) continue;

        const updatedFiles = deleteRecursive(files, fileId);
        localStorage.setItem(`files_${project.id}`, JSON.stringify(updatedFiles));
        return { success: true, message: 'Archivo eliminado' };
    }

    throw new Error('Archivo no encontrado');
}

/**
 * Elimina recursivamente un elemento y todos sus descendientes
 * dentro de una colección jerárquica de archivos/carpetas.
 *
 * Estrategia:
 * - Comienza agregando el fileId inicial al conjunto de elementos a borrar
 * - Recorre la lista buscando hijos cuyo parent_id pertenezca al conjunto
 * - Repite hasta que ya no aparezcan nuevos descendientes
 * - Finalmente filtra todos los elementos marcados
 *
 * @param {Array<Object>} files - Lista completa de archivos y carpetas
 * @param {number|string} fileId - Identificador inicial a eliminar
 * @returns {Array<Object>} Nueva colección sin los elementos eliminados
 */
function deleteRecursive(files, fileId) {
    const toDelete = new Set([fileId]);

    let changed = true;
    while (changed) {
        changed = false;

        for (const f of files) {
            if (toDelete.has(f.parent_id) && !toDelete.has(f.id)) {
                toDelete.add(f.id);
                changed = true;
            }
        }
    }

    return files.filter(f => !toDelete.has(f.id));
}

/**
 * Renombra un archivo o carpeta existente.
 *
 * Flujo:
 * 1. Recorre los proyectos
 * 2. Busca el elemento por id
 * 3. Si lo encuentra, actualiza su nombre y fecha de modificación
 * 4. Guarda la colección actualizada
 * 5. Devuelve confirmación con los nuevos datos
 *
 * @param {number|string} fileId - Identificador del elemento
 * @param {string} newName - Nuevo nombre a asignar
 * @returns {Promise<Object>} Resultado de la operación
 * @throws {Error} Si el elemento no existe
 */
export async function renameFile(fileId, newName) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    for (let project of projects) {
        const files = JSON.parse(localStorage.getItem(`files_${project.id}`) || '[]');
        const file = files.find(f => f.id == fileId);
        
        if (file) {
            file.name = newName;
            file.updated_at = new Date().toISOString();
            localStorage.setItem(`files_${project.id}`, JSON.stringify(files));
            return { success: true, id: fileId, name: newName };
        }
    }
    
    throw new Error('Archivo no encontrado');
}

/**
 * Ejecuta código fuente.
 *
 * Actualmente esta función es un stub o placeholder:
 * no ejecuta realmente el código, solo devuelve un mensaje
 * simulado de ejecución.
 *
 * Puede servir como punto de integración futura con:
 * - un intérprete
 * - una VM
 * - un endpoint remoto
 * - un runner local
 *
 * @param {string} code - Código fuente a ejecutar
 * @returns {Promise<Object>} Resultado simulado de ejecución
 */
export async function runCode(code) {
    return { output: 'Ejecutando código...' };
}