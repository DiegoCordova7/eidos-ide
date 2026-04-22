import { getCurrentUser, logoutUser } from './auth-adapter.js';

/**
 * Clase encargada de gestionar el usuario actual en la interfaz.
 *
 * Responsabilidades:
 * - Verificar si existe un usuario autenticado
 * - Redirigir al login si no hay sesión activa
 * - Mantener el estado del usuario en memoria
 * - Reflejar la información del usuario en el DOM
 * - Manejar acciones de UI relacionadas (menú, logout)
 */
export class UserManager {
    constructor() {
        /**
         * Usuario actualmente autenticado.
         * Estructura:
         * {
         *   id: number,
         *   username: string,
         *   email: string
         * }
         */
        this.currentUser = null;
    }

    /**
     * Inicializa el usuario en la aplicación.
     *
     * Flujo:
     * 1. Obtiene el usuario actual desde el adapter de autenticación
     * 2. Si no existe usuario, redirige a la página de login
     * 3. Si existe, lo guarda en memoria
     * 4. Actualiza la UI con la información del usuario
     *
     * @returns {Promise<boolean>} true si hay usuario válido, false si redirige
     */
    async initUser() {
        const res = await getCurrentUser();

        if (!res.user) {
            window.location.href = 'login.html';
            return false;
        }

        this.currentUser = res.user;
        this.updateUserInfo();
        return true;
    }

    /**
     * Actualiza la información del usuario en el DOM.
     *
     * Elementos esperados:
     * - .user-name → nombre visible del usuario
     * - .user-avatar → inicial del usuario (avatar simple)
     *
     * Si los elementos no existen en la página, no hace nada.
     */
    updateUserInfo() {
        const userNameEl = document.querySelector('.user-name');
        if (userNameEl && this.currentUser) {
            userNameEl.textContent = this.currentUser.username;
        }

        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar && this.currentUser) {
            userAvatar.textContent = this.currentUser.username
                .charAt(0)
                .toUpperCase();
        }
    }

    /**
     * Alterna la visibilidad del menú desplegable del usuario.
     *
     * Busca el elemento con id 'userDropdown' y alterna la clase 'active'.
     * Usado típicamente para mostrar/ocultar el menú de usuario.
     */
    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    /**
     * Cierra la sesión del usuario actual.
     *
     * Flujo:
     * 1. Solicita confirmación al usuario
     * 2. Ejecuta logout mediante el adapter
     * 3. Limpia el sessionStorage
     * 4. Redirige a la página principal
     *
     * Si ocurre un error durante logout, lo registra en consola,
     * pero continúa con la limpieza y redirección.
     */
    async logout() {
        if (!confirm('¿Cerrar sesión?')) return;

        try {
            await logoutUser();
        } catch (err) {
            console.error('Error logging out:', err);
        }

        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}