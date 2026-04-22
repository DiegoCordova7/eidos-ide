/**
 * Configuración por defecto del sistema.
 *
 * Este objeto define los valores iniciales que se aplican cuando:
 * - no existe configuración guardada para el usuario
 * - faltan propiedades en la configuración persistida
 * - ocurre un error al leer desde localStorage
 *
 * Sirve como fuente base para garantizar que siempre exista una
 * configuración completa y válida.
 */
const DEFAULT_SETTINGS = {
    ideTheme: 'dark',
    fontFamily: 'Consolas',
    syntaxTheme: 'eidos-dark',
    tabSize: 4,
    fontSize: 14,
    lineHeight: 1.6,
    zoomLevel: 100,
    consoleHeight: 30,
    autoSave: true,
    lineNumbers: true,
    wordWrap: true,
    autoComplete: true,
    hwAcceleration: true,
    clearConsole: true,
    accentColor: null
};

/**
 * Obtiene la configuración del usuario actual.
 *
 * Flujo:
 * 1. Recupera el id del usuario autenticado
 * 2. Si no hay usuario logueado, devuelve una copia de DEFAULT_SETTINGS
 * 3. Si hay usuario, intenta leer su configuración personalizada desde localStorage
 * 4. Fusiona la configuración almacenada con DEFAULT_SETTINGS
 * 5. Devuelve una configuración completa
 *
 * En caso de error al leer o parsear datos, devuelve la configuración por defecto.
 *
 * @returns {Promise<Object>} Configuración efectiva del usuario actual
 */
export async function getSettings() {
    try {
        const userId = localStorage.getItem('currentUserId');

        // Si no hay sesión activa, se usan los valores por defecto
        if (!userId) return { ...DEFAULT_SETTINGS };

        const settings = JSON.parse(
            localStorage.getItem(`settings_${userId}`) || '{}'
        );

        // Fusiona defaults + settings persistidos para asegurar completitud
        return { ...DEFAULT_SETTINGS, ...settings };
    } catch (error) {
        console.warn('Error obteniendo settings:', error);
        return { ...DEFAULT_SETTINGS };
    }
}

/**
 * Guarda la configuración del usuario actual.
 *
 * Flujo:
 * 1. Recupera el id del usuario autenticado
 * 2. Si no hay usuario logueado, lanza un error
 * 3. Lee la configuración actual del usuario desde localStorage
 * 4. Fusiona:
 *    - DEFAULT_SETTINGS
 *    - configuración actual persistida
 *    - nuevos settings recibidos
 * 5. Guarda el resultado final en localStorage
 * 6. Devuelve la configuración resultante
 *
 * Esto permite hacer actualizaciones parciales sin perder propiedades previas.
 *
 * @param {Object} settings - Cambios de configuración a persistir
 * @returns {Promise<Object>} Configuración final guardada
 * @throws {Error} Si no hay usuario autenticado o ocurre un error de guardado
 */
export async function saveSettings(settings) {
    try {
        const userId = localStorage.getItem('currentUserId');

        if (!userId) throw new Error('No hay usuario logueado');

        const currentSettings = JSON.parse(
            localStorage.getItem(`settings_${userId}`) || '{}'
        );

        // Prioridad de mezcla:
        // defaults < settings actuales < nuevos settings
        const merged = { ...DEFAULT_SETTINGS, ...currentSettings, ...settings };

        localStorage.setItem(
            `settings_${userId}`,
            JSON.stringify(merged)
        );

        return merged;
    } catch (error) {
        throw error;
    }
}

/**
 * Restablece la configuración del usuario actual.
 *
 * Flujo:
 * 1. Recupera el id del usuario autenticado
 * 2. Si no hay usuario logueado, lanza un error
 * 3. Elimina la configuración personalizada del usuario en localStorage
 * 4. Devuelve una copia de DEFAULT_SETTINGS
 *
 * Nota:
 * No guarda explícitamente los defaults después de borrar; simplemente
 * devuelve el objeto base para que el sistema lo use como configuración activa.
 *
 * @returns {Promise<Object>} Configuración reiniciada a valores por defecto
 * @throws {Error} Si no hay usuario autenticado
 */
export async function resetSettings() {
    try {
        const userId = localStorage.getItem('currentUserId');

        if (!userId) throw new Error('No hay usuario logueado');

        localStorage.removeItem(`settings_${userId}`);
        return { ...DEFAULT_SETTINGS };
    } catch (error) {
        throw error;
    }
}