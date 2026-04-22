import { settingsManager } from './settings-manager.js';
import { eventBus } from './event-bus.js';

/**
 * SettingsSync
 *
 * Sincroniza los settings de la aplicación con el DOM.
 *
 * Responsabilidades:
 * - Cargar settings iniciales (desde localStorage o desde el manager)
 * - Aplicar cambios visuales (tema, colores, fuentes, zoom, etc.)
 * - Escuchar actualizaciones de settings y reflejarlas en la UI
 *
 * Actúa como puente entre:
 *   Estado (settingsManager)
 *   → Eventos (eventBus)
 *   → UI (DOM / CSS variables)
 */
export class SettingsSync {
    constructor() {
        this.init();
    }

    /**
     * Inicializa la sincronización de settings.
     *
     * Flujo:
     * 1. Intenta cargar desde localStorage (rápido, sin async)
     * 2. Si no hay datos, carga desde settingsManager (async)
     * 3. Aplica settings iniciales
     * 4. Se suscribe a cambios mediante eventBus
     */
    async init() {
        const saved = JSON.parse(localStorage.getItem('settings'));
        if (saved) {
            this.applySettings(saved);
        } else {
            const loaded = await settingsManager.load();
            this.applySettings(loaded);
        }

        eventBus.on('settings:updated', (settings) => {
            this.applySettings(settings);
        });

    }

    /**
     * Aplica múltiples settings al DOM.
     *
     * Solo ejecuta los métodos correspondientes si la propiedad existe.
     *
     * @param {Object} s - Objeto de configuración
     */
    applySettings(s) {
        if (!s) return;
        if (s.accentColor) this.applyAccentColor(s.accentColor);
        if (s.ideTheme) this.applyTheme(s.ideTheme);
        if (s.zoomLevel) this.applyZoom(s.zoomLevel);
        if (s.fontFamily) this.applyFontFamily(s.fontFamily);
        if (s.fontSize) this.applyFontSize(s.fontSize);
    }

    /**
     * Aplica el color de acento.
     *
     * Define variables CSS:
     * --accent
     * --accent-light (versión con transparencia)
     *
     * @param {string} color - Color en formato hex (#RRGGBB)
     */
    applyAccentColor(color) {
        const rgb = this.hexToRgb(color);
        document.documentElement.style.setProperty('--accent', color);
        document.documentElement.style.setProperty('--accent-light', `rgba(${rgb}, 0.15)`);
    }

/**
     * Aplica el tema visual (dark / light).
     *
     * Utiliza clases en el body:
     * - dark-theme
     * - light-theme
     *
     * @param {string} theme - 'dark' o 'light'
     */
    applyTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme === 'light');
    }

    /**
     * Aplica el nivel de zoom.
     *
     * Usa una variable CSS para escalar la UI.
     *
     * @param {number} zoom - Nivel de zoom (ej: 100, 125, 150)
     */
    applyZoom(zoom) {
        document.documentElement.style.setProperty('--zoom-level', zoom / 100);
    }

    /**
     * Aplica la familia de fuente global.
     *
     * @param {string} font - Nombre de la fuente
     */
    applyFontFamily(font) {
        document.documentElement.style.setProperty('--font-family', font);
    }

    /**
     * Aplica el tamaño de fuente global.
     *
     * @param {number} size - Tamaño en píxeles
     */
    applyFontSize(size) {
        document.documentElement.style.setProperty('--font-size', size + 'px');
    }

    /**
     * Convierte un color hexadecimal a formato RGB.
     *
     * Ejemplo:
     * "#FF0000" → "255, 0, 0"
     *
     * @param {string} hex - Color en formato hex
     * @returns {string} RGB en formato "r, g, b"
     */
    hexToRgb(hex) {
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!match) return '0, 0, 0';
        return `${parseInt(match[1], 16)}, ${parseInt(match[2], 16)}, ${parseInt(match[3], 16)}`;
    }
}