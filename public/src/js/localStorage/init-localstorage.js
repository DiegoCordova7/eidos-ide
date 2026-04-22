/**
 * Inicializa el estado base de localStorage para la aplicación.
 *
 * Esta función actúa como "seed" local del sistema:
 * - carga documentación inicial
 * - crea usuarios de ejemplo
 * - crea proyectos demo
 * - crea archivos por proyecto
 * - establece configuración por defecto del IDE
 *
 * La inicialización solo ocurre una vez. Si ya existe la clave
 * 'initialized', la función termina sin hacer cambios.
 */
export function initializeLocalStorage() {
    if (localStorage.getItem('initialized')) {
        return;
    }

        /**
     * Contenido de documentación inicial del sistema.
     *
     * Estructura general:
     * {
     *   "slug-pagina": {
     *      title: string,
     *      lead?: string,
     *      category: string,
     *      breadcrumbs: Array,
     *      navigation?: { prev?, next? },
     *      banner?: Object,
     *      sections: [
     *          {
     *              id: string,
     *              title: string,
     *              content: Array<ContentBlock>
     *          }
     *      ]
     *   }
     * }
     *
     * Cada página representa una entrada de documentación renderizable
     * dinámicamente por el sistema de docs del IDE web.
     *
     * Nota importante:
     * La clave "imperative" aparece dos veces en este objeto.
     * En JavaScript, la segunda definición sobrescribe a la primera.
     */
    const docsContent = {
        "introduction" : {
            "title": "Introducción a Eidos",
            "lead": "Eidos es un lenguaje multiparadigma moderno que combina claridad, expresividad y control total sobre tu código, permitiéndote elegir el enfoque más adecuado para cada problema.",
            "category": "getting-started",
            "breadcrumbs": [
                {
                    "label": "Documentación",
                    "url": "../docs.html"
                },
                {
                    "label": "Primeros Pasos",
                    "url": "../docs.html#getting-started"
                },
                {
                    "label": "Introducción",
                    "current": true
                }
            ],
            "navigation": {
                "next": {
                    "title": "Instalación",
                    "url": "doc.html?page=installation"
                }
            },
            "sections": [
                {
                    "id": "que-es-eidos",
                    "title": "¿Qué es Eidos?",
                    "content": [
                        {
                            "type": "text",
                            "value": "Eidos es un lenguaje diseñado para desarrolladores que valoran la <strong>flexibilidad</strong>, la <strong>expresividad</strong> y el <strong>control total sobre el código</strong>. No te obliga a un único paradigma: puedes usar imperativo, funcional, orientado a objetos o declarativo según lo que el problema requiera."
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "<strong>Nombre:</strong> Eidos proviene del griego εἶδος, que significa \"forma\" o \"esencia\", reflejando la naturaleza adaptable y coherente del lenguaje."
                        },
                        {
                            "type": "text",
                            "value": "Ya sea que prefieras:"
                        },
                        {
                            "type": "list",
                            "items": [
                                "Programación paso a paso con control explícito (imperativa)",
                                "Funciones puras, composición y pipelines (funcional)",
                                "Clases, objetos y herencia (orientado a objetos)",
                                "Streams, eventos y async/await (reactivo y concurrente)",
                                "Código declarativo y expresivo"
                            ]
                        },
                        {
                            "type": "text",
                            "value": "Eidos te da las herramientas para trabajar de forma consistente y eficiente, sin sacrificar claridad ni rendimiento."
                        }
                    ]
                },
                {
                    "id": "estado-proyecto",
                    "title": "Estado del Proyecto",
                    "content": [
                        {
                            "type": "text",
                            "value": "Eidos se encuentra en <strong>desarrollo activo</strong>. La versión actual ofrece una base sólida para programación imperativa, sobre la cual se integrarán gradualmente otros paradigmas de manera compatible."
                        },
                        {
                        "type": "progressboard",
                        "cards": [
                            {
                                "status": "done",
                                "icon": "🔵",
                                "title": "Paradigma Imperativo",
                                "description": "Variables, tipos, control de flujo, arrays"
                            },
                            {
                                "status": "done",
                                "icon": "☕️",
                                "title": "Máquina Virtual",
                                "description": "VM en Java para control total del runtime"
                            },
                            {
                                "status": "active",
                                "icon": "🟣",
                                "title": "Paradigma Funcional",
                                "description": "Funciones puras, inmutabilidad, composición"
                            },
                            {
                                "status": "pending",
                                "icon": "🟢",
                                "title": "Paradigma OOP",
                                "description": "Clases, herencia múltiple, polimorfismo"
                            },
                            {
                                "status": "pending",
                                "icon": "🔴",
                                "title": "Paradigma Reactivo",
                                "description": "Streams, eventos, async/await"
                            },
                            {
                                "status": "pending",
                                "icon": "🟠",
                                "title": "Paradigma Concurrente",
                                "description": "Ejecución paralela segura"
                            }
                        ]
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Puedes probar Eidos <strong>ahora mismo</strong> en el IDE web. Los paradigmas adicionales se integrarán gradualmente sin romper el código existente."
                        }
                    ]
                },
                {
                    "id": "multiparadigma",
                    "title": "Multiparadigma: Lo mejor de cada mundo",
                    "content": [
                        {
                            "type": "text",
                            "value": "Eidos no solo soporta múltiples paradigmas, sino que los integra de manera coherente y natural. Cada paradigma complementa a los demás, permitiendo elegir el enfoque más apropiado según la tarea."
                        },
                        {
                            "type": "paradigmsgrid",
                            "paradigms": [
                                {
                                    "icon": "🔵",
                                    "title": "Imperativo",
                                    "description": "Control explícito de flujo y estado",
                                    "color": "#0e639c"
                                },
                                {
                                    "icon": "🟣",
                                    "title": "Funcional",
                                    "description": "Funciones puras, inmutabilidad y pipelines",
                                    "color": "#9333ea"
                                },
                                {
                                    "icon": "🟢",
                                    "title": "Orientado a Objetos",
                                    "description": "Encapsulación, herencia y polimorfismo",
                                    "color": "#059669"
                                },
                                {
                                    "icon": "🔴",
                                    "title": "Reactivo",
                                    "description": "Streams y eventos asíncronos",
                                    "color": "#dc2626"
                                },
                                {
                                    "icon": "🟠",
                                    "title": "Concurrente",
                                    "description": "Ejecución paralela segura",
                                    "color": "#f59e0b"
                                },
                                {
                                    "icon": "🔵",
                                    "title": "Declarativo",
                                    "description": "Enfocado en qué hacer, no cómo hacerlo",
                                    "color": "#06b6d4"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "filosofia",
                    "title": "Filosofía de diseño",
                    "content": [
                        {
                            "type": "text",
                            "value": "Eidos se basa en principios claros y pragmáticos:"
                        },
                        {
                            "type": "principlelist",
                            "principles": [
                                {
                                    "number": "1",
                                    "title": "Expresividad sin sacrificar claridad",
                                    "description": "Código conciso, legible y sin \"magia\" innecesaria."
                                },
                                {
                                    "number": "2",
                                    "title": "Flexibilidad controlada",
                                    "description": "Varios paradigmas disponibles, puedes usar solo lo que necesitas."
                                },
                                {
                                    "number": "3",
                                    "title": "Rendimiento predecible",
                                    "description": "Lo que escribes es lo que se ejecuta; sin sorpresas en tiempo de ejecución."
                                },
                                {
                                    "number": "4",
                                    "title": "Tipado explícito y seguro",
                                    "description": "Tipos claros, sin inferencia confusa ni errores ocultos."
                                },
                                {
                                    "number": "5",
                                    "title": "Documentación ejecutable",
                                    "description": "Ejemplos, tests y pipelines sirven de guía y validación simultáneamente."
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "caracteristicas",
                    "title": "Características principales",
                    "content": [
                        {
                        "type": "featuregrid",
                        "features": [
                            {
                                "icon": "⚡",
                                "title": "Alto rendimiento",
                                "description": "Compilado a código nativo con optimizaciones agresivas."
                            },
                            {
                                "icon": "🔒",
                                "title": "Fuertemente tipado",
                                "description": "Sistema de tipos estático, seguro y consistente."
                            },
                            {
                                "icon": "🧩",
                                "title": "Composición y Multi-herencia",
                                "description": "Herencia múltiple y composición flexible para modelos complejos."
                            },
                            {
                                "icon": "📐",
                                "title": "Genéricos potentes",
                                "description": "Genéricos avanzados sin sacrificar rendimiento ni claridad."
                            },
                            {
                                "icon": "🌊",
                                "title": "First-class async",
                                "description": "Async/await nativo, streams y concurrencia segura."
                            },
                            {
                                "icon": "🎯",
                                "title": "Pattern Matching",
                                "description": "Desestructuración y matching avanzado."
                            },
                            {
                                "icon": "🔧",
                                "title": "Tooling integrado",
                                "description": "IDE, debugger, linter, formatter y gestor de paquetes listos para usar."
                            }
                        ]
                        }
                    ]
                },
                {
                    "id": "por-que-eidos",
                    "title": "¿Por qué elegir Eidos?",
                    "content": [
                        {
                            "type": "comparisontable",
                            "comparisons": [
                                {
                                    "label": "Si vienes de JavaScript/Python",
                                    "value": "Sintaxis moderna, tipado fuerte, mejor rendimiento y seguridad en compilación."
                                },
                                {
                                    "label": "Si vienes de Java/C#",
                                    "value": "Menos boilerplate, multi-herencia, genéricos potentes y sintaxis clara."
                                },
                                {
                                    "label": "Si vienes de Rust/Go",
                                    "value": "Curva de aprendizaje más suave, multiparadigma y rendimiento comparable."
                                },
                                {
                                    "label": "Si vienes de Haskell/Scala",
                                    "value": "Pragmatismo, imperativo cuando lo necesitas y tipado explícito sin inferencia compleja."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "installation" : {
            "title": "Instalación",
            "lead": "Eidos se ejecuta sobre una Máquina Virtual escrita en Java, diseñada desde cero para soportar todos los paradigmas del lenguaje con control total sobre el runtime.",
            "category": "getting-started",
            "breadcrumbs": [
                {
                    "label": "Documentación",
                    "url": "../docs.html"
                },
                {
                    "label": "Primeros Pasos",
                    "url": "../docs.html#getting-started"
                },
                {
                    "label": "Instalación",
                    "current": true
                }
            ],
            "navigation": {
                "prev": {
                    "title": "Introducción",
                    "url": "doc.html?page=introduction"
                },
                "next": {
                    "title": "Tu Primer Programa",
                    "url": "doc.html?page=first-program"
                }
            },
            "banner": {
                "type": "status",
                "message": "La VM de Eidos está actualmente en desarrollo activo.",
                "link": {
                    "text": "Usa el IDE web mientras tanto →",
                    "url": "#usar-ahora"
                }
            },
            "sections": [
                {
                    "id": "arquitectura",
                    "title": "Arquitectura",
                    "content": [
                        {
                            "type": "text",
                            "value": "La arquitectura de Eidos está diseñada para dar control total sobre cada aspecto del lenguaje: desde cómo se compila el código hasta cómo se gestionan los paradigmas en tiempo de ejecución."
                        },
                        {
                            "type": "pipeline",
                            "nodes": [
                                {
                                    "id": "source",
                                    "icon": "📝",
                                    "label": "Código fuente",
                                    "sublabel": ".eid"
                                },
                                {
                                    "id": "compiler",
                                    "icon": "⚙️",
                                    "label": "Compilador",
                                    "sublabel": "Parser · AST"
                                },
                                {
                                    "id": "bytecode",
                                    "icon": "📦",
                                    "label": "Bytecode",
                                    "sublabel": ".eidc"
                                },
                                {
                                    "id": "vm",
                                    "icon": "☕️",
                                    "label": "EidosVM",
                                    "sublabel": "Java Runtime"
                                },
                                {
                                    "id": "output",
                                    "icon": "✨",
                                    "label": "Ejecución",
                                    "sublabel": "Win · Lin · Mac"
                                }
                            ]
                        },
                        {
                            "type": "vminternals",
                            "title": "☕️ EidosVM — Internals",
                            "modules": [
                                {
                                    "icon": "🎨",
                                    "name": "Paradigmas",
                                    "description": "Imperativo, Funcional, OOP, Reactivo, Concurrente, Declarativo"
                                },
                                {
                                    "icon": "📐",
                                    "name": "Sistema de Tipos",
                                    "description": "Tipado estático, genéricos, multi-herencia"
                                },
                                {
                                    "icon": "🧠",
                                    "name": "Memoria",
                                    "description": "Stack y heap gestionados por la VM en Java"
                                },
                                {
                                    "icon": "🧵",
                                    "name": "Concurrencia",
                                    "description": "Threads seguros, async/await, sin data races"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "como-funciona",
                    "title": "¿Cómo funciona?",
                    "content": [
                        {
                            "type": "text",
                            "value": "El proceso de ejecución en Eidos sigue varias etapas, donde el código se transforma progresivamente hasta poder ejecutarse en la máquina virtual:"
                        },
                        {
                            "type": "howgrid",
                            "steps": [
                                {
                                    "number": "01",
                                    "icon": "🔍",
                                    "title": "Análisis sintáctico",
                                    "description": "El código fuente <code>.eid</code> es procesado por el <strong>lexer</strong> y el <strong>parser</strong>, generando un <strong>Árbol de Sintaxis Abstracta (AST)</strong>. Aquí se valida la sintaxis y la estructura del programa.",
                                    "tag": "Lexer · Parser · AST"
                                },
                                {
                                    "number": "02",
                                    "icon": "🧠",
                                    "title": "Análisis semántico (en desarrollo)",
                                    "description": "El AST es analizado para validar reglas del lenguaje como tipos, variables y alcance. Esta etapa define el significado correcto del programa antes de compilarlo.",
                                    "tag": "Tipos · Scope · Validación"
                                },
                                {
                                    "number": "03",
                                    "icon": "⚙️",
                                    "title": "Compilación",
                                    "description": "El AST se transforma en <strong>instrucciones de bytecode</strong> específicas para la EidosVM. Este proceso ocurre en memoria.",
                                    "tag": "Bytecode · VM Instructions"
                                },
                                {
                                    "number": "04",
                                    "icon": "☕️",
                                    "title": "Ejecución",
                                    "description": "La <strong>EidosVM</strong> ejecuta las instrucciones generadas, manejando la pila, el heap y el flujo del programa en tiempo de ejecución.",
                                    "tag": "Runtime · Memoria · Stack/Heap"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "por-que-java",
                    "title": "¿Por qué Java para la VM?",
                    "content": [
                        {
                            "type": "text",
                            "value": "La decisión de implementar la VM en Java permite aprovechar su robustez, portabilidad y ecosistema maduro para garantizar un runtime estable y seguro:"
                        },
                        {
                            "type": "featuregrid",
                            "features": [
                                {
                                    "icon": "⚡",
                                    "title": "Performance",
                                    "description": "JIT optimiza ejecución, con manejo eficiente de memoria y acceso rápido a datos."
                                },
                                {
                                    "icon": "🔒",
                                    "title": "Seguridad de memoria",
                                    "description": "Gestión automática de memoria segura y protección frente a errores comunes como use-after-free."
                                },
                                {
                                    "icon": "🎮",
                                    "title": "Control total",
                                    "description": "Podemos implementar exactamente la semántica de Eidos sin depender de otra VM."
                                },
                                {
                                    "icon": "🌐",
                                    "title": "Multiplataforma",
                                    "description": "Un solo código de Java corre en Windows, Linux y macOS, garantizando comportamiento consistente."
                                },
                                {
                                    "icon": "🧵",
                                    "title": "Concurrencia segura",
                                    "description": "Threads y async/await gestionados por la JVM permiten paralelismo seguro sin data races."
                                },
                                {
                                    "icon": "📐",
                                    "title": "Paradigmas propios",
                                    "description": "Al tener nuestra propia VM, los paradigmas de Eidos son ciudadanos de primera clase, no adaptaciones forzadas sobre otra VM."
                                }
                            ]
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Lenguajes como <strong>Lua</strong>, <strong>Ruby</strong> (YARV) y <strong>Python</strong> (CPython) también tienen sus propias VMs. Eidos diseña la VM <em>junto con el lenguaje</em>, no después, lo que permite optimizaciones imposibles de otra manera."
                        }
                    ]
                },
                {
                    "id": "estado-actual",
                    "title": "Estado actual",
                    "content": [
                        {
                            "type": "text",
                            "value": "La EidosVM está en desarrollo. Así va el progreso:"
                        },
                        {
                            "type": "progressboard",
                            "cards": [
                                {
                                    "status": "done",
                                    "icon": "🎨",
                                    "title": "Diseño del lenguaje",
                                    "description": "Sintaxis, sistema de tipos, paradigmas y filosofía definidos"
                                },
                                {
                                    "status": "done",
                                    "icon": "💻",
                                    "title": "IDE Web",
                                    "description": "Editor online con syntax highlighting y consola integrada"
                                },
                                {
                                    "status": "done",
                                    "icon": "☕️",
                                    "title": "EidosVM Core",
                                    "description": "Intérprete de bytecode y gestión de memoria en Java"
                                },
                                {
                                    "status": "done",
                                    "icon": "⚙️",
                                    "title": "Compilador",
                                    "description": "Parser, AST y generación de bytecode"
                                },
                                {
                                    "status": "done",
                                    "icon": "📚",
                                    "title": "Librería estándar",
                                    "description": "I/O"
                                },
                                {
                                    "status": "done",
                                    "icon": "🚀",
                                    "title": "Release v0.1",
                                    "description": "Primera versión instalable con soporte básico"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "usar-ahora",
                    "title": "Usar Eidos ahora",
                    "content": [
                        {
                            "type": "text",
                            "value": "Mientras la VM nativa está en desarrollo, puedes usar el <strong>IDE Web de Eidos</strong> para explorar el lenguaje, escribir código y familiarizarte con la sintaxis."
                        },
                        {
                            "type": "ctacard",
                            "icon": "💻",
                            "title": "Eidos IDE Web",
                            "description": "Editor online con syntax highlighting, explorador de archivos y consola integrada. No requiere instalación.",
                            "buttonText": "Abrir IDE",
                            "url": "../../pages/ide.html"
                        }
                    ]
                },
                {
                    "id": "roadmap",
                    "title": "Roadmap de instalación",
                    "content": [
                        {
                            "type": "text",
                            "value": "Cuando la VM esté lista, la instalación será así:"
                        },
                        {
                            "type": "codeblock",
                            "header": "Linux / macOS",
                            "code": "# Instalar EidosVM\ncurl -sSf https://eidos-lang.dev/install.sh | sh\n\n# Verificar instalación\neidos --version\n\n# Ejecutar un programa\neidos run mi-programa.eid"
                        },
                        {
                            "type": "codeblock",
                            "header": "Windows",
                            "code": "# Con winget\nwinget install eidos-lang\n\n# Verificar instalación\neidos --version"
                        },
                        {
                            "type": "infobox",
                            "icon": "📅",
                            "content": "Estos comandos aún no están disponibles. Cuando la VM esté lista, esta página se actualizará con las instrucciones reales."
                        }
                    ]
                },
                {
                    "id": "contribuir",
                    "title": "Contribuir al desarrollo",
                    "content": [
                        {
                            "type": "text",
                            "value": "La EidosVM es un proyecto open source. Si conoces Java y te interesa contribuir al core del lenguaje, tu ayuda es bienvenida:"
                        },
                        {
                            "type": "nextsteps",
                            "cards": [
                                {
                                    "icon": "☕️",
                                    "title": "EidosVM en GitHub",
                                    "description": "Repositorio de la Máquina Virtual en Java",
                                    "url": "https://github.com/DiegoCordova7/eidos-vm",
                                    "external": true
                                },
                                {
                                    "icon": "🐙",
                                    "title": "Eidos en GitHub",
                                    "description": "Repositorio principal del lenguaje",
                                    "url": "https://github.com/DiegoCordova7/eidos",
                                    "external": true
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "first-program" : {
            "title": "Tu Primer Programa",
            "category": "getting-started",
            "breadcrumbs": [
                {
                    "label": "Documentación",
                    "url": "../docs.html"
                },
                {
                    "label": "Primeros Pasos",
                    "url": "../docs.html#getting-started"
                },
                {
                    "label": "Tu Primer Programa",
                    "current": true
                }
            ],
            "navigation": {
                "prev": {
                    "title": "Instalación",
                    "url": "doc.html?page=installation"
                },
                "next": {
                    "title": "Sintaxis",
                    "url": "doc.html?page=syntax"
                }
            },
            "sections": [
                {
                "id": "hola-mundo",
                "title": "Hola Mundo",
                "content": [
                    {
                        "type": "text",
                        "value": "Todo empieza aquí. El programa más simple en Eidos:"
                    },
                    {
                        "type": "code",
                        "lang": "eidos",
                        "code": "print(\"¡Hola, Eidos!\");",
                        "output": "¡Hola, Eidos!"
                    },
                    {
                        "type": "text",
                        "value": "<code>print()</code> muestra cualquier valor en la consola."
                    }
                ]
                },
                {
                "id": "variables",
                "title": "Variables",
                "content": [
                    {
                        "type": "text",
                        "value": "En Eidos, todas las variables deben declarar su tipo explícitamente. El formato es: <code>TipoDato nombre = valor;</code>"
                    },
                    {
                        "type": "code",
                        "lang": "eidos",
                        "code": "Integer edad = 25;\nString nombre = \"Carlos\";\nBoolean activo = true;\nDouble precio = 19.99;\n\nprint(nombre);\nprint(edad);",
                        "output": "Carlos\n25"
                    },
                    {
                        "type": "text",
                        "value": "Los cuatro tipos básicos son: <code>Integer</code>, <code>Double</code>, <code>Boolean</code> y <code>String</code>."
                    },
                    {
                        "type": "infobox",
                        "icon": "💡",
                        "content": "Para constantes, agrega <code>#</code> antes del tipo: <code>#Integer MAX = 100;</code>"
                    }
                ]
                },
                {
                "id": "calculadora",
                "title": "Una calculadora simple",
                "content": [
                    {
                        "type": "text",
                        "value": "Vamos a hacer algo más interesante: una calculadora que suma dos números."
                    },
                    {
                        "type": "code",
                        "lang": "eidos",
                        "code": "// Declaramos dos números\nInteger a = 15;\nInteger b = 27;\n\n// Los sumamos\nInteger suma = a + b;\n\n// Mostramos el resultado\nprint(\"El resultado es:\");\nprint(suma);",
                        "output": "El resultado es:\n42"
                    },
                    {
                        "type": "text",
                        "value": "Eidos soporta operaciones matemáticas estándar: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>."
                    },
                    {
                        "type": "trybox",
                        "title": "Pruébalo tú mismo",
                        "description": "Copia este código en el IDE y prueba cambiando los números",
                        "url": "../../ide.html"
                    }
                ]
                }
            ]
        },
        "syntax" : {
            "title": "Sintaxis",
            "lead": "Referencia de los elementos fundamentales de Eidos: comentarios, variables, tipos de datos, operadores y strings. Para estructuras de control como if, match y loops, consulta Control de Flujo.",
            "category": "language",
            "breadcrumbs": [
                {
                    "label": "Documentación",
                    "url": "../docs.html"
                },
                {
                    "label": "Lenguaje",
                    "url": "../docs.html#language"
                },
                {
                    "label": "Sintaxis",
                    "current": true
                }
            ],
            "navigation": {
                "prev": {
                    "title": "Tu Primer Programa",
                    "url": "doc.html?page=first-program"
                },
                "next": {
                    "title": "Control de Flujo",
                    "url": "doc.html?page=control-flow"
                }
            },
            "sections": [
                {
                    "id": "comentarios",
                    "title": "Comentarios",
                    "content": [
                        {
                            "type": "text",
                            "value": "Los comentarios permiten documentar tu código. Eidos soporta dos tipos:"
                        },
                        {
                            "type": "text",
                            "value": "<strong>Comentarios de línea:</strong>"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "// Esto es un comentario de una línea\nInteger x = 5; // También puede ir al final"
                        },
                        {
                            "type": "text",
                            "value": "<strong>Comentarios de bloque:</strong>"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "/*\n  Esto es un comentario\n  de múltiples líneas\n*/\nInteger y = 10;"
                        }
                    ]
                },
                {
                    "id": "variables",
                    "title": "Variables",
                    "content": [
                        {
                            "type": "text",
                            "value": "Toda variable en Eidos debe declarar su tipo explícitamente. El formato es:"
                        },
                        {
                            "type": "syntaxbox",
                            "pieces": [
                                {
                                    "type": "type",
                                    "value": "TipoDato",
                                    "separator": " "
                                },
                                {
                                    "type": "name",
                                    "value": "nombre",
                                    "separator": " = "
                                },
                                {
                                    "type": "value",
                                    "value": "valor",
                                    "separator": ";"
                                }
                            ]
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer edad = 25;\nString nombre = \"Ana\";\nDouble precio = 19.99;\nBoolean activo = true;"
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Las variables son mutables por defecto. Puedes cambiar su valor después de declararlas siempre que el nuevo valor sea del mismo tipo."
                        }
                    ]
                },
                {
                    "id": "constantes",
                    "title": "Constantes",
                    "content": [
                        {
                            "type": "text",
                            "value": "Para declarar constantes, agrega <code>#</code> después del tipo:"
                            },
                        {
                        "type": "syntaxbox",
                            "pieces": [
                                {
                                    "type": "const",
                                    "value": "TipoDato#",
                                    "separator": " "
                                },
                                {
                                    "type": "name",
                                    "value": "nombre",
                                    "separator": " = "
                                },
                                {
                                    "type": "value",
                                    "value": "valor",
                                    "separator": ";"
                                }
                            ]
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Double# PI = 3.14159;\nInteger# MAX_USUARIOS = 100;\nString# VERSION = \"1.0.0\";"
                        },
                        {
                            "type": "infobox",
                            "icon": "⚠️",
                            "warning": true,
                            "content": "Las constantes no pueden ser reasignadas. Intentar modificar una constante produce un error en tiempo de compilación."
                        }
                    ]
                },
                {
                    "id": "tipos",
                    "title": "Tipos de Datos",
                    "content": [
                        {
                            "type": "text",
                            "value": "Eidos cuenta con cuatro tipos de datos primitivos en su versión actual:"
                        },
                        {
                            "type": "typesgrid",
                            "types": [
                                {
                                    "name": "Integer",
                                    "description": "Números enteros positivos o negativos",
                                    "example": "Integer x = 42;"
                                },
                                {
                                    "name": "Double",
                                    "description": "Números con punto decimal",
                                    "example": "Double pi = 3.14;"
                                },
                                {
                                    "name": "Boolean",
                                    "description": "Valores lógicos: true o false",
                                    "example": "Boolean ok = true;"
                                },
                                {
                                    "name": "String",
                                    "description": "Cadenas de texto entre comillas dobles",
                                    "example": "String msg = \"Hola\";"
                                }
                            ]
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Eidos no tiene un tipo <code>null</code> en esta versión. Todas las variables deben tener un valor al momento de ser declaradas."
                        }
                    ]
                },
                {
                    "id": "operadores-aritmeticos",
                    "title": "Operadores Aritméticos",
                    "content": [
                        {
                            "type": "text",
                            "value": "Los operadores aritméticos permiten realizar operaciones matemáticas:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer a = 10 + 5;   // Suma: 15\nInteger b = 10 - 5;   // Resta: 5\nInteger c = 10 * 5;   // Multiplicación: 50\nInteger d = 10 / 5;   // División: 2\nInteger e = 10 % 3;   // Módulo (resto): 1"
                        },
                        {
                            "type": "text",
                            "value": "También funcionan con <code>Double</code>:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Double x = 10.5 + 2.3;  // 12.8\nDouble y = 10.0 / 3.0;  // 3.333..."
                        }
                    ]
                },
                {
                    "id": "operadores-comparacion",
                    "title": "Operadores de Comparación",
                    "content": [
                        {
                            "type": "text",
                            "value": "Los operadores de comparación devuelven un valor <code>Boolean</code>:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Boolean a = 5 == 5;   // Igual a: true\nBoolean b = 5 != 3;   // Diferente de: true\nBoolean c = 5 > 3;    // Mayor que: true\nBoolean d = 5 < 10;   // Menor que: true\nBoolean e = 5 >= 5;   // Mayor o igual: true\nBoolean f = 5 <= 10;  // Menor o igual: true"
                        }
                    ]
                },
                {
                    "id": "operadores-logicos",
                    "title": "Operadores Lógicos",
                    "content": [
                        {
                            "type": "text",
                            "value": "Operan sobre valores <code>Boolean</code>:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Boolean a = true && false;  // AND: false\nBoolean b = true || false;  // OR: true\nBoolean c = !true;          // NOT: false"
                        },
                        {
                            "type": "text",
                            "value": "Útiles para combinar condiciones:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer edad = 25;\nBoolean tieneID = true;\n\nBoolean puedeEntrar = edad >= 18 && tieneID;\nprint(puedeEntrar);",
                            "output": "true"
                        }
                    ]
                },
                {
                    "id": "operadores-asignacion",
                    "title": "Operadores de Asignación",
                    "content": [
                        {
                            "type": "text",
                            "value": "Además de la asignación simple <code>=</code>, existen operadores compuestos:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 10;\nx += 5;   // x = x + 5  → 15\nx -= 3;   // x = x - 3  → 12\nx *= 2;   // x = x * 2  → 24\nx /= 4;   // x = x / 4  → 6\nx %= 4;   // x = x % 4  → 2\n\nprint(x);",
                            "output": "2"
                        }
                    ]
                },
                {
                    "id": "incremento-decremento",
                    "title": "Incremento y Decremento",
                    "content": [
                        {
                            "type": "text",
                            "value": "Operadores especiales para aumentar o disminuir en 1:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 5;\nx++;  // x = 6 (incremento)\nx--;  // x = 5 (decremento)\n\nprint(x);",
                            "output": "5"
                        }
                    ]
                },
                {
                    "id": "strings",
                    "title": "Strings",
                    "content": [
                        {
                            "type": "text",
                            "value": "Los strings en Eidos se definen con comillas dobles:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "String mensaje = \"Hola, Eidos\";\nString vacio = \"\";\nString multiPalabra = \"Esto es una frase completa\";"
                        },
                        {
                            "type": "text",
                            "value": "<strong>Secuencias de Escape:</strong>"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "String lineaNueva = \"Primera línea\\nSegunda línea\";\nString tab = \"Col1\\tCol2\";\nString comillas = \"Dijo: \\\"Hola\\\"\";\nString backslash = \"Ruta: C:\\\\usuarios\\\\docs\";\n\nprint(lineaNueva);",
                            "output": "Primera línea\nSegunda línea"
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Las secuencias de escape soportadas son: <code>\\n</code> (nueva línea), <code>\\t</code> (tabulación), <code>\\\"</code> (comilla doble), <code>\\\\</code> (backslash)."
                        }
                    ]
                },
                {
                    "id": "arrays",
                    "title": "Arrays",
                    "content": [
                        {
                            "type": "text",
                            "value": "Los arrays son colecciones de elementos del mismo tipo con tamaño fijo. Se declaran especificando el tipo seguido de <code>[]</code>:"
                        },
                        {
                            "type": "syntaxbox",
                            "pieces": [
                                {
                                    "type": "type",
                                    "value": "TipoDato[]",
                                    "separator": " "
                                },
                                {
                                    "type": "name",
                                    "value": "nombre",
                                    "separator": " = "
                                },
                                {
                                    "type": "value",
                                    "value": "new TipoDato[tamaño]",
                                    "separator": ";"
                                }
                            ]
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer[] numeros = new Integer[5];\nString[] nombres = new String[3];\nBoolean[] flags = new Boolean[10];"
                        },
                        {
                            "type": "text",
                            "value": "<strong>Acceso y Modificación:</strong>"
                        },
                        {
                            "type": "text",
                            "value": "Los índices comienzan en 0. Usa <code>[]</code> para acceder o modificar elementos:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer[] datos = new Integer[4];\n\n// Asignar valores\ndatos[0] = 10;\ndatos[1] = 20;\ndatos[2] = 30;\ndatos[3] = 40;\n\n// Leer valores\nprint(datos[0]);\nprint(datos[3]);",
                            "output": "10\n40"
                        },
                        {
                            "type": "text",
                            "value": "<strong>Propiedad .length:</strong>"
                        },
                        {
                            "type": "text",
                            "value": "Todos los arrays tienen la propiedad <code>.length</code> que devuelve su tamaño:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer[] arr = new Integer[5];\nInteger tam = arr.length;\n\nprint(tam);",
                            "output": "5"
                        },
                        {
                            "type": "text",
                            "value": "Útil para iterar sobre todos los elementos:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "String[] nombres = new String[3];\nnombres[0] = \"Ana\";\nnombres[1] = \"Bob\";\nnombres[2] = \"Carlos\";\n\nfor (Integer i = 0; i < nombres.length; i++) {\n    print(nombres[i]);\n}",
                            "output": "Ana\nBob\nCarlos"
                        },
                        {
                            "type": "infobox",
                            "icon": "⚠️",
                            "warning": true,
                            "content": "Acceder a un índice fuera de rango (menor que 0 o mayor o igual que <code>.length</code>) produce un error en tiempo de ejecución."
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer[] arr = new Integer[3];\narr[5] = 10;  // ❌ Error: índice fuera de rango"
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Los arrays en Eidos tienen <strong>tamaño fijo</strong>. No puedes cambiar el tamaño una vez creados. Inicialización con valores y arrays multidimensionales están planeados para futuras versiones."
                        }
                    ]
                },
                {
                    "id": "precedencia",
                    "title": "Precedencia de Operadores",
                    "content": [
                        {
                            "type": "text",
                            "value": "Los operadores se evalúan en el siguiente orden (de mayor a menor precedencia):"
                        },
                        {
                            "type": "list",
                            "items": [
                                "Paréntesis <code>()</code>",
                                "NOT lógico <code>!</code>",
                                "Multiplicación <code>*</code>, División <code>/</code>, Módulo <code>%</code>",
                                "Suma <code>+</code>, Resta <code>-</code>",
                                "Comparación <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>",
                                "Igualdad <code>==</code>, <code>!=</code>",
                                "AND lógico <code>&&</code>",
                                "OR lógico <code>||</code>",
                                "Asignación <code>=</code>, <code>+=</code>, <code>-=</code>, etc."
                            ]
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer resultado = 2 + 3 * 4;  // 14 (no 20)\nInteger conParentesis = (2 + 3) * 4;  // 20\n\nprint(resultado);",
                            "output": "14"
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Usa paréntesis cuando tengas duda. Mejoran la legibilidad y aseguran el orden correcto de evaluación."
                        }
                    ]
                }
            ]
        },
        "control-flow" : {
            "title": "Control de Flujo",
            "lead": "Las estructuras de control permiten alterar el flujo de ejecución del programa: condicionales (if, match) y loops (for, while, do-while).",
            "category": "language",
            "breadcrumbs": [
                {
                    "label": "Documentación",
                    "url": "../docs.html"
                },
                {
                    "label": "Lenguaje",
                    "url": "../docs.html#language"
                },
                {
                    "label": "Control de Flujo",
                    "current": true
                }
            ],
            "navigation": {
                "prev": {
                    "title": "Sintaxis",
                    "url": "doc.html?page=syntax"
                },
                "next": {
                    "title": "Funciones",
                    "url": "doc.html?page=functions"
                }
            },
            "sections": [
                {
                    "id": "if-statement",
                    "title": "If - Statement",
                    "content": [
                        {
                            "type": "text",
                            "value": "El <code>if</code> como statement ejecuta bloques de código según una condición:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer edad = 20;\n\nif (edad >= 18) {\n    print(\"Mayor de edad\");\n} else {\n    print(\"Menor de edad\");\n}",
                            "output": "Mayor de edad"
                        },
                        {
                            "type": "text",
                            "value": "El bloque <code>else</code> es opcional:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 10;\n\nif (x > 5) {\n    print(\"x es mayor que 5\");\n}",
                            "output": "x es mayor que 5"
                        },
                        {
                            "type": "text",
                            "value": "Puedes encadenar múltiples condiciones con <code>else if</code>:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer nota = 85;\n\nif (nota >= 90) {\n    print(\"A\");\n} else if (nota >= 80) {\n    print(\"B\");\n} else if (nota >= 70) {\n    print(\"C\");\n} else {\n    print(\"F\");\n}",
                            "output": "B"
                        }
                    ]
                },
                {
                    "id": "if-expression",
                    "title": "If - Expression",
                    "content": [
                        {
                            "type": "text",
                            "value": "El <code>if</code> como expresión devuelve un valor y puede asignarse directamente a una variable:"
                        },
                        {
                            "type": "syntaxbox",
                            "pieces": [
                                {
                                    "type": "type",
                                    "value": "TipoDato",
                                    "separator": " "
                                },
                                {
                                    "type": "name",
                                    "value": "var",
                                    "separator": " = "
                                },
                                {
                                    "type": "value",
                                    "value": "if (cond) valorThen else valorElse",
                                    "separator": ";"
                                }
                            ]
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer edad = 20;\nString categoria = if (edad >= 18) \"Adulto\" else \"Menor\";\n\nprint(categoria);",
                            "output": "Adulto"
                        },
                        {
                            "type": "infobox",
                            "icon": "⚠️",
                            "warning": true,
                            "content": "Cuando usas <code>if</code> como expresión, el bloque <code>else</code> es <strong>obligatorio</strong>. Ambas ramas deben devolver el mismo tipo de dato."
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 10;\nInteger resultado = if (x > 5) 100 else 50;\n\nprint(resultado);",
                            "output": "100"
                        }
                    ]
                },
                {
                    "id": "match-intro",
                    "title": "Match - Introducción",
                    "content": [
                        {
                            "type": "text",
                            "value": "<code>match</code> evalúa una expresión contra múltiples patrones y ejecuta el código del primer patrón que coincida. Es más potente que una cadena de <code>if-else</code> cuando tienes múltiples casos."
                        },
                        {
                            "type": "text",
                            "value": "Eidos soporta cuatro tipos de patrones:"
                        },
                        {
                            "type": "list",
                            "items": [
                                "<strong>Valor exacto:</strong> <code>10 => ...</code>",
                                "<strong>Rango:</strong> <code>1..5 => ...</code> (del 1 al 5 inclusive)",
                                "<strong>Múltiples valores (OR):</strong> <code>20 | 30 | 40 => ...</code>",
                                "<strong>Comodín (default):</strong> <code>_ => ...</code>"
                            ]
                        }
                    ]
                },
                {
                    "id": "match-patterns",
                    "title": "Match - Patrones",
                    "content": [
                        {
                            "type": "text",
                            "value": "Ejemplo usando los cuatro tipos de patrones:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 3;\n\nString resultado = match(x) {\n    1        => \"Es uno\"\n    2..5     => \"Entre 2 y 5\"\n    10       => \"Es diez\"\n    20 | 30  => \"Es 20 o 30\"\n    _        => \"Otro valor\"\n};\n\nprint(resultado);",
                            "output": "Entre 2 y 5"
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "El patrón comodín <code>_</code> es <strong>obligatorio</strong> si el <code>match</code> no cubre todos los posibles valores del tipo. El compilador te avisará si falta."
                        }
                    ]
                },
                {
                    "id": "match-statement",
                    "title": "Match - Statement",
                    "content": [
                        {
                            "type": "text",
                            "value": "Como statement, <code>match</code> ejecuta código sin devolver un valor:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer dia = 3;\n\nmatch(dia) {\n    1     => print(\"Lunes\")\n    2     => print(\"Martes\")\n    3     => print(\"Miércoles\")\n    4     => print(\"Jueves\")\n    5     => print(\"Viernes\")\n    6 | 7 => print(\"Fin de semana\")\n    _     => print(\"Día inválido\")\n}",
                            "output": "Miércoles"
                        },
                        {
                            "type": "text",
                            "value": "Cada rama puede ejecutar múltiples líneas usando llaves:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 15;\n\nmatch(x) {\n    1..10 => {\n        print(\"Pequeño\");\n        print(\"Entre 1 y 10\");\n    }\n    11..20 => {\n        print(\"Mediano\");\n        print(\"Entre 11 y 20\");\n    }\n    _ => print(\"Grande\")\n}",
                            "output": "Mediano\nEntre 11 y 20"
                        }
                    ]
                },
                {
                    "id": "match-expression",
                    "title": "Match - Expression",
                    "content": [
                        {
                            "type": "text",
                            "value": "Como expresión, <code>match</code> devuelve un valor que puede asignarse:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer puntos = 85;\n\nString calificacion = match(puntos) {\n    90..100 => \"A\"\n    80..89  => \"B\"\n    70..79  => \"C\"\n    60..69  => \"D\"\n    _       => \"F\"\n};\n\nprint(calificacion);",
                            "output": "B"
                        },
                        {
                            "type": "infobox",
                            "icon": "⚠️",
                            "warning": true,
                            "content": "Todas las ramas de un <code>match</code> expression deben devolver el mismo tipo de dato."
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer edad = 25;\n\nInteger descuento = match(edad) {\n    0..12   => 50  // 50% descuento niños\n    13..17  => 30  // 30% descuento adolescentes\n    18..64  => 0   // Sin descuento adultos\n    _       => 40  // 40% tercera edad\n};\n\nprint(descuento);",
                            "output": "0"
                        }
                    ]
                },
                {
                    "id": "for-loop",
                    "title": "For Loop",
                    "content": [
                        {
                            "type": "text",
                            "value": "El loop <code>for</code> repite un bloque un número determinado de veces:"
                        },
                        {
                            "type": "syntaxbox",
                            "pieces": [
                                { "type": "value", "value": "for (inicialización; condición; incremento) { ... }" }
                            ]
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "for (Integer i = 0; i < 5; i++) {\n    print(i);\n}",
                            "output": "0\n1\n2\n3\n4"
                        },
                        {
                            "type": "text",
                            "value": "También puedes usar decremento:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "for (Integer i = 5; i > 0; i--) {\n    print(i);\n}",
                            "output": "5\n4\n3\n2\n1"
                        }
                    ]
                },
                {
                    "id": "while-loop",
                    "title": "While Loop",
                    "content": [
                        {
                            "type": "text",
                            "value": "El loop <code>while</code> repite mientras una condición sea verdadera:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 0;\n\nwhile (x < 3) {\n    print(x);\n    x++;\n}",
                            "output": "0\n1\n2"
                        },
                        {
                            "type": "infobox",
                            "icon": "⚠️",
                            "warning": true,
                            "content": "Asegúrate de que la condición eventualmente sea falsa, o tendrás un loop infinito."
                        }
                    ]
                    },
                    {
                    "id": "do-while-loop",
                    "title": "Do-While Loop",
                    "content": [
                        {
                            "type": "text",
                            "value": "El loop <code>do-while</code> ejecuta el bloque al menos una vez, luego verifica la condición:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer y = 0;\n\ndo {\n    print(y);\n    y++;\n} while (y < 3);",
                            "output": "0\n1\n2"
                        },
                        {
                            "type": "text",
                            "value": "La diferencia clave: se ejecuta al menos una vez, incluso si la condición es falsa:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer z = 10;\n\ndo {\n    print(\"Ejecutado una vez\");\n} while (z < 5);",
                            "output": "Ejecutado una vez"
                        }
                    ]
                },
                {
                    "id": "break",
                    "title": "Break",
                    "content": [
                        {
                            "type": "text",
                            "value": "Usa <code>break</code> para salir inmediatamente de un loop:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "for (Integer i = 0; i < 10; i++) {\n    if (i == 5) {\n        break;\n    }\n    print(i);\n}",
                            "output": "0\n1\n2\n3\n4"
                        },
                        {
                            "type": "text",
                            "value": "Útil para salir de un loop cuando se cumple una condición:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 0;\nwhile (true) {\n    if (x >= 3) {\n        break;\n    }\n    print(x);\n    x++;\n}",
                            "output": "0\n1\n2"
                        }
                    ]
                },
                {
                    "id": "continue",
                    "title": "Continue",
                    "content": [
                        {
                            "type": "text",
                            "value": "Usa <code>continue</code> para saltar a la siguiente iteración del loop:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "for (Integer i = 0; i < 5; i++) {\n    if (i == 2) {\n        continue;  // Salta el resto cuando i es 2\n    }\n    print(i);\n}",
                            "output": "0\n1\n3\n4"
                        },
                        {
                            "type": "text",
                            "value": "Útil para omitir casos específicos sin salir del loop completo:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "// Imprimir solo números impares\nfor (Integer i = 0; i < 6; i++) {\n    if (i % 2 == 0) {\n        continue;  // Salta números pares\n    }\n    print(i);\n}",
                            "output": "1\n3\n5"
                        }
                    ]
                }
            ]
        },
        "imperative" : {
            "title": "Paradigma Imperativo",
            "lead": "La programación imperativa es el paradigma base de Eidos. Define tu programa como una secuencia de instrucciones que modifican el estado del programa paso a paso.",
            "category": "paradigms",
            "breadcrumbs": [
                {
                    "label": "Documentación",
                    "url": "../docs.html"
                },
                {
                    "label": "Paradigmas",
                    "url": "../docs.html#paradigms"
                },
                {
                    "label": "Imperativo",
                    "current": true
                }
            ],
            "navigation": {
                "prev": {
                    "title": "Programación Asíncrona",
                    "url": "doc.html?page=async-programming"
                },
                "next": {
                    "title": "Funcional",
                    "url": "doc.html?page=functional"
                }
            },
            "sections": [
                {
                    "id": "que-es",
                    "title": "¿Qué es la Programación Imperativa?",
                    "content": [
                        {
                            "type": "text",
                            "value": "La programación imperativa es un paradigma donde describes <strong>cómo</strong> resolver un problema mediante una secuencia explícita de comandos que modifican el estado del programa."
                        },
                        {
                            "type": "text",
                            "value": "Piensa en ello como dar instrucciones paso a paso:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "// 1. Crear una variable\nInteger suma = 0;\n\n// 2. Modificar su valor\nsuma = suma + 10;\n\n// 3. Modificar nuevamente\nsuma = suma + 5;\n\n// 4. Mostrar resultado\nprint(suma);",
                            "output": "15"
                        },
                        {
                            "type": "text",
                            "value": "Cada línea cambia el <strong>estado</strong> del programa. Este es el corazón del paradigma imperativo."
                        }
                    ]
                },
                {
                    "id": "caracteristicas",
                    "title": "Características Clave",
                    "content": [
                        {
                            "type": "text",
                            "value": "El paradigma imperativo en Eidos se caracteriza por tres pilares fundamentales:"
                        },
                        {
                            "type": "featuregrid",
                            "features": [
                                {
                                    "icon": "📝",
                                    "title": "Estado Mutable",
                                    "description": "Las variables pueden cambiar su valor durante la ejecución. El estado evoluciona a medida que el programa avanza."
                                },
                                {
                                    "icon": "➡️",
                                    "title": "Ejecución Secuencial",
                                    "description": "El código se ejecuta línea por línea, de arriba hacia abajo. El orden importa."
                                },
                                {
                                    "icon": "🎮",
                                    "title": "Control Explícito",
                                    "description": "Tú decides exactamente qué hacer, cuándo hacerlo y cómo hacerlo usando if, loops y asignaciones."
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "estado-mutable",
                    "title": "Estado Mutable",
                    "content": [
                        {
                            "type": "text",
                            "value": "En programación imperativa, las variables son <strong>mutables</strong> por defecto (excepto las constantes con <code>#</code>):"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer contador = 0;\nprint(contador);  // 0\n\ncontador = 5;\nprint(contador);  // 5\n\ncontador = contador + 10;\nprint(contador);  // 15",
                            "output": "0\n5\n15"
                        },
                        {
                            "type": "text",
                            "value": "Este cambio de estado es fundamental. El mismo nombre de variable apunta a diferentes valores a lo largo del tiempo."
                        }
                    ]
                },
                {
                    "id": "control-flujo",
                    "title": "Control Explícito del Flujo",
                    "content": [
                        {
                            "type": "text",
                            "value": "Usas estructuras de control para decidir qué ejecutar y cuándo:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer x = 10;\n\nif (x > 5) {\n    x = x * 2;  // Se ejecuta\n} else {\n    x = x / 2;  // No se ejecuta\n}\n\nprint(x);",
                            "output": "20"
                        },
                        {
                            "type": "text",
                            "value": "Los loops te permiten repetir acciones sobre el estado:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer factorial = 1;\n\nfor (Integer i = 1; i <= 5; i++) {\n    factorial = factorial * i;\n}\n\nprint(factorial);",
                            "output": "120"
                        }
                    ]
                },
                {
                    "id": "ejemplo-contador",
                    "title": "Ejemplo: Contador Simple",
                    "content": [
                        {
                            "type": "text",
                            "value": "Un ejemplo clásico del paradigma imperativo: un contador que se incrementa en un loop:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer contador = 0;\n\nfor (Integer i = 0; i < 5; i++) {\n    contador++;\n    print(contador);\n}",
                            "output": "1\n2\n3\n4\n5"
                        },
                        {
                            "type": "text",
                            "value": "Nota cómo <code>contador</code> cambia de estado en cada iteración. Esto es programación imperativa pura."
                        }
                    ]
                },
                {
                    "id": "ejemplo-suma-array",
                    "title": "Ejemplo: Suma de Array",
                    "content": [
                        {
                            "type": "text",
                            "value": "Calculemos la suma de todos los elementos de un array, paso a paso:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "// 1. Crear y llenar el array\nInteger[] numeros = new Integer[5];\nnumeros[0] = 10;\nnumeros[1] = 20;\nnumeros[2] = 30;\nnumeros[3] = 40;\nnumeros[4] = 50;\n\n// 2. Crear acumulador\nInteger suma = 0;\n\n// 3. Iterar y sumar\nfor (Integer i = 0; i < numeros.length; i++) {\n    suma = suma + numeros[i];\n}\n\n// 4. Mostrar resultado\nprint(suma);",
                            "output": "150"
                        },
                        {
                            "type": "text",
                            "value": "Cada paso modifica el estado: asignas valores, acumulas en <code>suma</code>, e iteras explícitamente."
                        }
                    ]
                },
                {
                    "id": "ejemplo-busqueda",
                    "title": "Ejemplo: Búsqueda en Array",
                    "content": [
                        {
                            "type": "text",
                            "value": "Buscar un valor en un array es un ejemplo perfecto de control imperativo del flujo:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer[] datos = new Integer[5];\ndatos[0] = 5;\ndatos[1] = 12;\ndatos[2] = 7;\ndatos[3] = 20;\ndatos[4] = 3;\n\nInteger buscado = 7;\nBoolean encontrado = false;\nInteger posicion = -1;\n\nfor (Integer i = 0; i < datos.length; i++) {\n    if (datos[i] == buscado) {\n        encontrado = true;\n        posicion = i;\n        break;  // Salir cuando lo encontramos\n    }\n}\n\nif (encontrado) {\n    print(\"Encontrado en posición:\");\n    print(posicion);\n} else {\n    print(\"No encontrado\");\n}",
                            "output": "Encontrado en posición:\n2"
                        },
                        {
                            "type": "text",
                            "value": "Controlas cada aspecto: el loop, la comparación, cuándo salir, qué imprimir."
                        }
                    ]
                },
                {
                    "id": "ejemplo-maximo",
                    "title": "Ejemplo: Encontrar el Máximo",
                    "content": [
                        {
                            "type": "text",
                            "value": "Encontrar el valor máximo en un array mediante comparaciones explícitas:"
                        },
                        {
                            "type": "code",
                            "lang": "eidos",
                            "code": "Integer[] valores = new Integer[6];\nvalores[0] = 42;\nvalores[1] = 17;\nvalores[2] = 93;\nvalores[3] = 8;\nvalores[4] = 55;\nvalores[5] = 31;\n\nInteger maximo = valores[0];  // Asumir que el primero es el máximo\n\nfor (Integer i = 1; i < valores.length; i++) {\n    if (valores[i] > maximo) {\n        maximo = valores[i];  // Actualizar si encontramos uno mayor\n    }\n}\n\nprint(maximo);",
                            "output": "93"
                        }
                    ]
                },
                {
                    "id": "ventajas",
                    "title": "Ventajas del Paradigma Imperativo",
                    "content": [
                        {
                            "type": "text",
                            "value": "El paradigma imperativo tiene ventajas claras que lo hacen el punto de partida ideal:"
                        },
                        {
                            "type": "featuregrid",
                            "features": [
                                {
                                    "icon": "🧠",
                                    "title": "Natural e Intuitivo",
                                    "description": "Corresponde a cómo pensamos naturalmente: haz esto, luego aquello, luego lo otro."
                                },
                                {
                                    "icon": "🎯",
                                    "title": "Control Total",
                                    "description": "Decides exactamente qué sucede, en qué orden, y cómo se modifica el estado."
                                },
                                {
                                    "icon": "🐛",
                                    "title": "Fácil de Debuggear",
                                    "description": "Puedes seguir el estado línea por línea y ver exactamente cómo cambia."
                                },
                                {
                                    "icon": "⚡",
                                    "title": "Performance Predecible",
                                    "description": "El código se ejecuta exactamente como lo escribiste, sin abstracciones ocultas."
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "cuando-usar",
                    "title": "¿Cuándo Usar Imperativo?",
                    "content": [
                        {
                            "type": "text",
                            "value": "El paradigma imperativo es ideal para:"
                        },
                        {
                            "type": "list",
                            "items": [
                                "<strong>Algoritmos con estado complejo:</strong> Cuando necesitas mantener y modificar múltiples variables a lo largo del tiempo.",
                                "<strong>Transformaciones paso a paso:</strong> Cuando el proceso importa tanto como el resultado.",
                                "<strong>Control fino del flujo:</strong> Cuando necesitas decidir exactamente qué hacer en cada momento.",
                                "<strong>Optimizaciones específicas:</strong> Cuando necesitas control preciso sobre el rendimiento.",
                                "<strong>Aprendizaje:</strong> Es el paradigma más directo para empezar a programar."
                            ]
                        }
                    ]
                },
                {
                    "id": "imperativo-vs-otros",
                    "title": "Imperativo vs Otros Paradigmas",
                    "content": [
                        {
                            "type": "text",
                            "value": "Eidos es multiparadigma. El imperativo es el punto de partida, pero en el futuro podrás combinar otros enfoques:"
                        },
                        {
                            "type": "comparisontable",
                            "comparisons": [
                                {
                                    "label": "Imperativo (actual)",
                                    "value": "Control explícito, estado mutable, ejecución paso a paso"
                                },
                                {
                                    "label": "Funcional (futuro)",
                                    "value": "Funciones puras, inmutabilidad, composición"
                                },
                                {
                                    "label": "OOP (futuro)",
                                    "value": "Encapsulación, clases, herencia, polimorfismo"
                                },
                                {
                                    "label": "Reactivo (futuro)",
                                    "value": "Streams de datos, eventos, programación asíncrona"
                                }
                            ]
                        },
                        {
                            "type": "infobox",
                            "icon": "💡",
                            "content": "Por ahora, Eidos implementa solo el paradigma imperativo. Los demás paradigmas están en desarrollo y se integrarán en futuras versiones del lenguaje."
                        }
                    ]
                }
            ]
        }
    }
    localStorage.setItem('docs_content', JSON.stringify(docsContent));

    const defaultUsers = [
        {
            id: 1,
            username: 'Demo User',
            email: 'demo@example.com',
            password: 'demo123'
        },
        {
            id: 2,
            username: 'Test User',
            email: 'test@example.com',
            password: 'test123'
        }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));

    const defaultProjects = [
        {
            id: 1001,
            name: 'Mi Primer Proyecto',
            description: 'Un proyecto de ejemplo para empezar',
            owner_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 1002,
            name: 'Calculadora',
            description: 'Una simple calculadora en Eidos',
            owner_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 1003,
            name: 'Juego de Números',
            description: 'Adivina el número secreto',
            owner_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    localStorage.setItem('projects', JSON.stringify(defaultProjects));

    const files1001 = [
        {
            id: 2001,
            project_id: 1001,
            parent_id: null,
            name: 'main',
            type: 'file',
            content: `Integer x = 10;
Integer y = 20;
Integer suma = x + y;
print(suma);`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 2002,
            project_id: 1001,
            parent_id: null,
            name: 'utilidades',
            type: 'folder',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 2003,
            project_id: 1001,
            parent_id: 2002,
            name: 'helpers',
            type: 'file',
            content: `// Funciones auxiliares
// Puedes escribir aquí`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    localStorage.setItem('files_1001', JSON.stringify(files1001));

    const files1002 = [
        {
            id: 2004,
            project_id: 1002,
            parent_id: null,
            name: 'calculadora',
            type: 'file',
            content: `Integer a = 15;
Integer b = 7;

// Operaciones
Integer suma = a + b;
Integer resta = a - b;
Integer mult = a * b;

print("Suma: ");
print(suma);
print("Resta: ");
print(resta);
print("Multiplicación: ");
print(mult);`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    localStorage.setItem('files_1002', JSON.stringify(files1002));

    const files1003 = [
        {
            id: 2005,
            project_id: 1003,
            parent_id: null,
            name: 'juego',
            type: 'file',
            content: `// Juego: Adivina el número
// El número secreto es 42

Integer secreto = 42;
Integer intento = 50;

Si intento == secreto Entonces
    print("¡Acertaste!");
Sino Si intento > secreto Entonces
    print("Es menor");
Sino
    print("Es mayor");
FinSi`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    localStorage.setItem('files_1003', JSON.stringify(files1003));

    const defaultSettings = {
        ideTheme: 'dark',
        fontFamily: 'Consolas',
        syntaxTheme: 'eidos-dark',
        tabSize: 4,
        fontSize: 14,
        lineHeight: 1.6,
        zoomLevel: 100,
        consoleHeight: 30,
        autoSave: true,
        lineNumbers: true,
        wordWrap: true,
        autoComplete: true,
        hwAcceleration: true,
        clearConsole: true,
        accentColor: null
    };
    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    localStorage.setItem('initialized', 'true');
}

export function resetAllLocalStorage() {
    localStorage.clear();
    initializeLocalStorage();
}