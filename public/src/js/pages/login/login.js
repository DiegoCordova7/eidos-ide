/**
 * Login Module
 *
 * Script encargado de manejar el proceso de inicio de sesión en la aplicación.
 * Sus responsabilidades incluyen:
 * - Inicializar datos en localStorage (si no existen)
 * - Capturar y manejar el envío del formulario de login
 * - Validar credenciales mediante el adapter de autenticación
 * - Mostrar feedback visual al usuario
 * - Redirigir al dashboard en caso de éxito
 */

import { loginUser } from '../../localStorage/auth.adapter.js';
import { initializeLocalStorage } from '../../localStorage/init-localstorage.js';

/**
 * Inicializa el almacenamiento local con datos por defecto
 * (usuarios, proyectos, configuración, etc.) si aún no existe.
 */
initializeLocalStorage();

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const submitButton = loginForm.querySelector('button[type="submit"]');

/**
 * Listener principal del formulario de login.
 *
 * Flujo:
 * 1. Previene el comportamiento por defecto del formulario
 * 2. Activa estado de carga (loading)
 * 3. Obtiene credenciales del usuario
 * 4. Intenta autenticación
 * 5. Maneja éxito o error
 */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    loginMessage.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const res = await loginUser(email, password);
        if (res.success) {
            loginMessage.className = 'message success';
            loginMessage.textContent = '¡Login exitoso! Redirigiendo...';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            loginMessage.className = 'message error';
            loginMessage.textContent = res.message || 'Error al iniciar sesión';
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    } catch (err) {
        loginMessage.className = 'message error';
        loginMessage.textContent = err.message || 'Error al iniciar sesión';
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        console.error(err);
    }
});