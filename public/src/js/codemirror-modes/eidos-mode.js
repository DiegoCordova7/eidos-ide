/**
 * Define el modo de resaltado de sintaxis "eidos" para CodeMirror.
 *
 * Este modo analiza el texto fuente carácter por carácter y clasifica
 * cada fragmento con un estilo ("keyword", "number", "string", etc.)
 * para que CodeMirror pueda colorearlo visualmente.
 */
CodeMirror.defineMode("eidos", function(config, parserConfig) {
    var indentUnit = config.indentUnit || 4;
    
    var keywords = {
        "if": true,
        "else": true,
        "match": true,
        "while": true,
        "do": true,
        "for": true,
        "return": true,
        "break": true,
        "continue": true,
        "true": true,
        "false": true,
        "null": true
    };

    var types = {
        "Integer": true,
        "Double": true,
        "String": true,
        "Boolean": true,
        "Array": true
    };

    var builtins = {
        "print": true,
        "println": true,
        "input": true,
        "len": true,
        "type": true
    };

    var atoms = {
        "mutable": true
    };

    var isOperatorChar = /[+\-*/%&|^~<>=!?]/;
    var isWordChar = /[a-zA-Z_$]/;
    var isDigit = /[0-9]/;

    /**
     * Función principal de tokenización.
     *
     * Lee el siguiente fragmento del stream y determina qué tipo de token es:
     * comentario, cadena, número, palabra reservada, operador, etc.
     *
     * @param {CodeMirror.StringStream} stream - Flujo de caracteres de la línea actual.
     * @param {Object} state - Estado interno del modo.
     * @returns {string|null} Nombre del estilo del token o null si es espacio.
     */
    function tokenBase(stream, state) {
        var ch = stream.next();

        if (/\s/.test(ch)) {
            return null;
        }

        if (ch === "/") {
            if (stream.eat("*")) {
                state.tokenize = tokenBlockComment;
                return tokenBlockComment(stream, state);
            }
            if (stream.eat("/")) {
                stream.skipToEnd();
                return "comment";
            }
        }

        if (ch === '"') {
            state.tokenize = tokenString(ch);
            return state.tokenize(stream, state);
        }

        if (ch === "'") {
            state.tokenize = tokenString(ch);
            return state.tokenize(stream, state);
        }

        if (ch === "`") {
            state.tokenize = tokenString(ch);
            return state.tokenize(stream, state);
        }

        if (isDigit.test(ch)) {
            stream.eatWhile(isDigit);
            
            if (stream.eat(".")) {
                stream.eatWhile(isDigit);
            }
            
            if (stream.eat(/[eE]/)) {
                stream.eat(/[+\-]/);
                stream.eatWhile(isDigit);
            }
            
            return "number";
        }

        if (ch === "#") {
            if (/[a-zA-Z_]/.test(stream.peek())) {
                stream.eatWhile(/[a-zA-Z0-9_]/);
                return "atom";
            }
        }

        if (ch === "(" || ch === ")") {
            return "paren";
        }

        if (ch === "{" || ch === "}") {
            return "brace";
        }

        if (ch === "[" || ch === "]") {
            return "bracket";
        }

        if (ch === ";" || ch === ":" || ch === ",") {
            return "punctuation";
        }

        if (ch === ".") {
            return "punctuation";
        }

        if (ch === "=" && stream.eat(">")) {
            return "arrow";
        }

        if (ch === "|") {
            if (!stream.eat("|")) {
                return "operator";
            }
            return "logical";
        }

        if (ch === "&" && stream.eat("&")) {
            return "logical";
        }

        if (ch === "!") {
            return "logical";
        }

        if ((ch === "=" && stream.eat("=")) ||
            (ch === "!" && stream.eat("=")) ||
            (ch === "<" && stream.eat("=")) ||
            (ch === ">" && stream.eat("="))) {
            return "comparison";
        }

        if (ch === "<" || ch === ">") {
            return "comparison";
        }

        if (ch === "=" ||
            (ch === "+" && stream.eat("=")) ||
            (ch === "-" && stream.eat("=")) ||
            (ch === "*" && stream.eat("=")) ||
            (ch === "/" && stream.eat("=")) ||
            (ch === "%" && stream.eat("="))) {
            return "operator";
        }

        if ((ch === "+" && stream.eat("+")) ||
            (ch === "-" && stream.eat("-"))) {
            return "operator";
        }

        if (isOperatorChar.test(ch)) {
            stream.eatWhile(isOperatorChar);
            return "operator";
        }

        if (isWordChar.test(ch) || ch === "$") {
            stream.eatWhile(/[a-zA-Z0-9_$]/);
            var word = stream.current();

            if (keywords.hasOwnProperty(word)) {
                return "keyword";
            }

            if (types.hasOwnProperty(word)) {
                return "type";
            }

            if (builtins.hasOwnProperty(word)) {
                return "builtin";
            }

            if (atoms.hasOwnProperty(word)) {
                return "atom";
            }

            return "variable";
        }

        return "error";
    }

    /**
     * Genera una función tokenizadora para cadenas.
     *
     * La cadena termina cuando vuelve a encontrarse la comilla de apertura
     * y esta no está escapada.
     *
     * @param {string} quote - Carácter delimitador de la cadena.
     * @returns {Function} Función tokenizadora para la cadena.
     */
    function tokenString(quote) {
        return function(stream, state) {
            var escaped = false;

            while (!stream.eol()) {
                var next = stream.next();
                if (next === quote && !escaped) {
                    state.tokenize = tokenBase;
                    break;
                }
                escaped = !escaped && next === "\\";
            }

            if (stream.eol()) {
                state.tokenize = tokenBase;
            }

            return "string";
        };
    }

    /**
     * Tokenizador para comentarios de bloque.
     *
     * Continúa leyendo hasta encontrar la secuencia de cierre "\*\/".
     *
     * @param {CodeMirror.StringStream} stream
     * @param {Object} state
     * @returns {string} Siempre devuelve "comment".
     */
    function tokenBlockComment(stream, state) {
        var maybeEnd = false;
        var ch;

        while (!stream.eol()) {
            ch = stream.next();
            if (ch === "/" && maybeEnd) {
                state.tokenize = tokenBase;
                break;
            }
            maybeEnd = (ch === "*");
        }

        return "comment";
    }

    return {
        startState: function() {
            return {
                tokenize: tokenBase,
                indented: 0,
                lastType: null
            };
        },

        token: function(stream, state) {
            if (stream.eatSpace()) {
                return null;
            }

            var style = state.tokenize(stream, state);

            if (stream.sol()) {
                state.indented = stream.indentation();
            }

            return style;
        },

        indent: function(state, textAfter) {
            var indentAfter = state.indented;

            if (textAfter && textAfter.charAt(0) === "}") {
                indentAfter = Math.max(0, indentAfter - indentUnit);
            }

            return indentAfter;
        },

        electricInput: /^\s*[\{\[\}]/,
        lineComment: "//",
        blockCommentStart: "/*",
        blockCommentEnd: "*/",
        fold: "brace",
        helperType: "eidos"
    };
});

CodeMirror.defineMIME("text/x-eidos", "eidos");