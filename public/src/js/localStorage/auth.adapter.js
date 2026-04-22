/**
 * Inicia sesión de un usuario usando email y contraseña.
 *
 * Flujo:
 * 1. Obtiene la lista de usuarios almacenados en localStorage
 * 2. Busca un usuario que coincida con el email y la contraseña
 * 3. Si no existe, lanza un error
 * 4. Si existe, guarda su id como usuario actualmente autenticado
 * 5. Devuelve una respuesta de éxito sin exponer la contraseña
 *
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Resultado de autenticación con datos públicos del usuario
 * @throws {Error} Si el email o la contraseña no coinciden
 */
export async function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        throw new Error('Email o contraseña incorrectos');
    }
    
    localStorage.setItem('currentUserId', user.id);
    return {
        success: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
}

/**
 * Registra un nuevo usuario en el sistema.
 *
 * Flujo:
 * 1. Obtiene la lista actual de usuarios desde localStorage
 * 2. Verifica si ya existe un usuario con el mismo email
 * 3. Si el email ya está registrado, lanza un error
 * 4. Crea un nuevo objeto de usuario con id único basado en timestamp
 * 5. Guarda el nuevo usuario en localStorage
 * 6. Marca automáticamente al nuevo usuario como usuario autenticado
 * 7. Devuelve una respuesta de éxito con datos públicos del usuario
 *
 * @param {string} username - Nombre de usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Resultado del registro con datos públicos del usuario
 * @throws {Error} Si el email ya fue registrado anteriormente
 */
export async function registerUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        throw new Error('El email ya está registrado');
    }
    
    const newUser = {
        id: Date.now(),
        username,
        email,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUserId', newUser.id);
    
    return {
        success: true,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
    };
}

/**
 * Cierra la sesión actual.
 *
 * Elimina del almacenamiento local la referencia al usuario autenticado.
 *
 * @returns {Promise<Object>} Resultado de éxito del cierre de sesión
 */
export async function logoutUser() {
    localStorage.removeItem('currentUserId');
    return { success: true };
}

/**
 * Obtiene el usuario actualmente autenticado.
 *
 * Flujo:
 * 1. Recupera el id del usuario actual desde localStorage
 * 2. Si no existe, devuelve null
 * 3. Busca el usuario correspondiente en la lista de usuarios guardados
 * 4. Si el id ya no corresponde a un usuario válido, limpia la sesión
 * 5. Devuelve los datos públicos del usuario si existe
 *
 * @returns {Promise<Object>} Objeto con el usuario autenticado o null si no hay sesión válida
 */
export async function getCurrentUser() {
    const userId = localStorage.getItem('currentUserId');

    if (!userId) {
        return { user: null };
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id == userId);
    
    if (!user) {
        localStorage.removeItem('currentUserId');
        return { user: null };
    }
    
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
}