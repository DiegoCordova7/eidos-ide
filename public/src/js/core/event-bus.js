/**
 * EventBus - Implementación simple del patrón Pub/Sub (Publish/Subscribe).
 *
 * Permite registrar eventos, suscribirse a ellos y emitir datos a múltiples
 * listeners de forma desacoplada.
 *
 * Uso típico:
 * - Componentes emiten eventos
 * - Otros componentes reaccionan sin depender directamente entre sí
 */
class EventBus {

    /**
     * Inicializa el contenedor de eventos.
     *
     * Estructura interna:
     * {
     *   eventName: [callback1, callback2, ...]
     * }
     */
    constructor() {
        this.events = {};
    }

    /**
     * Suscribe un callback a un evento.
     *
     * @param {string} event - Nombre del evento.
     * @param {Function} callback - Función a ejecutar cuando el evento se emite.
     * @returns {Function} Función para cancelar la suscripción (unsubscribe).
     *
     * Ejemplo:
     * const unsubscribe = eventBus.on("data", (d) => console.log(d));
     * unsubscribe(); // deja de escuchar
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        this.events[event].push(callback);
        
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }

    /**
     * Suscribe un callback que se ejecuta solo una vez.
     *
     * Después de ejecutarse, se elimina automáticamente.
     *
     * @param {string} event - Nombre del evento.
     * @param {Function} callback - Función a ejecutar una sola vez.
     *
     * Ejemplo:
     * eventBus.once("ready", () => console.log("Solo una vez"));
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (data) => {
            callback(data);
            unsubscribe();
        });
    }

    /**
     * Emite un evento y ejecuta todos los callbacks asociados.
     *
     * @param {string} event - Nombre del evento.
     * @param {*} data - Datos que se enviarán a los callbacks.
     *
     * Ejemplo:
     * eventBus.emit("data", { value: 42 });
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error en evento "${event}":`, error);
                }
            });
        }
    }

    /**
     * Elimina todos los listeners de un evento.
     *
     * @param {string} event - Nombre del evento.
     *
     * Nota:
     * No elimina un callback específico, elimina todos.
     */
    off(event) {
        if (this.events[event]) {
            delete this.events[event];
        }
    }
}

/**
 * Instancia global del EventBus.
 *
 * Se exporta como singleton para que toda la aplicación
 * comparta el mismo sistema de eventos.
 */
export const eventBus = new EventBus();