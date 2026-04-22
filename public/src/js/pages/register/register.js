/**
 * Register Module
 *
 * Script encargado de gestionar el proceso de registro de nuevos usuarios.
 * Sus responsabilidades incluyen:
 * - Inicializar localStorage con datos por defecto
 * - Capturar el envío del formulario de registro
 * - Validar datos básicos (confirmación de contraseña)
 * - Crear un nuevo usuario mediante el adapter
 * - Mostrar mensajes de estado al usuario
 * - Redirigir al dashboard en caso de éxito
 */

import { registerUser } from '../../adapters/auth-adapter.js';
import { initializeLocalStorage } from '../../utils/init-localStorage.js';

initializeLocalStorage();
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const submitButton = registerForm.querySelector('button[type="submit"]');

/**
 * Listener principal del formulario de registro.
 *
 * Flujo:
 * 1. Previene envío por defecto
 * 2. Activa estado de carga
 * 3. Obtiene datos del formulario
 * 4. Valida contraseña
 * 5. Intenta registrar usuario
 * 6. Maneja éxito o error
 */
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    registerMessage.textContent = '';
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        registerMessage.className = 'message error';
        registerMessage.textContent = 'Las contraseñas no coinciden';

        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }

    try {
        const res = await registerUser(username, email, password);
        if (res.success) {
            registerMessage.className = 'message success';
            registerMessage.textContent = '¡Registro exitoso! Redirigiendo...';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            registerMessage.className = 'message error';
            registerMessage.textContent = res.message || 'Error al registrarse';
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    } catch (err) {
        registerMessage.className = 'message error';
        registerMessage.textContent = err.message || 'Error al registrarse';
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
});