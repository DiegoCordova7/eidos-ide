import { dashboard } from './dashboard.js';

/**
 * Renderiza la cuadrícula de proyectos en el dashboard.
 *
 * Responsabilidades:
 * - aplicar filtro visual a la lista de proyectos
 * - actualizar contadores visibles
 * - mostrar estado vacío si no hay proyectos
 * - generar el HTML de cada tarjeta
 * - registrar eventos de interacción por tarjeta
 *
 * Filtros soportados:
 * - 'recent': muestra los 5 proyectos más recientes
 * - 'favorites': muestra solo proyectos marcados como favoritos
 * - cualquier otro valor: muestra todos
 *
 * @param {Array<Object>} projects - Lista de proyectos a renderizar
 * @param {string} filter - Filtro activo del dashboard
 */
export function renderProjectsGrid(projects, filter) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    let filtered = [...projects];

    if (filter === 'recent') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        filtered = filtered.slice(0, 5);
    }
    else if (filter === 'favorites') {
        filtered = filtered.filter(p => p.favorite);
    }

    const projectCountEl = document.getElementById('totalProjects');
    if (projectCountEl) {
        projectCountEl.textContent = filtered.length;
    }

    const visibleCountEl = document.getElementById('visibleProjectCount');
    if (visibleCountEl) {
        const plural = filtered.length !== 1 ? 'proyectos' : 'proyecto';
        visibleCountEl.textContent = `${filtered.length} ${plural}`;
    }

    if (filtered.length === 0) {
        grid.style.display = 'none';
        document.getElementById('emptyState')?.classList.add('active');
        return;
    }

    grid.style.display = 'grid';
    document.getElementById('emptyState')?.classList.remove('active');
    grid.innerHTML = filtered.map(renderProjectCard).join('');
    grid.querySelectorAll('.project-card').forEach(card => {
        const projectId = card.dataset.projectId;
        const menuBtn = card.querySelector('.project-menu-btn');
        const menu = card.querySelector('.project-menu');

        menuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();

            document.querySelectorAll('.project-menu').forEach(m => {
                if (m !== menu) m.classList.remove('active');
            });

            menu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            menu.classList.remove('active');
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('.project-menu')) return;
            window.location.href = `ide.html?projectId=${projectId}`;
        });

        card.querySelector('.rename-project-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            dashboard.renameProject(projectId);
        });

        card.querySelector('.edit-desc-project-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            dashboard.editProjectDescription(projectId);
        });

        card.querySelector('.delete-project-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            dashboard.deleteProject(projectId);
        });
    });
}

/**
 * Genera el HTML de una tarjeta individual de proyecto.
 *
 * Incluye:
 * - icono
 * - nombre
 * - descripción
 * - menú contextual
 * - fecha formateada
 * - cantidad de archivos
 *
 * El contenido textual se sanitiza con escapeHtml para evitar inyección HTML.
 *
 * @param {Object} project - Proyecto a renderizar
 * @returns {string} HTML de la tarjeta
 */
export function renderProjectCard(project) {
    const date = new Date(project.created_at);
    const formattedDate = formatDate(date);
    const fileCount = project.fileCount || 0;

    return `
    <div class="project-card" data-project-id="${project.id}">
        <div class="project-header">
            <div class="project-icon">📁</div>
            <button class="project-menu-btn">⋮</button>
            <div class="project-menu floating">
                <button class="rename-project-btn">Renombrar</button>
                <button class="edit-desc-project-btn">Editar descripción</button>
                <button class="delete-project-btn">Eliminar</button>
            </div>
        </div>
        <div class="project-name">${escapeHtml(project.name)}</div>
        <div class="project-description">${project.description ? escapeHtml(project.description) : 'Sin descripción'}</div>
        <div class="project-footer">
            <div class="project-date">${formattedDate}</div>
            <div class="project-files">${fileCount} archivo${fileCount !== 1 ? 's' : ''}</div>
        </div>
    </div>`;
}

/**
 * Actualiza los indicadores de estadísticas del dashboard.
 *
 * Calcula:
 * - total de proyectos
 * - total de archivos
 * - fecha más reciente de creación
 *
 * Si no existen proyectos, muestra "Nunca" como fecha reciente.
 *
 * @param {Array<Object>} projects - Lista de proyectos a resumir
 */
export function updateStatsUI(projects) {
    const totalProjectsEl = document.getElementById('totalProjects');
    const totalFilesEl = document.getElementById('totalFiles');
    const recentDateEl = document.getElementById('recentDate');

    const totalProjects = projects.length;
    const totalFiles = projects.reduce((sum, p) => sum + (p.fileCount || 0), 0);

    let recentDate = 'Nunca';
    if (projects.length > 0) {
        const dates = projects.map(p => new Date(p.created_at));
        const mostRecent = new Date(Math.max(...dates));
        recentDate = formatDate(mostRecent);
    }

    if (totalProjectsEl) {
        totalProjectsEl.textContent = `${totalProjects}`;
    }

    if (totalFilesEl) {
        totalFilesEl.textContent = `${totalFiles}`;
    }

    if (recentDateEl) {
        recentDateEl.textContent = recentDate;
    }
}

/**
 * Muestra una notificación simple al usuario usando alert().
 *
 * Tipos soportados:
 * - 'error'
 * - 'success'
 * - 'info' (por defecto)
 *
 * Nota:
 * Esta implementación es básica y puede reemplazarse en el futuro
 * por un sistema visual más avanzado (toast, snackbar, modal, etc.).
 *
 * @param {string} msg - Mensaje a mostrar
 * @param {string} [type='info'] - Tipo de notificación
 */
export function showNotification(msg, type = 'info') {
    if (type === 'error') {
        alert('❌ ' + msg);
    } else if (type === 'success') {
        alert('✅ ' + msg);
    } else {
        alert('ℹ️ ' + msg);
    }
}

/**
 * Escapa caracteres HTML peligrosos en un texto.
 *
 * Se usa para prevenir inyección de HTML al insertar contenido
 * dinámico dentro del render de tarjetas.
 *
 * @param {string} text - Texto a sanitizar
 * @returns {string} Texto escapado de forma segura
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Formatea una fecha en formato relativo amigable para la UI.
 *
 * Reglas:
 * - 0 días: "Hoy"
 * - 1 día: "Ayer"
 * - menos de 7 días: "Hace N días"
 * - menos de 30 días: "Hace N semanas"
 * - menos de 365 días: "Hace N meses"
 * - más antiguo: fecha absoluta en formato local
 *
 * @param {Date} date - Fecha a formatear
 * @returns {string} Texto formateado
 */
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}