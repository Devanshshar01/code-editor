import * as monaco from 'monaco-editor';

// Python-specific configuration for enhanced IntelliSense
export const pythonLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '#',
    blockComment: ["'''", "'''"]
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string'] },
    { open: "'", close: "'", notIn: ['string', 'comment'] },
    { open: '"""', close: '"""' },
    { open: "'''", close: "'''" }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '"""', close: '"""' },
    { open: "'''", close: "'''" }
  ],
  indentationRules: {
    increaseIndentPattern: /^(\s*|\s*#.*)?(class|def|elif|else|except|finally|for|if|try|while|with)\b.*:/,
    decreaseIndentPattern: /^\s*(elif|else|except|finally)\b.*/
  }
};

// Python keywords for syntax highlighting
export const pythonKeywords = [
  'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 
  'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 
  'lambda', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 
  'yield', 'None', 'True', 'False', 'async', 'await', 'nonlocal'
];

// Python built-in functions
export const pythonBuiltins = [
  'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 
  'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 
  'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 
  'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 
  'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 
  'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 
  'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 
  'zip', '__import__'
];

// Python standard library modules
export const pythonStandardLibrary = [
  'os', 'sys', 'math', 'random', 'datetime', 'json', 're', 'collections', 
  'itertools', 'functools', 'operator', 'pathlib', 'urllib', 'http', 'csv', 
  'sqlite3', 'pickle', 'xml', 'html', 'base64', 'hashlib', 'hmac', 'secrets',
  'threading', 'multiprocessing', 'subprocess', 'socket', 'select', 'asyncio',
  'unittest', 'doctest', 'logging', 'argparse', 'configparser', 'gettext',
  'locale', 'calendar', 'time', 'zoneinfo', 'statistics', 'decimal', 'fractions',
  'random', 'bisect', 'array', 'queue', 'heapq', 'weakref', 'types', 'copy',
  'pprint', 'reprlib', 'enum', 'dataclasses', 'typing', 'contextlib', 'abc',
  'traceback', 'linecache', 'gc', 'inspect', 'site', 'importlib'
];

// Python snippets for auto-completion
export const pythonSnippets = [
  {
    label: 'def',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Function definition'
  },
  {
    label: 'class',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:parameters}):\n\t\t${3:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Class definition'
  },
  {
    label: 'classi', // class with inheritance
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'class ${1:ClassName}(${2:ParentClass}):\n\tdef __init__(self${3:parameters}):\n\t\t${4:super().__init__()}\n\t\t${5:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Class definition with inheritance'
  },
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'if ${1:condition}:\n\t${2:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'If statement'
  },
  {
    label: 'ifel',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${3:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'If-else statement'
  },
  {
    label: 'elif',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'elif ${1:condition}:\n\t${2:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Elif statement'
  },
  {
    label: 'for',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'for ${1:item} in ${2:items}:\n\t${3:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'For loop'
  },
  {
    label: 'forr', // for range loop
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'for ${1:i} in range(${2:n}):\n\t${3:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'For loop with range'
  },
  {
    label: 'while',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'while ${1:condition}:\n\t${2:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'While loop'
  },
  {
    label: 'try',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Try/except block'
  },
  {
    label: 'tryf', // try-finally
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:pass}\nfinally:\n\t${5:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Try/except/finally block'
  },
  {
    label: 'with',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'with ${1:expression} as ${2:variable}:\n\t${3:pass}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'With statement'
  },
  {
    label: 'list_comp',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '[${1:expression} for ${2:item} in ${3:items}]',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'List comprehension'
  },
  {
    label: 'dict_comp',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '{${1:key}: ${2:value} for ${3:item} in ${4:items}}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Dictionary comprehension'
  },
  {
    label: 'lambda',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'lambda ${1:parameter}: ${2:expression}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Lambda function'
  },
  {
    label: 'import',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'import ${1:module}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Import statement'
  },
  {
    label: 'from',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'from ${1:module} import ${2:object}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'From-import statement'
  },
  {
    label: 'main', // main function pattern
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'if __name__ == "__main__":\n\t${1:main()}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Main function guard'
  },
  {
    label: 'property',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '@property\ndef ${1:name}(self):\n\treturn self._${1:name}\n\n@${1:name}.setter\ndef ${1:name}(self, value):\n\tself._${1:name} = value',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Property with getter and setter'
  },
  {
    label: 'decorator',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'def ${1:decorator_name}(func):\n\tdef wrapper(*args, **kwargs):\n\t\t${2:# Do something before}\n\t\tresult = func(*args, **kwargs)\n\t\t${3:# Do something after}\n\t\treturn result\n\treturn wrapper',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Function decorator'
  }
];

// Configure Python language features
export function configurePythonLanguage() {
  // Register Python language configuration
  monaco.languages.setLanguageConfiguration('python', pythonLanguageConfig);
  
  // Register completion items for Python
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      
      const suggestions: monaco.languages.CompletionItem[] = [
        // Add keywords
        ...pythonKeywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range
        })),
        // Add built-ins
        ...pythonBuiltins.map(builtin => ({
          label: builtin,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: builtin,
          range: range
        })),
        // Add standard library modules
        ...pythonStandardLibrary.map(module => ({
          label: module,
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: module,
          range: range
        })),
        // Add snippets
        ...pythonSnippets.map(snippet => ({
          ...snippet,
          range: range
        }))
      ];
      
      return { suggestions };
    }
  });
  
  // Register hover provider for Python built-ins
  monaco.languages.registerHoverProvider('python', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;
      
      // Simple hover for built-in functions
      if (pythonBuiltins.includes(word.word)) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [
            { value: `**${word.word}**` },
            { value: `Python built-in function` }
          ]
        };
      }
      
      // Hover for standard library modules
      if (pythonStandardLibrary.includes(word.word)) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [
            { value: `**${word.word}**` },
            { value: `Python standard library module` }
          ]
        };
      }
      
      return null;
    }
  });
}