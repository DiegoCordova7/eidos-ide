import { initFileExplorer } from './file-explorer.js';
import { initConsole } from './console.js';
import { themeEngine } from '../../core/theme-engine.js';
import { eventBus } from '../../core/event-bus.js';

let editorInstance;

document.addEventListener('DOMContentLoaded', async () => {
    const editorEl = document.getElementById('editor');

    try {
        await themeEngine.init();
    } catch (error) {
        console.warn('⚠️ Error inicializando temas:', error);
    }

    const settings = themeEngine.getAll();
    
    let theme = settings.syntaxTheme || 'eidos-dark';
    if (!theme.includes('-light') && !theme.includes('-dark')) {
        const isDark = settings.ideTheme !== 'light';
        theme = `${theme}-${isDark ? 'dark' : 'light'}`;
    }

    editorInstance = CodeMirror.fromTextArea(editorEl, {
        lineNumbers: settings?.lineNumbers ?? true,
        mode: 'eidos',
        theme: theme,
        indentUnit: settings?.tabSize || 4,
        tabSize: settings?.tabSize || 2,
        autofocus: true,
        wordWrap: settings?.wordWrap ?? true,
    });

    window.editor = editorInstance;
    const wrapper = editorInstance.getWrapperElement();
    
    setTimeout(() => {
        wrapper.className = wrapper.className.replace(/cm-s-\S+/g, '');
        wrapper.classList.add(`cm-s-${theme}`);
    }, 100);

    const fontSize = settings?.fontSize || 18;
    wrapper.style.fontSize = fontSize + 'px';
    wrapper.style.fontFamily = settings?.fontFamily || 'Consolas';
    wrapper.style.lineHeight = settings?.lineHeight || 1.6;

    const lines = wrapper.querySelector('.CodeMirror-lines');
    if (lines) lines.style.fontSize = fontSize + 'px';

    const gutters = wrapper.querySelector('.CodeMirror-gutters');
    if (gutters) {
        const lineNumbers = gutters.querySelectorAll('.CodeMirror-linenumber');
        lineNumbers.forEach(ln => ln.style.fontSize = (fontSize - 1) + 'px');
    }

    editorInstance.refresh();
    window.editorInstance = editorInstance;
    window.settings = settings;

    const params = new URLSearchParams(window.location.search);
    const projectId = parseInt(params.get('projectId'));
    if (!projectId) {
        alert('No se proporcionó projectId');
        window.location.href = 'dashboard.html';
        return;
    }

    initFileExplorer(editorInstance, projectId);
    initConsole(editorInstance);

    eventBus.on('settings:updated', () => {
        const newSettings = themeEngine.getAll();
        let newTheme = newSettings.syntaxTheme || 'eidos-dark';
        
        if (!newTheme.includes('-light') && !newTheme.includes('-dark')) {
            const isDark = newSettings.ideTheme !== 'light';
            newTheme = `${newTheme}-${isDark ? 'dark' : 'light'}`;
        }
        
        editorInstance.setOption('theme', newTheme);
        
        setTimeout(() => {
            const wrapper = editorInstance.getWrapperElement();
            wrapper.className = wrapper.className.replace(/cm-s-\S+/g, '');
            wrapper.classList.add(`cm-s-${newTheme}`);
        }, 50);
        
        themeEngine.applyEditorSettings();
    });
});

document.addEventListener('keydown', async (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();

        const fileId = window.editorInstance?.currentFileId;
        if (!fileId) return alert('Selecciona un archivo primero.');

        try {
            const content = window.editorInstance.getValue();
            await saveFile(fileId, content);
        } catch (err) {
            alert('Error guardando archivo: ' + (err.message || err));
        }
    }
});