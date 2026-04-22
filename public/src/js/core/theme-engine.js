import { getSettings } from '../localstorage/settings.adapter.js';
import { eventBus } from './event-bus.js';

/**
 * ThemeEngine
 *
 * Motor encargado de aplicar a la interfaz los ajustes visuales y editoriales
 * definidos en la configuración del usuario.
 *
 * Responsabilidades principales:
 * - cargar settings iniciales
 * - aplicar tema global de la aplicación
 * - aplicar color de acento
 * - aplicar configuración del editor (fuente, tamaño, line-height, tab size, etc.)
 * - actualizar dinámicamente la UI cuando cambian los settings
 * - establecer valores por defecto si la carga falla
 *
 * Actúa como una capa de sincronización entre:
 *   configuración persistida -> DOM / CSS / CodeMirror / flags globales
 */
class ThemeEngine {
    constructor() {
        this.settings = null;
        this.initialized = false;
        
        this.defaultAccents = {
            dark: '#0e639c',
            light: '#0d6efd',
            auto: '#0e639c'
        };
    }
    
    /**
     * Inicializa el motor.
     *
     * Flujo:
     * 1. Evita re-inicializar si ya se ejecutó antes
     * 2. Carga settings desde persistencia
     * 3. Aplica configuración global
     * 4. Aplica configuración específica del editor
     * 5. Se suscribe al evento de actualización de settings
     *
     * Si ocurre un error durante la carga, aplica un tema por defecto.
     *
     * @returns {Promise<Object|undefined>} Settings cargados
     * @throws {*} Relanza el error luego de aplicar el tema por defecto
     */
    async init() {        
        if (this.initialized) {
            return;
        }

        try {
            this.settings = await getSettings();
            
            this.applyGlobalSettings();
            this.applyEditorSettings();
            this.initialized = true;
            
            eventBus.on('settings:updated', () => {
                this.applyGlobalSettings();
                this.applyEditorSettings();
            });
            
            return this.settings;
        } catch (error) {
            this.applyDefaultTheme();
            throw error;
        }
    }

    /**
     * Aplica la configuración visual global de la aplicación.
     *
     * Esto incluye:
     * - tema base de la UI (dark / light / auto)
     * - color de acento
     *
     * El color de acento puede provenir del usuario o, si no existe,
     * de un valor por defecto según el tema seleccionado.
     */
    applyGlobalSettings() {
        if (!this.settings) {
            return;
        }
        
        const html = document.documentElement;
        const body = document.body;

        if (this.settings.ideTheme) {
            body.setAttribute('data-theme', this.settings.ideTheme);
        }

        const userAccent = this.settings.accentColor;
        const defaultAccent = this.getDefaultAccent(this.settings.ideTheme);
        const accentColor = userAccent || defaultAccent;
        
        this.applyAccentColor(accentColor);
    }

    /**
     * Devuelve el color de acento por defecto según el tema.
     *
     * @param {string} theme - Tema actual
     * @returns {string} Color hexadecimal por defecto
     */
    getDefaultAccent(theme) {
        const accent = this.defaultAccents[theme] || this.defaultAccents.dark;
        return accent;
    }

    /**
     * Aplica el color de acento al documento.
     *
     * Define variables CSS:
     * - --accent
     * - --accent-light
     * - --accent-hover
     *
     * Si ya existe un color de acento personalizado distinto de los
     * defaults conocidos, no lo sobrescribe.
     *
     * @param {string} color - Color en formato hexadecimal (#RRGGBB)
     */
    applyAccentColor(color) {
        const html = document.documentElement;
        const rgb = this.hexToRgb(color);
        
        const currentAccent = getComputedStyle(html).getPropertyValue('--accent')?.trim();
        
        if (currentAccent && 
            currentAccent !== '#0e639c' && 
            currentAccent !== '#0d6efd' &&
            currentAccent !== '') {
            return;
        }
        
        html.style.setProperty('--accent', color);
        html.style.setProperty('--accent-light', `rgba(${rgb}, 0.15)`);
        html.style.setProperty('--accent-hover', `rgba(${rgb}, 0.25)`);
    }

    /**
     * Aplica la configuración específica del editor y de la experiencia de uso.
     *
     * Incluye:
     * - tamaño de fuente
     * - familia tipográfica
     * - line-height
     * - visibilidad de números de línea
     * - word wrap
     * - tamaño de tabulación
     * - altura de consola
     * - tema de sintaxis
     * - flags globales de comportamiento
     */
    applyEditorSettings() {
        if (!this.settings) return;

        const body = document.body;

        if (this.settings.fontSize) {
            this.removeClasses(body, 'font-size-');
            body.classList.add(`font-size-${this.settings.fontSize}`);
        }

        if (this.settings.fontFamily) {
            const fontClass = this.normalizeFontFamily(this.settings.fontFamily);
            this.removeClasses(body, 'font-family-');
            body.classList.add(`font-family-${fontClass}`);
        }

        if (this.settings.lineHeight) {
            const lineHeightClass = this.normalizeLineHeight(this.settings.lineHeight);
            this.removeClasses(body, 'line-height-');
            body.classList.add(`line-height-${lineHeightClass}`);
        }

        body.classList.toggle('hide-line-numbers', this.settings.lineNumbers === false);
        body.classList.toggle('no-word-wrap', this.settings.wordWrap === false);

        if (this.settings.tabSize) {
            this.removeClasses(body, 'tab-size-');
            body.classList.add(`tab-size-${this.settings.tabSize}`);
        }

        if (this.settings.consoleHeight) {
            const consoleClass = this.normalizeConsoleHeight(this.settings.consoleHeight);
            this.removeClasses(body, 'console-height-');
            body.classList.add(`console-height-${consoleClass}`);
        }

        if (this.settings.syntaxTheme) {
            let syntaxTheme = this.settings.syntaxTheme;
            
            if (!syntaxTheme.includes('-light') && !syntaxTheme.includes('-dark')) {
                const isDark = this.settings.ideTheme !== 'light';
                syntaxTheme = `${syntaxTheme}-${isDark ? 'dark' : 'light'}`;
            }
            
            body.setAttribute('data-syntax-theme', syntaxTheme);
            
            const editor = document.querySelector('.CodeMirror');
            if (editor) {
                this.updateCodeMirrorTheme(editor, syntaxTheme);
            }
            
            if (window.editor?.setOption) {
                window.editor.setOption('theme', syntaxTheme);
            }
        }

        window.AUTO_SAVE_ENABLED = this.settings.autoSave ?? true;
        window.CLEAR_CONSOLE_ON_RUN = this.settings.clearConsole ?? true;
        window.AUTO_COMPLETE_ENABLED = this.settings.autoComplete ?? true;
        window.HARDWARE_ACCEL_ENABLED = this.settings.hardwareAccel ?? true;
    }

    updateCodeMirrorTheme(editor, themeName) {
        const themeClasses = Array.from(editor.classList).filter(cls => cls.startsWith('cm-s-'));
        themeClasses.forEach(cls => editor.classList.remove(cls));
        editor.classList.add(`cm-s-${themeName}`);
    }

    /**
     * Reemplaza las clases de tema de CodeMirror por la clase correspondiente
     * al nuevo tema.
     *
     * @param {HTMLElement} editor - Nodo raíz del editor CodeMirror
     * @param {string} themeName - Nombre del tema a aplicar
     */
    applyDefaultTheme() {
        const body = document.body;
                
        body.setAttribute('data-theme', 'dark');
        body.setAttribute('data-syntax-theme', 'eidos-dark');
        body.style.zoom = '1.0';
        this.applyAccentColor(this.defaultAccents.dark);
        
        body.classList.add(
            'font-size-14',
            'font-family-jetbrains',
            'line-height-1-6',
            'tab-size-4',
            'console-height-30'
        );
    }

    /**
     * Elimina del elemento todas las clases cuyo prefijo coincida con el indicado.
     *
     * Esto permite reemplazar clases mutuamente excluyentes como:
     * - font-size-*
     * - font-family-*
     * - line-height-*
     *
     * @param {HTMLElement} element - Elemento a limpiar
     * @param {string} prefix - Prefijo de las clases a eliminar
     */
    removeClasses(element, prefix) {
        Array.from(element.classList)
            .filter(cls => cls.startsWith(prefix))
            .forEach(cls => element.classList.remove(cls));
    }

    /**
     * Normaliza nombres de fuentes a nombres de clase CSS internos.
     *
     * @param {string} fontFamily - Nombre original de la fuente
     * @returns {string} Nombre normalizado para clases CSS
     */
    normalizeFontFamily(fontFamily) {
        const map = {
            'JetBrains Mono': 'jetbrains',
            'jetbrains': 'jetbrains',
            'Fira Code': 'firacode',
            'firacode': 'firacode',
            'Consolas': 'consolas',
            'consolas': 'consolas',
            'Monaco': 'monaco',
            'monaco': 'monaco',
            'Source Code Pro': 'sourcecodepro',
            'sourcecodepro': 'sourcecodepro'
        };
        return map[fontFamily] || 'jetbrains';
    }

    /**
     * Convierte un valor de interlineado numérico a una clase CSS predefinida.
     *
     * @param {number|string} lineHeight - Valor de line-height
     * @returns {string} Sufijo de clase normalizado
     */
    normalizeLineHeight(lineHeight) {
        const lh = parseFloat(lineHeight);
        if (lh <= 1.3) return '1-2';
        if (lh <= 1.5) return '1-4';
        if (lh <= 1.7) return '1-6';
        if (lh <= 1.9) return '1-8';
        return '2-0';
    }

    /**
     * Convierte una altura de consola a una clase CSS predefinida.
     *
     * @param {number|string} height - Altura configurada
     * @returns {string} Sufijo de clase normalizado
     */
    normalizeConsoleHeight(height) {
        const h = parseInt(height);
        if (h <= 22) return '20';
        if (h <= 27) return '25';
        if (h <= 35) return '30';
        if (h <= 45) return '40';
        return '50';
    }

    /**
     * Convierte un color hexadecimal a formato RGB.
     *
     * Ejemplo:
     * "#0e639c" -> "14, 99, 156"
     *
     * @param {string} hex - Color hexadecimal
     * @returns {string} Valor RGB en formato "r, g, b"
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : '0, 0, 0';
    }

    /**
     * Obtiene un valor específico de la configuración cargada.
     *
     * @param {string} key - Clave a consultar
     * @param {*} defaultValue - Valor por defecto si la clave no existe
     * @returns {*} Valor encontrado o valor por defecto
     */
    get(key, defaultValue = null) {
        return this.settings?.[key] ?? defaultValue;
    }

    /**
     * Devuelve una copia superficial de todos los settings actuales.
     *
     * @returns {Object} Copia de la configuración actual
     */
    getAll() {
        return this.settings ? { ...this.settings } : {};
    }

    /**
     * Indica si el motor ya fue inicializado.
     *
     * @returns {boolean}
     */
    isInitialized() {
        return this.initialized;
    }
}

export const themeEngine = new ThemeEngine();