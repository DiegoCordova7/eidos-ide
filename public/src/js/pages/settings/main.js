/**
 * Módulo de configuración de la interfaz.
 *
 * Este script controla la página de settings de la aplicación.
 * Sus responsabilidades incluyen:
 * - cargar la configuración actual desde SettingsManager
 * - reflejar esa configuración en los controles del DOM
 * - aplicar cambios visuales inmediatos (como color de acento o tema)
 * - registrar listeners de interacción
 * - guardar o restaurar configuraciones
 * - mostrar notificaciones al usuario
 * - reaccionar a cambios globales mediante eventBus
 */

import { settingsManager } from '../../core/settings-manager.js';
import { eventBus } from '../../core/event-bus.js';

/**
 * Inicializa la página de configuración cuando el DOM está listo.
 *
 * Flujo:
 * 1. Carga settings persistidos
 * 2. Los inserta en la UI
 * 3. Aplica estilos visuales derivados
 * 4. Registra todos los listeners de interacción
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await settingsManager.load();
        loadSettingsIntoUI();
        applySettingsCSS();
        setupAllListeners();
    } catch (error) {}
});

/**
 * Carga la configuración actual en los controles de la interfaz.
 *
 * Sincroniza:
 * - selects
 * - sliders
 * - toggles
 * - color picker
 * - tema general de la página
 *
 * La información se obtiene desde SettingsManager.
 */
function loadSettingsIntoUI() {
    const s = settingsManager.getAll();

    const ideTheme = document.getElementById('ideTheme');
    if (ideTheme && s.ideTheme) {
        ideTheme.value = s.ideTheme;

        if (s.ideTheme === 'light') {
            document.body.setAttribute('data-theme', 'light');
        } else {
            document.body.removeAttribute('data-theme');
        }
    }
    
    const fontFamily = document.getElementById('fontFamily');
    if (fontFamily && s.fontFamily) fontFamily.value = s.fontFamily;
    
    const syntaxTheme = document.getElementById('syntaxTheme');
    if (syntaxTheme && s.syntaxTheme) syntaxTheme.value = s.syntaxTheme;
    
    const tabSize = document.getElementById('tabSize');
    if (tabSize && s.tabSize) tabSize.value = s.tabSize;
    
    /**
     * Carga sliders numéricos y actualiza su texto visible.
     */
    ['fontSize', 'lineHeight', 'zoomLevel', 'consoleHeight'].forEach(id => {
        const el = document.getElementById(id);

        if (el && s[id] !== undefined) {
            el.value = s[id];
            updateSliderDisplay(el);
        }
    });
    
    /**
     * Activa toggles booleanos si el valor correspondiente es true.
     */
    ['autoSave', 'lineNumbers', 'wordWrap', 'autoComplete', 'hwAcceleration', 'clearConsole'].forEach(id => {
        const el = document.getElementById(id);

        if (el && s[id]) {
            el.classList.add('active');
        }
    });
    
    /**
     * Marca visualmente el color de acento activo.
     */
    if (s.accentColor) {
        document.querySelectorAll('.settings-color-option').forEach(el => el.classList.remove('active'));

        const colorEl = document.querySelector(`[data-color="${s.accentColor}"]`);
        if (colorEl) colorEl.classList.add('active');
    }
}

/**
 * Aplica al documento los estilos CSS derivados de la configuración.
 *
 * Actualmente aplica:
 * - color de acento
 * - variante clara del color de acento
 */
function applySettingsCSS() {
    const s = settingsManager.getAll();
    
    if (s.accentColor) {
        document.documentElement.style.setProperty('--accent', s.accentColor);

        const rgb = hexToRgb(s.accentColor);
        document.documentElement.style.setProperty('--accent-light', `rgba(${rgb}, 0.15)`);
    }
}

/**
 * Registra todos los listeners de interacción de la página de configuración.
 *
 * Incluye:
 * - navegación lateral entre secciones
 * - actualización visual de sliders
 * - cambio de tema
 * - toggles
 * - selector de color
 * - botones de guardar, resetear, cerrar y cancelar
 */
function setupAllListeners() {
    /**
     * Navegación entre secciones de settings.
     */
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);
        });
    });
    
    /**
     * Actualización visual en tiempo real de sliders.
     */
    document.querySelectorAll('.settings-slider').forEach(slider => {
        slider.addEventListener('input', () => updateSliderDisplay(slider));
    });

    /**
     * Cambio de tema visual inmediato en la página.
     */
    const ideThemeSelect = document.getElementById('ideTheme');
    if (ideThemeSelect) {
        ideThemeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;

            if (theme === 'light') {
                document.body.setAttribute('data-theme', 'light');
            } else {
                document.body.removeAttribute('data-theme');
            }
        });
    }
    
    /**
     * Listener reservado para selects generales.
     * Actualmente no ejecuta lógica adicional.
     */
    document.querySelectorAll('.settings-select').forEach(select => {
        select.addEventListener('change', (e) => {
        });
    });
    
    /**
     * Toggles visuales de configuración booleana.
     */
    document.querySelectorAll('.settings-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => toggle.classList.toggle('active'));
    });
    
    /**
     * Selector de color de acento.
     *
     * Aplica cambios visuales inmediatos y actualiza el estado local
     * del SettingsManager sin guardar todavía.
     */
    document.querySelectorAll('.settings-color-option').forEach(option => {
        option.addEventListener('click', () => {
            const color = option.dataset.color;
            
            document.querySelectorAll('.settings-color-option').forEach(el => {
                el.classList.remove('active');
            });
            
            option.classList.add('active');
            
            document.documentElement.style.setProperty('--accent', color);

            const rgb = hexToRgb(color);
            document.documentElement.style.setProperty('--accent-light', `rgba(${rgb}, 0.15)`);
            
            settingsManager.updateLocal({ accentColor: color });
        });
    });
    
    /**
     * Botón guardar cambios.
     */
    const btnSave = document.getElementById('btnSaveSettings');
    if (btnSave) btnSave.addEventListener('click', handleSave);
    
    /**
     * Botón restaurar valores predeterminados.
     */
    const btnReset = document.getElementById('btnResetSettings');
    if (btnReset) btnReset.addEventListener('click', handleReset);
    
    /**
     * Botón cerrar.
     */
    const btnClose = document.getElementById('btnCloseSettings');
    if (btnClose) btnClose.addEventListener('click', () => window.history.back());
    
    /**
     * Botón cancelar.
     */
    const btnCancel = document.getElementById('btnCancelSettings');
    if (btnCancel) btnCancel.addEventListener('click', () => window.history.back());
}

/**
 * Guarda la configuración actual tomada desde la interfaz.
 *
 * Flujo:
 * 1. Desactiva temporalmente el botón de guardado
 * 2. Construye el objeto newSettings a partir de la UI
 * 3. Llama a settingsManager.save(...)
 * 4. Muestra notificación de éxito o error
 * 5. Restaura el estado visual del botón
 *
 * @returns {Promise<void>}
 */
async function handleSave() {
    const btn = document.getElementById('btnSaveSettings');
    btn.disabled = true;
    btn.textContent = '💾 Guardando...';
    
    try {
        const newSettings = {
            ideTheme: document.getElementById('ideTheme')?.value,
            fontFamily: document.getElementById('fontFamily')?.value,
            syntaxTheme: document.getElementById('syntaxTheme')?.value,
            tabSize: parseInt(document.getElementById('tabSize')?.value || 4),
            fontSize: parseInt(document.getElementById('fontSize')?.value || 14),
            lineHeight: parseFloat(document.getElementById('lineHeight')?.value || 1.6),
            zoomLevel: parseInt(document.getElementById('zoomLevel')?.value || 100),
            consoleHeight: parseInt(document.getElementById('consoleHeight')?.value || 30),
            autoSave: document.getElementById('autoSave')?.classList.contains('active') || false,
            lineNumbers: document.getElementById('lineNumbers')?.classList.contains('active') || false,
            wordWrap: document.getElementById('wordWrap')?.classList.contains('active') || false,
            autoComplete: document.getElementById('autoComplete')?.classList.contains('active') || false,
            hwAcceleration: document.getElementById('hwAcceleration')?.classList.contains('active') || false,
            clearConsole: document.getElementById('clearConsole')?.classList.contains('active') || false,
            accentColor: document.querySelector('.settings-color-option.active')?.dataset.color
        };
        
        await settingsManager.save(newSettings);
        
        showNotification('✅ Guardado', 'success');
        setTimeout(() => window.history.back(), 500);
        
    } catch (error) {
        showNotification('❌ Error', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Guardar cambios';
    }
}

/**
 * Restaura la configuración a valores predeterminados.
 *
 * Flujo:
 * 1. Solicita confirmación al usuario
 * 2. Ejecuta settingsManager.reset()
 * 3. Muestra notificación
 * 4. Recarga la página para reflejar cambios
 *
 * @returns {Promise<void>}
 */
async function handleReset() {
    if (!confirm('¿Restaurar valores predeterminados?')) return;
    
    try {
        await settingsManager.reset();
        showNotification('✅ Restaurado', 'success');
        setTimeout(() => location.reload(), 500);
    } catch (error) {
        showNotification('❌ Error', 'error');
    }
}

/**
 * Cambia la sección visible de la página de configuración.
 *
 * También actualiza el estado activo del menú lateral.
 *
 * @param {string} name - Nombre lógico de la sección a mostrar
 */
function switchSection(name) {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === name);
    });

    document.querySelectorAll('.settings-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `section-${name}`);
    });
}

/**
 * Actualiza el valor visual mostrado junto a un slider y
 * ajusta una variable CSS interna para el progreso visual.
 *
 * Casos soportados:
 * - zoom -> %
 * - fontSize -> px
 * - lineHeight -> valor simple
 * - consoleHeight -> %
 *
 * @param {HTMLInputElement} slider - Slider a actualizar
 */
function updateSliderDisplay(slider) {
    const value = slider.value;
    const displayId = slider.id + 'Value';
    const display = document.getElementById(displayId);
    
    if (display) {
        if (slider.id.includes('zoom')) display.textContent = value + '%';
        else if (slider.id.includes('fontSize')) display.textContent = value + 'px';
        else if (slider.id.includes('lineHeight')) display.textContent = value;
        else if (slider.id.includes('consoleHeight')) display.textContent = value + '%';
    }
    
    const pct = (value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty('--value', pct + '%');
}

/**
 * Convierte un color hexadecimal a formato RGB.
 *
 * Ejemplo:
 * "#0e639c" -> "14, 99, 156"
 *
 * @param {string} hex - Color hexadecimal
 * @returns {string} RGB en formato "r, g, b"
 */
function hexToRgb(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!match) return '0, 0, 0';

    return `${parseInt(match[1], 16)}, ${parseInt(match[2], 16)}, ${parseInt(match[3], 16)}`;
}

/**
 * Muestra una notificación temporal en pantalla.
 *
 * Si el contenedor no existe, lo crea dinámicamente.
 *
 * @param {string} msg - Mensaje a mostrar
 * @param {string} [type='success'] - Tipo visual de notificación
 */
function showNotification(msg, type = 'success') {
    let n = document.getElementById('notification');

    if (!n) {
        n = document.createElement('div');
        n.id = 'notification';
        document.body.appendChild(n);
    }

    n.textContent = msg;
    n.className = `notification ${type} show`;

    setTimeout(() => n.classList.remove('show'), 3000);
}

/**
 * Observa cambios globales de configuración.
 *
 * Cuando otra parte del sistema emite `settings:updated`,
 * la página vuelve a cargar settings en la UI y reaplica
 * los estilos visuales correspondientes.
 */
eventBus.on('settings:updated', () => {
    loadSettingsIntoUI();
    applySettingsCSS();
});