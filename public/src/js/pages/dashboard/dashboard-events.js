import { dashboard } from './dashboard.js';
import { createProject as apiCreateProject, deleteProject as apiDeleteProject } from '../../localStorage/project.adapter.js';
import { showNotification } from './dashboard-ui.js';

/**
 * Registra todos los eventos principales de la interfaz del dashboard.
 *
 * Responsabilidades:
 * - abrir y cerrar modal de creación de proyecto
 * - crear proyectos
 * - manejar filtros y búsqueda
 * - mostrar/ocultar menú de usuario
 * - redirigir a docs y settings
 * - manejar cierre de sesión
 *
 * @param {Object} dashboard - Instancia del dashboard con métodos como refreshProjects y setFilter
 */
export function setupDashboardEvents(dashboard) {
    // Botones para abrir el modal de nuevo proyecto
    document.getElementById('newProjectBtn')?.addEventListener('click', openNewProjectModal);
    document.getElementById('createFirstBtn')?.addEventListener('click', openNewProjectModal);

    // Botones para cerrar el modal
    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeModal);

    // Botón para crear un nuevo proyecto
    document.getElementById('createBtn')?.addEventListener('click', createProject);

    // Permite cerrar el modal con la tecla Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Permite cerrar el modal al hacer click sobre el overlay
    document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

    // Menú de usuario
    document.getElementById('userMenuBtn')?.addEventListener('click', e => {
        e.stopPropagation();
        toggleUserMenu();
    });

    // Cierra el menú de usuario al hacer click fuera
    document.addEventListener('click', () =>
        document.getElementById('userDropdown')?.classList.remove('active')
    );

    // Cierre de sesión
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

    // Navegación a documentación
    document.getElementById('docsBtn')?.addEventListener('click', () => {
        window.location.href = 'docs.html';
    });

    // Navegación a settings
    document.getElementById('settingsBtn')?.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'settings.html';
    });

    // Búsqueda de proyectos por texto
    document.getElementById('searchInput')?.addEventListener('input', e =>
        filterProjects(e.target.value)
    );

    // Botones de filtro visual
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            document.querySelectorAll('.filter-btn').forEach(b =>
                b.classList.remove('active')
            );

            e.target.classList.add('active');
            dashboard.setFilter(e.target.dataset.filter);
        });
    });
}

/**
 * Abre el modal de creación de proyecto y enfoca el campo de nombre.
 */
function openNewProjectModal() {
    document.getElementById('newProjectModal')?.classList.add('active');
    document.getElementById('projectName')?.focus();
}

/**
 * Cierra el modal de creación de proyecto y limpia los campos del formulario.
 */
function closeModal() {
    document.getElementById('newProjectModal')?.classList.remove('active');
    document.getElementById('projectName').value = '';
    document.getElementById('projectDescription').value = '';
}

/**
 * Crea un nuevo proyecto a partir de los datos ingresados en el modal.
 *
 * Flujo:
 * 1. Obtiene nombre y descripción desde el formulario
 * 2. Valida que el nombre no esté vacío
 * 3. Valida que el nombre solo contenga caracteres permitidos
 * 4. Llama al adapter para crear el proyecto
 * 5. Cierra el modal, muestra notificación y refresca el dashboard
 *
 * En caso de error, muestra una notificación con el mensaje correspondiente.
 */
async function createProject() {
    const nameInput = document.getElementById('projectName');
    const descInput = document.getElementById('projectDescription');

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
        showNotification('El nombre del proyecto es obligatorio', 'error');
        return;
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        showNotification(
            'El nombre solo puede contener letras, números, guiones y guiones bajos',
            'error'
        );
        return;
    }

    try {
        await apiCreateProject(name, description);
        closeModal();
        showNotification('Proyecto creado exitosamente', 'success');
        await dashboard.refreshProjects();
    } catch (err) {
        showNotification(err.message || 'Error creando proyecto', 'error');
    }
}

/**
 * Elimina un proyecto del dashboard.
 *
 * Flujo:
 * 1. Solicita confirmación al usuario
 * 2. Llama al adapter para eliminar el proyecto
 * 3. Muestra notificación
 * 4. Refresca la lista de proyectos
 *
 * @param {number|string} projectId - Identificador del proyecto a eliminar
 */
export async function deleteProject(projectId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
        await apiDeleteProject(projectId);
        showNotification('Proyecto eliminado', 'success');
        await dashboard.refreshProjects();
    } catch (err) {
        showNotification(err.message || 'Error eliminando proyecto', 'error');
    }
}

/**
 * Alterna la visibilidad del menú desplegable de usuario.
 */
function toggleUserMenu() {
    document.getElementById('userDropdown')?.classList.toggle('active');
}

/**
 * Cierra la sesión del usuario actual.
 *
 * Flujo:
 * 1. Solicita confirmación
 * 2. Limpia sessionStorage
 * 3. Redirige a la página principal
 *
 * Nota:
 * Esta función no llama directamente al adapter de autenticación,
 * por lo que solo limpia estado de sesión del frontend.
 */
async function logout() {
    if (!confirm('Cerrar sesión?')) return;
    sessionStorage.clear();
    window.location.href = 'index.html';
}

/**
 * Filtra visualmente las tarjetas de proyectos según un término de búsqueda.
 *
 * La búsqueda se realiza sobre:
 * - nombre del proyecto
 * - descripción del proyecto
 *
 * Si el término coincide con alguno de los dos, la tarjeta se muestra;
 * en caso contrario, se oculta.
 *
 * @param {string} term - Texto de búsqueda ingresado por el usuario
 */
function filterProjects(term) {
    term = term.toLowerCase();

    document.querySelectorAll('.project-card').forEach(card => {
        const name = card.querySelector('.project-name').textContent.toLowerCase();
        const desc = card.querySelector('.project-description').textContent.toLowerCase();

        card.style.display = (name.includes(term) || desc.includes(term))
            ? 'block'
            : 'none';
    });
}