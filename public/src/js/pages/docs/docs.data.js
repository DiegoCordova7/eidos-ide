/**
 * DOCS_DATA
 *
 * Estructura de datos que define el contenido de la página principal
 * de documentación de Eidos.
 *
 * Este objeto actúa como fuente central de información para renderizar:
 * - secciones principales
 * - tarjetas de navegación
 * - ejemplos de código
 * - categorías del lenguaje
 *
 * Cada sección representa un bloque visual dentro de la UI de documentación.
 *
 * Estructura general:
 * {
 *   sectionKey: {
 *     icon: string,
 *     title: string,
 *     type?: string,
 *     cards: Array<Card>
 *   }
 * }
 *
 * Donde cada Card puede contener:
 * - icon: string (emoji o ícono visual)
 * - title: string (título de la tarjeta)
 * - desc: string (descripción breve)
 * - url: string (ruta interna de navegación)
 * - badges?: string[] (etiquetas informativas)
 * - color?: string (color visual para UI)
 * - code?: string (snippet de código)
 * - badge?: string (nivel o categoría del ejemplo)
 */
const DOCS_DATA = {

  /**
   * Sección: Primeros Pasos
   *
   * Contiene los recursos iniciales para comenzar con el lenguaje:
   * - introducción
   * - instalación
   * - primer programa
   */
  gettingStarted: {
    icon: '🚀',
    title: 'Primeros Pasos',
    cards: [
      {
        icon: '📖',
        title: 'Introducción',
        desc: 'Conoce Eidos y su filosofía multiparadigma',
        url: 'introduction'
      },
      {
        icon: '⚙️',
        title: 'Instalación',
        desc: 'Configura tu entorno de desarrollo',
        url: 'installation'
      },
      {
        icon: '✨',
        title: 'Tu Primer Programa',
        desc: 'Escribe y ejecuta tu primer código en Eidos',
        url: 'first-program'
      }
    ]
  },

  /**
   * Sección: Referencia del Lenguaje
   *
   * Agrupa la documentación técnica del lenguaje:
   * - sintaxis
   * - control de flujo
   * - funciones
   * - programación orientada a objetos
   * - módulos
   * - programación asíncrona
   */
  language: {
    icon: '📚',
    title: 'Referencia del Lenguaje',
    cards: [
      {
        icon: '📝',
        title: 'Sintaxis Básica',
        desc: 'Variables, tipos de datos, operadores y arrays',
        url: 'syntax'
      },
      {
        icon: '🔀',
        title: 'Control de Flujo',
        desc: 'Condicionales, bucles y patrones',
        url: 'control-flow'
      },
      {
        icon: '⚡',
        title: 'Funciones',
        desc: 'Declaración, parámetros, mutabilidad y closures',
        url: 'functions',
        badges: ['first-class', 'mutable', 'closures', 'lambdas']
      },
      {
        icon: '🎯',
        title: 'Objetos y Clases',
        desc: 'Programación orientada a objetos: clases, herencia y polimorfismo',
        url: 'objects'
      },
      {
        icon: '📦',
        title: 'Módulos',
        desc: 'Organización y reutilización de código',
        url: 'modules'
      },
      {
        icon: '⏱️',
        title: 'Programación Asíncrona',
        desc: 'Concurrencia, async/await y programación reactiva',
        url: 'async',
        badges: ['streams', 'promises', 'reactive']
      }
    ]
  },

  /**
   * Sección: Paradigmas
   *
   * Representa los diferentes enfoques de programación soportados por Eidos.
   * Cada tarjeta incluye un color distintivo para la UI.
   */
  paradigms: {
    icon: '🎨',
    title: 'Paradigmas',
    cards: [
      {
        icon: '🔵',
        title: 'Imperativo',
        desc: 'Programación secuencial paso a paso',
        url: 'imperative',
        color: '#0e639c'
      },
      {
        icon: '🟣',
        title: 'Funcional',
        desc: 'Funciones puras y composición',
        url: 'functional',
        color: '#9333ea'
      },
      {
        icon: '🟢',
        title: 'Orientado a Objetos', 
      desc: 'Clases, herencia y polimorfismo',
      url: 'oop',
      color: '#059669'
    },
      {
        icon: '🔴',
        title: 'Reactivo',
        desc: 'Streams y propagación de cambios',
        url: 'reactive',
        color: '#dc2626'
      },
      {
        icon: '🟠',
        title: 'Concurrente',
        desc: 'Tareas paralelas y sincronización',
        url: 'concurrent',
        color: '#f59e0b'
      },
      {
        icon: '🔵',
        title: 'Declarativo',
        desc: 'Describe qué hacer, no cómo hacerlo',
        url: 'declarative',
        color: '#06b6d4'
      }
    ]
  },

  /**
   * Sección: Guías y Tutoriales
   *
   * Contiene ejemplos prácticos aplicados:
   * - servidor web
   * - herramientas CLI
   * - procesamiento de datos
   */
  guides: {
    icon: '💡',
    title: 'Guías y Tutoriales',
    cards: [
      {
        icon: '🌐',
        title: 'Crear un Servidor Web',
        desc: 'API REST con Eidos',
        url: 'web-server' },
      {
        icon: '⌨️',
        title: 'CLI Tool',
        desc: 'Herramienta de línea de comandos',
        url: 'cli-tool'
      },
      {
        icon: '📊',
        title: 'Procesamiento de Datos',
        desc: 'Análisis y transformación de datos',
        url: 'data-processing'
      }
    ]
  },

  /**
   * Sección: Ejemplos de Código
   *
   * Contiene snippets listos para mostrar en la UI.
   * Incluye nivel de dificultad mediante badges.
   */
  examples: {
    icon: '💻',
    title: 'Ejemplos de Código',
    type: 'examples',
    cards: [
      {
        title: 'Hello World',
        badge: 'Básico',
        code: "func main() {\n  print('¡Hola, Eidos!');\n}",
        url: 'hello-world'
      },
      {
        title: 'Fibonacci',
        badge: 'Intermedio',
        code: "func fib(n) {\n  return n <= 1 ? n : \n    fib(n-1) + fib(n-2);\n}",
        url: 'fibonacci'
      },
      {
        title: 'Reactive Stream',
        badge: 'Avanzado',
        code: "stream clicks\n  .filter(e => e.button == 0)\n  .map(e => e.position)\n  .subscribe(pos => draw(pos));",
        url: 'reactive-stream'
      }
    ]
  },

  /**
   * Sección: API Reference
   *
   * Documentación técnica de bajo nivel:
   * - librería estándar
   * - entrada/salida
   * - networking
   */
  api: {
    icon: '🔧',
    title: 'API Reference',
    cards: [
      {
        icon: '📚',
        title: 'Librería Estándar',
        desc: 'Funciones y módulos built-in',
        url: 'standard-library'
      },
      {
        icon: '💾',
        title: 'Entrada/Salida',
        desc: 'Operaciones de I/O y archivos',
        url: 'io'
      },
      {
        icon: '🌐',
        title: 'Networking',
        desc: 'HTTP, WebSockets y más',
        url: 'network'
      }
    ]
  }
};