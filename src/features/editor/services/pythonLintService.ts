import * as monaco from 'monaco-editor';

// Python linting rules
interface PythonLintRule {
  code: string;
  message: string;
  severity: monaco.MarkerSeverity;
  pattern?: RegExp;
}

// Common Python linting rules
const PYTHON_LINT_RULES: PythonLintRule[] = [
  {
    code: 'E101',
    message: 'Indentation contains mixed spaces and tabs',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /^.*[\t]+.*[ ]+.*$/
  },
  {
    code: 'E111',
    message: 'Indentation is not a multiple of 4',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /^[\s]+.*$/
  },
  {
    code: 'E112',
    message: 'Expected an indented block',
    severity: monaco.MarkerSeverity.Error,
    pattern: /^.*:\s*$/
  },
  {
    code: 'E113',
    message: 'Unexpected indentation',
    severity: monaco.MarkerSeverity.Error,
    pattern: /^[\s]+.*$/
  },
  {
    code: 'E121',
    message: 'Continuation line under-indented for hanging indent',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E122',
    message: 'Continuation line missing indentation or outdented',
    severity: monaco.MarkerSeverity.Error
  },
  {
    code: 'E201',
    message: 'Whitespace after "("',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\(\s+/
  },
  {
    code: 'E202',
    message: 'Whitespace before ")"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\s+\)/
  },
  {
    code: 'E203',
    message: 'Whitespace before ":"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\s+:/
  },
  {
    code: 'E211',
    message: 'Whitespace before "("',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\w\s+\(/
  },
  {
    code: 'E221',
    message: 'Multiple spaces before operator',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\w\s{2,}[+\-*/=<>]/
  },
  {
    code: 'E222',
    message: 'Multiple spaces after operator',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /[+\-*/=<>]\s{2,}\w/
  },
  {
    code: 'E225',
    message: 'Missing whitespace around operator',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\w[+\-*/=<>]\w/
  },
  {
    code: 'E231',
    message: 'Missing whitespace after ",", ";", or ":"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /[,;:]\w/
  },
  {
    code: 'E251',
    message: 'Unexpected spaces around keyword / parameter equals',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /=\s+\w+\s*=/
  },
  {
    code: 'E261',
    message: 'At least two spaces before inline comment',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\w\s+#/
  },
  {
    code: 'E262',
    message: 'Inline comment should start with "# "',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /#\w/
  },
  {
    code: 'E265',
    message: 'Block comment should start with "# "',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /^#\w/
  },
  {
    code: 'E266',
    message: 'Too many leading "#" for block comment',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /^#{2,}/
  },
  {
    code: 'E271',
    message: 'Multiple spaces after keyword',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\b(if|for|while|def|class|import|from|try|except|finally|with|as|elif|else|return|yield|raise|assert|del|pass|continue|break|global|nonlocal|lambda|and|or|not|in|is)\s{2,}/
  },
  {
    code: 'E272',
    message: 'Multiple spaces before keyword',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\s{2,}\b(if|for|while|def|class|import|from|try|except|finally|with|as|elif|else|return|yield|raise|assert|del|pass|continue|break|global|nonlocal|lambda|and|or|not|in|is)\b/
  },
  {
    code: 'E301',
    message: 'Expected 1 blank line, found 0',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E302',
    message: 'Expected 2 blank lines, found 0',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E303',
    message: 'Too many blank lines',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E305',
    message: 'Expected 2 blank lines after end of function or class',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E401',
    message: 'Multiple imports on one line',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /import\s+\w+,\s*\w+/
  },
  {
    code: 'E402',
    message: 'Module level import not at top of file',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E501',
    message: 'Line too long (82 > 79 characters)',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E502',
    message: 'The backslash is redundant between brackets',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'E701',
    message: 'Multiple statements on one line (colon)',
    severity: monaco.MarkerSeverity.Error,
    pattern: /.*:.*;/
  },
  {
    code: 'E702',
    message: 'Multiple statements on one line (semicolon)',
    severity: monaco.MarkerSeverity.Error,
    pattern: /.*;.*;/
  },
  {
    code: 'E703',
    message: 'Statement ends with a semicolon',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /.*;$/
  },
  {
    code: 'E711',
    message: 'Comparison to None should be "if cond is None:"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /==\s*None/
  },
  {
    code: 'E712',
    message: 'Comparison to True should be "if cond is True:" or "if cond:"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /==\s*True/
  },
  {
    code: 'E713',
    message: 'Test for membership should be "not in"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /not\s+\w+\s+in\s+\w+/
  },
  {
    code: 'E714',
    message: 'Test for object identity should be "is not"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /not\s+\w+\s+is\s+\w+/
  },
  {
    code: 'E721',
    message: 'Do not compare types, use "isinstance()"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /type\([^)]*\)\s*==/
  },
  {
    code: 'E722',
    message: 'Do not use bare except, specify exception instead',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /except\s*:/
  },
  {
    code: 'E731',
    message: 'Do not assign a lambda expression, use a def',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\w+\s*=\s*lambda\s+/
  },
  {
    code: 'E741',
    message: 'Do not use variables named "l", "O", or "I"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\b(l|O|I)\b\s*=/
  },
  {
    code: 'E742',
    message: 'Do not define classes named "l", "O", or "I"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /class\s+(l|O|I)\b/
  },
  {
    code: 'E743',
    message: 'Do not define functions named "l", "O", or "I"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /def\s+(l|O|I)\b/
  },
  {
    code: 'E901',
    message: 'SyntaxError or IndentationError',
    severity: monaco.MarkerSeverity.Error
  },
  {
    code: 'E902',
    message: 'IOError',
    severity: monaco.MarkerSeverity.Error
  },
  {
    code: 'W191',
    message: 'Indentation contains tabs',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /^\t+/
  },
  {
    code: 'W291',
    message: 'Trailing whitespace',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\s+$/
  },
  {
    code: 'W292',
    message: 'No newline at end of file',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'W293',
    message: 'Blank line contains whitespace',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /^\s+$/
  },
  {
    code: 'W391',
    message: 'Blank line at end of file',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'W503',
    message: 'Line break occurred before a binary operator',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'W504',
    message: 'Line break occurred after a binary operator',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'W601',
    message: '.has_key() is deprecated, use "in"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /\.has_key\(/
  },
  {
    code: 'W602',
    message: 'Deprecated form of raising exception',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /raise\s+\w+,\s*/
  },
  {
    code: 'W603',
    message: '"<>" is deprecated, use "!="',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /<>/
  },
  {
    code: 'W604',
    message: 'Backticks are deprecated, use "repr()"',
    severity: monaco.MarkerSeverity.Warning,
    pattern: /`.*`/
  },
  {
    code: 'W605',
    message: 'Invalid escape sequence',
    severity: monaco.MarkerSeverity.Warning
  },
  {
    code: 'W606',
    message: '"async" and "await" are reserved keywords starting with Python 3.7',
    severity: monaco.MarkerSeverity.Warning
  }
];

// Python formatting rules
interface PythonFormatRule {
  name: string;
  description: string;
  apply: (code: string) => string;
}

// Simple Python formatter
const PYTHON_FORMAT_RULES: PythonFormatRule[] = [
  {
    name: 'removeTrailingWhitespace',
    description: 'Remove trailing whitespace from lines',
    apply: (code: string) => {
      return code.split('\n').map(line => line.trimEnd()).join('\n');
    }
  },
  {
    name: 'ensureNewlineAtEnd',
    description: 'Ensure file ends with a newline',
    apply: (code: string) => {
      return code.endsWith('\n') ? code : code + '\n';
    }
  },
  {
    name: 'normalizeQuotes',
    description: 'Normalize string quotes to single quotes',
    apply: (code: string) => {
      // This is a simplified implementation
      return code.replace(/"([^"]*)"/g, "'$1'");
    }
  },
  {
    name: 'addMissingWhitespace',
    description: 'Add missing whitespace around operators',
    apply: (code: string) => {
      return code
        .replace(/(\w)([+\-*/=<>])(\w)/g, '$1 $2 $3')
        .replace(/([+\-*/=<>])(\w)/g, '$1 $2')
        .replace(/(\w)([+\-*/=<>])/g, '$1 $2');
    }
  }
];

class PythonLintService {
  // Lint Python code and return diagnostics
  public lintPythonCode(model: monaco.editor.ITextModel): monaco.editor.IMarkerData[] {
    const markers: monaco.editor.IMarkerData[] = [];
    const lines = model.getLinesContent();
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check each lint rule
      PYTHON_LINT_RULES.forEach(rule => {
        // Skip rules without patterns (they need more complex analysis)
        if (!rule.pattern) return;
        
        // Check if the line matches the pattern
        if (rule.pattern.test(line)) {
          markers.push({
            severity: rule.severity,
            message: rule.message,
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
            code: rule.code
          });
        }
      });
      
      // Check line length (PEP 8)
      if (line.length > 79) {
        const e501Rule = PYTHON_LINT_RULES.find(rule => rule.code === 'E501');
        if (e501Rule) {
          markers.push({
            severity: e501Rule.severity,
            message: e501Rule.message,
            startLineNumber: lineNumber,
            startColumn: 80,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
            code: e501Rule.code
          });
        }
      }
    });
    
    return markers;
  }

  // Format Python code
  public formatPythonCode(code: string): string {
    let formattedCode = code;
    
    // Apply each formatting rule
    PYTHON_FORMAT_RULES.forEach(rule => {
      formattedCode = rule.apply(formattedCode);
    });
    
    return formattedCode;
  }

  // Get linting rules
  public getLintRules(): PythonLintRule[] {
    return [...PYTHON_LINT_RULES];
  }

  // Get formatting rules
  public getFormatRules(): PythonFormatRule[] {
    return [...PYTHON_FORMAT_RULES];
  }

  // Set markers in the editor
  public setMarkers(model: monaco.editor.ITextModel, markers: monaco.editor.IMarkerData[]): void {
    monaco.editor.setModelMarkers(model, 'python', markers);
  }
}

// Create a singleton instance
export const pythonLintService = new PythonLintService();