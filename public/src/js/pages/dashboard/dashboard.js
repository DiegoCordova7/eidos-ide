import { getCurrentUser } from '../../localStorage/auth.adapter.js';
import { getDashboardData, updateProject, deleteProject as deleteProjectAPI } from '../../localStorage/project.adapter.js';
import { renderProjectsGrid, updateStatsUI, showNotification } from './dashboard-ui.js';
import { setupDashboardEvents } from './dashboard-events.js';
import { SettingsSync } from '../../core/settings-sync.js';
import { initSettingsObserver } from './dashboard-settings.js';

/**
 * Dashboard
 *
 * Clase principal encargada de coordinar el funcionamiento del dashboard.
 *
 * Responsabilidades:
 * - inicializar settings y observadores visuales
 * - validar sesión del usuario
 * - cargar proyectos
 * - actualizar la UI del usuario
 * - renderizar proyectos y estadísticas
 * - manejar acciones sobre proyectos (renombrar, editar descripción, eliminar)
 * - conectar eventos del DOM con la lógica del dashboard
 */
export class Dashboard {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.currentUser = null;
        this.settingsSync = null;
    }

    /**
     * Inicializa completamente el dashboard.
     *
     * Flujo:
     * 1. Inicializa sincronización de settings
     * 2. Inicializa observer de settings
     * 3. Obtiene el usuario actual
     * 4. Si no hay usuario, redirige a login
     * 5. Actualiza la UI del usuario
     * 6. Carga proyectos del dashboard
     * 7. Renderiza proyectos y estadísticas
     * 8. Registra eventos delegados sobre la grilla
     * 9. Registra eventos generales del dashboard
     *
     * @returns {Promise<void>}
     */
    async init() {
        this.settingsSync = new SettingsSync();
        initSettingsObserver();

        const userRes = await getCurrentUser();

        if (!userRes.user) {
            return window.location.href = 'login.html';
        }

        this.currentUser = userRes.user;
        this.updateUserInfo();

        await this.loadProjects();
        renderProjectsGrid(this.projects, this.currentFilter);
        updateStatsUI(this.projects);

        const grid = document.getElementById('projectsGrid');

        /**
         * Manejo delegado de eventos dentro de la grilla de proyectos.
         *
         * Permite:
         * - abrir/cerrar menú contextual
         * - renombrar proyecto
         * - editar descripción
         * - eliminar proyecto
         * - navegar al IDE al hacer click en una tarjeta
         */
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            const projectId = card.dataset.projectId;
            const menu = card.querySelector('.project-menu');

            if (e.target.closest('.project-menu-btn')) {
                document.querySelectorAll('.project-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('active');
                });

                menu.classList.toggle('active');
                return;
            }

            if (e.target.closest('.rename-project-btn')) {
                this.renameProject(projectId);
                menu.classList.remove('active');
                return;
            }

            if (e.target.closest('.edit-desc-project-btn')) {
                this.editProjectDescription(projectId);
                menu.classList.remove('active');
                return;
            }

            if (e.target.closest('.delete-project-btn')) {
                this.deleteProject(projectId);
                menu.classList.remove('active');
                return;
            }

            if (!e.target.closest('.project-menu')) {
                window.location.href = `ide.html?projectId=${projectId}`;
            }
        });

        /**
         * Cierra todos los menús contextuales al hacer click fuera.
         */
        document.addEventListener('click', () => {
            document.querySelectorAll('.project-menu').forEach(m =>
                m.classList.remove('active')
            );
        });

        setupDashboardEvents(this);
    }

    /**
     * Actualiza la información del usuario en la interfaz.
     *
     * Elementos esperados:
     * - .user-name   -> nombre visible del usuario
     * - .user-avatar -> inicial del nombre de usuario
     */
    updateUserInfo() {
        const nameEl = document.querySelector('.user-name');
        const avatarEl = document.querySelector('.user-avatar');

        if (nameEl) {
            nameEl.textContent = this.currentUser.username;
        }

        if (avatarEl) {
            avatarEl.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
    }

    /**
     * Carga los proyectos del usuario actual desde el adaptador.
     *
     * Si ocurre un error:
     * - registra el error en consola
     * - limpia la lista local de proyectos
     * - muestra una notificación de error
     *
     * @returns {Promise<void>}
     */
    async loadProjects() {
        try {
            const data = await getDashboardData();
            this.projects = data.projects;
        } catch (err) {
            console.error('Error cargando proyectos:', err);
            this.projects = [];
            showNotification('Error al cargar proyectos', 'error');
        }
    }

    /**
     * Cambia el filtro actual del dashboard y re-renderiza la grilla.
     *
     * @param {string} filter - Nuevo filtro a aplicar
     */
    setFilter(filter) {
        this.currentFilter = filter;
        renderProjectsGrid(this.projects, this.currentFilter);
    }

    /**
     * Recarga los proyectos desde persistencia y actualiza
     * tanto la grilla como las estadísticas visibles.
     *
     * @returns {Promise<void>}
     */
    async refreshProjects() {
        await this.loadProjects();
        renderProjectsGrid(this.projects, this.currentFilter);
        updateStatsUI(this.projects);
    }

    /**
     * Renombra un proyecto existente.
     *
     * Flujo:
     * 1. Busca el proyecto localmente
     * 2. Solicita un nuevo nombre mediante prompt
     * 3. Si el nombre es válido y cambió, actualiza persistencia
     * 4. Actualiza el estado local
     * 5. Re-renderiza la grilla
     * 6. Muestra notificación
     *
     * @param {number|string} projectId - Identificador del proyecto
     * @returns {Promise<void>}
     */
    async renameProject(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;

        const newName = prompt('Nuevo nombre del proyecto', project.name);
        if (!newName || newName === project.name) return;

        try {
            await updateProject(projectId, newName, project.description);
            project.name = newName;
            renderProjectsGrid(this.projects, this.currentFilter);
            showNotification('Proyecto renombrado', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
        }
    }

    /**
     * Edita la descripción de un proyecto existente.
     *
     * Flujo:
     * 1. Busca el proyecto localmente
     * 2. Solicita la nueva descripción mediante prompt
     * 3. Si no se cancela, actualiza persistencia
     * 4. Actualiza el estado local
     * 5. Re-renderiza la grilla
     * 6. Muestra notificación
     *
     * @param {number|string} projectId - Identificador del proyecto
     * @returns {Promise<void>}
     */
    async editProjectDescription(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;

        const newDesc = prompt('Editar descripción', project.description || '');
        if (newDesc === null) return;

        try {
            await updateProject(projectId, project.name, newDesc);
            project.description = newDesc;
            renderProjectsGrid(this.projects, this.currentFilter);
            showNotification('Descripción actualizada', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
        }
    }

    /**
     * Elimina un proyecto del dashboard.
     *
     * Flujo:
     * 1. Busca el proyecto localmente
     * 2. Solicita confirmación
     * 3. Elimina el proyecto en persistencia
     * 4. Elimina el proyecto del estado local
     * 5. Re-renderiza la grilla
     * 6. Actualiza estadísticas
     * 7. Muestra notificación
     *
     * @param {number|string} projectId - Identificador del proyecto
     * @returns {Promise<void>}
     */
    async deleteProject(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project) return;

        if (!confirm(`¿Eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await deleteProjectAPI(projectId);
            this.projects = this.projects.filter(p => p.id !== projectId);
            renderProjectsGrid(this.projects, this.currentFilter);
            updateStatsUI(this.projects);
            showNotification('Proyecto eliminado', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
        }
    }
}

export const dashboard = new Dashboard();
document.addEventListener('DOMContentLoaded', async () => {
    await dashboard.init();
});