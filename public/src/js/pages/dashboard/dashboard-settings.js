import { eventBus } from '../../core/event-bus.js';

/**
 * Inicializa el observador de configuración (settings) para la interfaz.
 *
 * Responsabilidad:
 * - Escuchar cambios en la configuración global del sistema
 * - Aplicar dinámicamente los cambios al DOM mediante variables CSS
 *
 * Este observer se suscribe al evento:
 *   'settings:updated'
 *
 * El evento debe emitir un objeto `settings` con las propiedades actualizadas.
 *
 * Efectos aplicados:
 * - Color de acento (--accent)
 * - Nivel de zoom (--zoom-level)
 * - Fuente (--font-family)
 * - Tamaño de fuente (--font-size)
 */
export function initSettingsObserver() {
    eventBus.on('settings:updated', (settings) => {

        /**
         * Aplica el color de acento si está definido.
         * Se usa como variable CSS global.
         */
        if (settings.accentColor) {
            document.documentElement.style.setProperty('--accent', settings.accentColor);
        }

        /**
         * Aplica el nivel de zoom.
         * Se espera un valor entero (ej: 100 = 100%).
         * Se convierte a escala (1.0 = 100%).
         */
        if (settings.zoomLevel) {
            document.documentElement.style.setProperty('--zoom-level', settings.zoomLevel / 100);
        }

        /**
         * Aplica la familia de fuente global.
         */
        if (settings.fontFamily) {
            document.documentElement.style.setProperty('--font-family', settings.fontFamily);
        }

        /**
         * Aplica el tamaño de fuente en píxeles.
         */
        if (settings.fontSize) {
            document.documentElement.style.setProperty('--font-size', settings.fontSize + 'px');
        }
    });
}