import { getSettings, saveSettings, resetSettings } from '../localStorage/settings.adapter.js';
import { eventBus } from './event-bus.js';

/**
 * SettingsManager
 *
 * Gestiona el ciclo de vida de la configuración de la aplicación:
 * - carga la configuración persistida
 * - permite leer valores individuales o completos
 * - actualiza el estado local
 * - guarda cambios
 * - reinicia la configuración
 * - sincroniza cambios entre pestañas mediante el evento "storage"
 *
 * Además, emite el evento "settings:updated" cada vez que la configuración cambia,
 * permitiendo que otros módulos reaccionen sin depender directamente de este gestor.
 */
class SettingsManager {

    /**
     * Inicializa el administrador de configuración.
     *
     * Propiedades internas:
     * - settings: estado actual de la configuración en memoria
     * - isLoading: evita cargas simultáneas
     * - isSaving: evita guardados simultáneos
     *
     * También registra un listener del evento nativo "storage" para detectar
     * cambios en localStorage realizados desde otras pestañas o ventanas.
     */
    constructor() {
        this.settings = {};
        this.isLoading = false;
        this.isSaving = false;

        /**
         * Sincroniza cambios de configuración entre pestañas.
         *
         * Cuando otra pestaña modifica la clave "settings" en localStorage,
         * este listener actualiza el estado local y notifica el cambio
         * mediante el event bus.
         */
        window.addEventListener('storage', (e) => {
            if (e.key === 'settings') {
                this.settings = JSON.parse(e.newValue);
                eventBus.emit('settings:updated', this.settings);
            }
        });
    }

    /**
     * Carga la configuración desde la capa de persistencia.
     *
     * Si ya hay una carga en progreso, devuelve el estado actual para evitar
     * ejecuciones concurrentes.
     *
     * Además, refleja el resultado en localStorage para mantener consistencia
     * con la sincronización entre pestañas.
     *
     * @returns {Promise<Object>} Configuración cargada.
     */
    async load() {
        if (this.isLoading) return this.settings;
        this.isLoading = true;
        try {
            const response = await getSettings();
            this.settings = response || {};
            localStorage.setItem('settings', JSON.stringify(this.settings));
            return this.settings;
        } catch (error) {
            this.settings = {};
            return this.settings;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Obtiene el valor de una clave específica de configuración.
     *
     * @param {string} key - Nombre de la propiedad a consultar.
     * @returns {*} Valor asociado a la clave o undefined si no existe.
     */
    get(key) {
        return this.settings[key];
    }

    /**
     * Devuelve una copia superficial de toda la configuración actual.
     *
     * Se retorna una copia para evitar modificaciones externas directas
     * sobre el estado interno.
     *
     * @returns {Object} Copia de la configuración completa.
     */
    getAll() {
        return { ...this.settings };
    }

    /**
     * Actualiza únicamente el estado local en memoria.
     *
     * No persiste cambios por sí sola; solo fusiona la nueva configuración
     * con la ya existente.
     *
     * @param {Object} newSettings - Nuevos valores de configuración.
     */
    updateLocal(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    /**
     * Guarda cambios de configuración.
     *
     * Flujo:
     * 1. Evita guardados simultáneos
     * 2. Actualiza primero el estado local
     * 3. Persiste los cambios usando el adaptador
     * 4. Sincroniza localStorage
     * 5. Emite evento de actualización
     *
     * @param {Object} newSettings - Configuración parcial a guardar.
     * @returns {Promise<Object|undefined>} Configuración actualizada.
     * @throws {*} Relanza cualquier error producido durante el guardado.
     */
    async save(newSettings) {
        if (this.isSaving) return;

        this.isSaving = true;
        try {
            this.updateLocal(newSettings);
            const response = await saveSettings(newSettings);
            this.settings = response || this.settings;
            localStorage.setItem('settings', JSON.stringify(this.settings));
            eventBus.emit('settings:updated', this.settings);
            return this.settings;
        } catch (error) {
            throw error;
        } finally {
            this.isSaving = false;
        }
    }

    /**
     * Restablece la configuración a sus valores por defecto.
     *
     * Flujo:
     * 1. Llama al adaptador de reseteo
     * 2. Actualiza el estado interno
     * 3. Sincroniza localStorage
     * 4. Emite evento de actualización
     *
     * @returns {Promise<Object>} Configuración reiniciada.
     * @throws {*} Relanza cualquier error producido durante el reinicio.
     */
    async reset() {
        try {
            const response = await resetSettings();
            this.settings = response || {};
            localStorage.setItem('settings', JSON.stringify(this.settings));
            eventBus.emit('settings:updated', this.settings);
            return this.settings;
        } catch (error) {
            throw error;
        }
    }
}

/**
 * Instancia global compartida del gestor de configuración.
 *
 * Se exporta como singleton para que toda la aplicación use
 * una única fuente de verdad para los settings.
 */
export const settingsManager = new SettingsManager();