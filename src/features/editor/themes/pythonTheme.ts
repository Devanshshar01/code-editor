import * as monaco from 'monaco-editor';

// Define custom Python syntax highlighting rules
export const pythonThemeRules = [
  // Keywords
  { token: 'keyword.python', foreground: '569cd6' }, // Blue
  { token: 'keyword.control.python', foreground: 'c586c0' }, // Purple
  { token: 'keyword.operator.python', foreground: 'd4d4d4' }, // Light gray
  
  // Built-ins
  { token: 'support.function.builtin.python', foreground: '4ec9b0' }, // Teal
  { token: 'support.type.python', foreground: '4ec9b0' }, // Teal
  
  // Functions
  { token: 'function', foreground: 'dcdcaa' },
  { token: 'method', foreground: 'dcdcaa' },
  
  // Classes
  { token: 'class', foreground: '4ec9b0' },
  { token: 'interface', foreground: '4ec9b0' },
  
  // Variables
  { token: 'variable', foreground: '9cdcfe' },
  { token: 'parameter', foreground: '9cdcfe' },
  
  // Properties
  { token: 'property', foreground: '9cdcfe' },
  
  // Enums
  { token: 'enum', foreground: '4ec9b0' },
  
  // Decorators
  { token: 'decorator', foreground: 'd7ba7d' },
  
  // Comments
  { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
  
  // Strings
  { token: 'string', foreground: 'ce9178' },
  
  // Numbers
  { token: 'number', foreground: 'b5cea8' },
  
  // Types
  { token: 'type', foreground: '4ec9b0' },
  
  // Operators
  { token: 'operator', foreground: 'd4d4d4' },
  
  // Namespace
  { token: 'namespace', foreground: '9cdcfe' }
];

// Define custom Python theme for Monaco Editor
export const pythonTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: pythonThemeRules,
  colors: {
    // Editor background
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    
    // Line numbers
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#c6c6c6',
    
    // Selection
    'editor.selectionBackground': '#264f78',
    'editor.inactiveSelectionBackground': '#3a3d41',
    
    // Cursor
    'editorCursor.foreground': '#aeafad',
    
    // Whitespace
    'editorWhitespace.foreground': '#3b3a32',
    
    // Indent guides
    'editorIndentGuide.background': '#404040',
    'editorIndentGuide.activeBackground': '#707070',
    
    // Current line
    'editor.lineHighlightBackground': '#2a2d2e',
    'editor.lineHighlightBorder': '#282828',
    
    // Brackets
    'editorBracketMatch.background': '#0064001a',
    'editorBracketMatch.border': '#888888',
    
    // Find matches
    'editor.findMatchBackground': '#515c6a',
    'editor.findMatchHighlightBackground': '#ea5c0055',
    
    // Comments
    'editorCommentsWidget.resolvedBorder': '#6a9955',
    'editorCommentsWidget.unresolvedBorder': '#6a9955',
    
    // Gutter
    'editorGutter.background': '#1e1e1e',
    'editorGutter.modifiedBackground': '#0c7d9d',
    'editorGutter.addedBackground': '#587c0c',
    'editorGutter.deletedBackground': '#94151b',
    
    // Widget colors
    'widget.shadow': '#0000005c',
    'input.background': '#3c3c3c',
    'input.foreground': '#cccccc',
    'input.border': '#0000004d',
    'inputOption.activeBorder': '#007acc',
    'inputValidation.infoBackground': '#063b49',
    'inputValidation.infoBorder': '#007acc',
    'inputValidation.warningBackground': '#352a05',
    'inputValidation.warningBorder': '#b89500',
    'inputValidation.errorBackground': '#5a1d1d',
    'inputValidation.errorBorder': '#be1100',
    
    // Dropdown colors
    'dropdown.background': '#3c3c3c',
    'dropdown.foreground': '#cccccc',
    'dropdown.border': '#0000004d',
    
    // Lists and trees
    'list.focusBackground': '#062f4a',
    'list.focusForeground': '#ffffff',
    'list.activeSelectionBackground': '#094771',
    'list.activeSelectionForeground': '#ffffff',
    'list.inactiveSelectionBackground': '#37373d',
    'list.inactiveSelectionForeground': '#cccccc',
    'list.hoverBackground': '#2a2d2e',
    'list.hoverForeground': '#cccccc',
    
    // Scrollbar
    'scrollbar.shadow': '#000000',
    'scrollbarSlider.background': '#79797966',
    'scrollbarSlider.hoverBackground': '#646464b3',
    'scrollbarSlider.activeBackground': '#bfbfbf66',
    
    // Status bar
    'statusBar.foreground': '#ffffff',
    'statusBar.background': '#007acc',
    'statusBar.border': '#0000004d',
    'statusBar.debuggingBackground': '#cc6633',
    'statusBar.debuggingForeground': '#ffffff',
    'statusBar.noFolderBackground': '#68217a',
    'statusBar.noFolderForeground': '#ffffff',
    
    // Title bar
    'titleBar.activeBackground': '#3c3c3c',
    'titleBar.activeForeground': '#cccccc',
    'titleBar.inactiveBackground': '#3c3c3c99',
    'titleBar.inactiveForeground': '#cccccc99',
    'titleBar.border': '#0000004d',
  }
};

// Enhanced Python syntax highlighting with semantic tokens
export const pythonSemanticTokens = [
  // Functions
  { token: 'function', foreground: 'dcdcaa' },
  { token: 'method', foreground: 'dcdcaa' },
  
  // Classes
  { token: 'class', foreground: '4ec9b0' },
  { token: 'interface', foreground: '4ec9b0' },
  
  // Variables
  { token: 'variable', foreground: '9cdcfe' },
  { token: 'parameter', foreground: '9cdcfe' },
  
  // Properties
  { token: 'property', foreground: '9cdcfe' },
  
  // Enums
  { token: 'enum', foreground: '4ec9b0' },
  
  // Decorators
  { token: 'decorator', foreground: 'd7ba7d' },
  
  // Keywords
  { token: 'keyword', foreground: '569cd6' },
  
  // Comments
  { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
  
  // Strings
  { token: 'string', foreground: 'ce9178' },
  
  // Numbers
  { token: 'number', foreground: 'b5cea8' },
  
  // Types
  { token: 'type', foreground: '4ec9b0' },
  
  // Operators
  { token: 'operator', foreground: 'd4d4d4' },
  
  // Namespace
  { token: 'namespace', foreground: '9cdcfe' }
];

// Register the custom Python theme
export function registerPythonTheme() {
  monaco.editor.defineTheme('python-dark', pythonTheme);
}

// Enhanced syntax highlighting for Python
export function enhancePythonSyntaxHighlighting() {
  // Register the custom theme
  registerPythonTheme();
  
  // Add tokenization rules for better Python syntax highlighting
  monaco.languages.setMonarchTokensProvider('python', {
    keywords: [
      'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 
      'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 
      'lambda', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 
      'yield', 'None', 'True', 'False', 'async', 'await', 'nonlocal'
    ],
    
    operators: [
      '=', '==', '!=', '<', '<=', '>', '>=',
      '+', '-', '*', '/', '//', '%', '**',
      '+=', '-=', '*=', '/=', '%=', '**=',
      '&', '|', '^', '~', '<<', '>>',
      'and', 'or', 'not'
    ],
    
    builtins: [
      'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 
      'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 
      'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 
      'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 
      'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 
      'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 
      'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 
      'zip', '__import__'
    ],
    
    tokenizer: {
      root: [
        // identifiers and keywords
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@builtins': 'support.function.builtin',
            '@default': 'identifier'
          }
        }],
        
        // whitespace
        { include: '@whitespace' },
        
        // delimiters and operators
        [/[{}()\[\]]/, 'delimiter'],
        [/[<>](?!@symbols)/, 'delimiter'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],
        
        // numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],
        
        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/"""/, 'string', '@string_double_multiline'],
        [/'''/, 'string', '@string_single_multiline'],
      ],
      
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/#.*$/, 'comment'],
      ],
      
      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\[\\'"ntbrf]/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],
      
      string_single: [
        [/[^\\']+/, 'string'],
        [/\\[\\'"ntbrf]/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],
      
      string_double_multiline: [
        [/[^\\"]+/, 'string'],
        [/\\[\\'"ntbrf]/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"""/, 'string', '@pop'],
        [/"/, 'string']
      ],
      
      string_single_multiline: [
        [/[^\\']+/, 'string'],
        [/\\[\\'"ntbrf]/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'''/, 'string', '@pop'],
        [/'/, 'string']
      ],
    },
    
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    
    escapes: /\\[\\'"ntbrf]/,
  });
}