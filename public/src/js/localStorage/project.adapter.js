/**
 * Obtiene los datos principales del dashboard del usuario actual.
 *
 * Flujo:
 * 1. Recupera el id del usuario autenticado
 * 2. Valida que exista una sesión activa
 * 3. Filtra los proyectos que pertenecen al usuario
 * 4. Calcula cuántos archivos reales tiene cada proyecto
 * 5. Calcula métricas globales:
 *    - total de proyectos
 *    - total de archivos
 *
 * @returns {Promise<Object>} Datos agregados del dashboard
 * @throws {Error} Si no hay un usuario autenticado
 */
export async function getDashboardData() {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
        .filter(p => p.owner_id == userId);
    
    const projectsWithCount = projects.map(p => {
        const files = JSON.parse(localStorage.getItem(`files_${p.id}`) || '[]');
        return {
            ...p,
            fileCount: files.filter(f => f.type === 'file').length
        };
    });
    
    const totalFiles = projectsWithCount.reduce((sum, p) => sum + p.fileCount, 0);
    
    return {
        projects: projectsWithCount,
        totalFiles,
        totalProjects: projectsWithCount.length
    };
}

/**
 * Lista todos los proyectos del usuario actual.
 *
 * Además de los datos del proyecto, agrega la cantidad de archivos
 * de tipo "file" asociados a cada uno.
 *
 * @returns {Promise<Array<Object>>} Lista de proyectos del usuario con conteo de archivos
 * @throws {Error} Si no hay un usuario autenticado
 */
export async function listProjects() {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
        .filter(p => p.owner_id == userId);
    
    return projects.map(p => ({
        ...p,
        fileCount: JSON.parse(localStorage.getItem(`files_${p.id}`) || '[]')
            .filter(f => f.type === 'file').length
    }));
}

/**
 * Obtiene los detalles de un proyecto específico del usuario actual.
 *
 * Flujo:
 * 1. Verifica que haya sesión iniciada
 * 2. Busca el proyecto por id y valida que pertenezca al usuario
 * 3. Recupera sus archivos
 * 4. Calcula la cantidad de archivos reales
 *
 * @param {number|string} projectId - Identificador del proyecto
 * @returns {Promise<Object>} Datos del proyecto con conteo de archivos
 * @throws {Error} Si no hay usuario autenticado
 * @throws {Error} Si el proyecto no existe o no pertenece al usuario
 */
export async function getProjectDetails(projectId) {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const project = projects.find(p => p.id == projectId && p.owner_id == userId);
    
    if (!project) throw new Error('Proyecto no encontrado o no autorizado');
    
    const files = JSON.parse(localStorage.getItem(`files_${projectId}`) || '[]');
    return {
        ...project,
        fileCount: files.filter(f => f.type === 'file').length
    };
}

/**
 * Crea un nuevo proyecto para el usuario actual.
 *
 * Flujo:
 * 1. Verifica que haya sesión iniciada
 * 2. Crea un proyecto con id único, nombre, descripción y timestamps
 * 3. Lo agrega a la lista global de proyectos
 * 4. Inicializa una colección vacía de archivos para ese proyecto
 *
 * @param {string} name - Nombre del proyecto
 * @param {string} [description=''] - Descripción opcional del proyecto
 * @returns {Promise<Object>} Proyecto recién creado
 * @throws {Error} Si no hay usuario autenticado
 */
export async function createProject(name, description = '') {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const newProject = {
        id: Date.now(),
        name,
        description,
        owner_id: parseInt(userId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem(`files_${newProject.id}`, JSON.stringify([]));
    
    return newProject;
}

/**
 * Actualiza el nombre y la descripción de un proyecto existente.
 *
 * Flujo:
 * 1. Verifica que haya sesión iniciada
 * 2. Busca el proyecto asegurando que pertenezca al usuario
 * 3. Actualiza nombre, descripción y fecha de modificación
 * 4. Persiste los cambios
 *
 * @param {number|string} projectId - Identificador del proyecto
 * @param {string} name - Nuevo nombre del proyecto
 * @param {string} [description=''] - Nueva descripción
 * @returns {Promise<Object>} Proyecto actualizado
 * @throws {Error} Si no hay usuario autenticado
 * @throws {Error} Si el proyecto no existe o no pertenece al usuario
 */
export async function updateProject(projectId, name, description = '') {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(p => p.id == projectId && p.owner_id == userId);
    
    if (projectIndex === -1) throw new Error('Proyecto no encontrado o no autorizado');
    
    projects[projectIndex].name = name;
    projects[projectIndex].description = description;
    projects[projectIndex].updated_at = new Date().toISOString();
    
    localStorage.setItem('projects', JSON.stringify(projects));
    return projects[projectIndex];
}

/**
 * Elimina un proyecto del usuario actual.
 *
 * Flujo:
 * 1. Verifica que haya sesión iniciada
 * 2. Busca el proyecto asegurando autorización
 * 3. Elimina el proyecto de la lista global
 * 4. Elimina también la colección de archivos asociada
 *
 * @param {number|string} projectId - Identificador del proyecto
 * @returns {Promise<Object>} Resultado de la operación
 * @throws {Error} Si no hay usuario autenticado
 * @throws {Error} Si el proyecto no existe o no pertenece al usuario
 */
export async function deleteProject(projectId) {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(p => p.id == projectId && p.owner_id == userId);
    
    if (projectIndex === -1) throw new Error('Proyecto no encontrado o no autorizado');
    
    projects.splice(projectIndex, 1);
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.removeItem(`files_${projectId}`);
    
    return { success: true, message: 'Proyecto eliminado' };
}

/**
 * Lista los archivos y carpetas hijos de un nivel específico dentro de un proyecto.
 *
 * Flujo:
 * 1. Verifica sesión activa
 * 2. Valida que el proyecto pertenezca al usuario
 * 3. Recupera la colección de archivos del proyecto
 * 4. Filtra los elementos cuyo parent_id coincida con el solicitado
 *
 * Si parentId es 0, se interpreta como la raíz del proyecto (null).
 *
 * @param {number|string} projectId - Identificador del proyecto
 * @param {number|string} [parentId=0] - Carpeta padre; 0 representa raíz
 * @returns {Promise<Array<Object>>} Lista de archivos y carpetas del nivel indicado
 * @throws {Error} Si no hay usuario autenticado
 * @throws {Error} Si el proyecto no existe o no pertenece al usuario
 */
export async function listProjectFiles(projectId, parentId = 0) {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const project = projects.find(p => p.id == projectId && p.owner_id == userId);
    
    if (!project) throw new Error('Proyecto no encontrado o no autorizado');
    
    const files = JSON.parse(localStorage.getItem(`files_${projectId}`) || '[]');
    const parentIdNum = parentId === 0 ? null : parentId;
    
    return files.filter(f => f.parent_id === parentIdNum);
}

/**
 * Construye el árbol completo de archivos y carpetas de un proyecto.
 *
 * Flujo:
 * 1. Verifica sesión activa
 * 2. Valida que el proyecto pertenezca al usuario
 * 3. Recupera todos los nodos del proyecto
 * 4. Crea un mapa por id para acceso rápido
 * 5. Reconstruye la jerarquía padre-hijo
 * 6. Devuelve los nodos raíz con sus descendientes anidados
 *
 * Cada nodo del árbol resultante contiene:
 * - id
 * - name
 * - type
 * - parent_id
 * - children
 *
 * @param {number|string} projectId - Identificador del proyecto
 * @returns {Promise<Array<Object>>} Árbol jerárquico del proyecto
 * @throws {Error} Si no hay usuario autenticado
 * @throws {Error} Si el proyecto no existe o no pertenece al usuario
 */
export async function getProjectTree(projectId) {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) throw new Error('No hay usuario logueado');
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const project = projects.find(p => p.id == projectId && p.owner_id == userId);
    
    if (!project) throw new Error('Proyecto no encontrado o no autorizado');
    
    const files = JSON.parse(localStorage.getItem(`files_${projectId}`) || '[]');
    const nodeMap = {};
    const tree = [];
    
    files.forEach(file => {
        nodeMap[file.id] = {
            id: file.id,
            name: file.name,
            type: file.type,
            parent_id: file.parent_id,
            children: []
        };
    });
    
    files.forEach(file => {
        const node = nodeMap[file.id];
        if (file.parent_id === null || file.parent_id === 0) {
            tree.push(node);
        } else {
            const parent = nodeMap[file.parent_id];
            if (parent) {
                parent.children.push(node);
            }
        }
    });
    
    return tree;
}