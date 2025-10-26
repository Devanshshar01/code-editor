import * as monaco from 'monaco-editor';
import { configurePythonLanguage } from '../utils/pythonConfig';

// Python Language Server integration
// This is a simplified client-side implementation that simulates
// some of the features of a full Python language server

interface PythonSymbol {
  name: string;
  kind: monaco.languages.SymbolKind;
  location: {
    uri: string;
    range: monaco.IRange;
  };
}

interface PythonDiagnostic {
  range: monaco.IRange;
  message: string;
  severity: monaco.MarkerSeverity;
}

class PythonLanguageService {
  private symbols: PythonSymbol[] = [];
  private diagnostics: PythonDiagnostic[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Configure Python language in Monaco
    configurePythonLanguage();
    
    // Register providers for Python language features
    this.registerProviders();
  }

  private registerProviders() {
    // Register document symbol provider for Python
    monaco.languages.registerDocumentSymbolProvider('python', {
      provideDocumentSymbols: (model, token) => {
        return this.getDocumentSymbols(model);
      }
    });

    // Register definition provider for Python
    monaco.languages.registerDefinitionProvider('python', {
      provideDefinition: (model, position, token) => {
        return this.getDefinition(model, position);
      }
    });

    // Register diagnostic provider for Python
    monaco.languages.registerDocumentFormattingEditProvider('python', {
      provideDocumentFormattingEdits: (model, options, token) => {
        return this.formatDocument(model, options);
      }
    });
  }

  private getDocumentSymbols(model: monaco.editor.ITextModel): monaco.languages.DocumentSymbol[] {
    const symbols: monaco.languages.DocumentSymbol[] = [];
    const lines = model.getLinesContent();
    
    lines.forEach((line, index) => {
      // Find class definitions
      const classMatch = line.match(/^class\s+(\w+)/);
      if (classMatch) {
        symbols.push({
          name: classMatch[1],
          kind: monaco.languages.SymbolKind.Class,
          range: new monaco.Range(index + 1, 1, index + 1, line.length + 1),
          selectionRange: new monaco.Range(index + 1, 7, index + 1, 7 + classMatch[1].length),
          detail: 'class',
          tags: []
        });
      }
      
      // Find function definitions
      const functionMatch = line.match(/^def\s+(\w+)/);
      if (functionMatch) {
        symbols.push({
          name: functionMatch[1],
          kind: monaco.languages.SymbolKind.Function,
          range: new monaco.Range(index + 1, 1, index + 1, line.length + 1),
          selectionRange: new monaco.Range(index + 1, 5, index + 1, 5 + functionMatch[1].length),
          detail: 'function',
          tags: []
        });
      }
    });
    
    return symbols;
  }

  private getDefinition(model: monaco.editor.ITextModel, position: monaco.Position): monaco.languages.Location[] {
    const word = model.getWordAtPosition(position);
    if (!word) return [];
    
    // Simple implementation - in a real language server, this would be more sophisticated
    const locations: monaco.languages.Location[] = [];
    const lines = model.getLinesContent();
    
    lines.forEach((line, index) => {
      // Check for class or function definitions that match the word
      const classMatch = line.match(new RegExp(`^class\\s+${word.word}`));
      const functionMatch = line.match(new RegExp(`^def\\s+${word.word}`));
      
      if (classMatch || functionMatch) {
        locations.push({
          uri: model.uri,
          range: new monaco.Range(index + 1, 1, index + 1, line.length + 1)
        });
      }
    });
    
    return locations;
  }

  private formatDocument(model: monaco.editor.ITextModel, options: monaco.languages.FormattingOptions): monaco.languages.TextEdit[] {
    // Simple formatting implementation
    const text = model.getValue();
    const formattedText = this.formatPythonCode(text);
    
    return [{
      range: model.getFullModelRange(),
      text: formattedText
    }];
  }

  private formatPythonCode(code: string): string {
    // Basic Python formatting - in a real implementation, this would be more sophisticated
    return code
      .replace(/,\s*([}\])])/g, '$1') // Remove trailing commas before closing brackets
      .replace(/([({\[])\s+/g, '$1') // Remove spaces after opening brackets
      .replace(/\s+([)}\]])/g, '$1'); // Remove spaces before closing brackets
  }

  // Simulate diagnostics (error checking)
  public validatePythonCode(model: monaco.editor.ITextModel): void {
    const markers: monaco.editor.IMarkerData[] = [];
    const lines = model.getLinesContent();
    
    lines.forEach((line, lineNumber) => {
      // Check for common Python syntax errors
      if (line.includes('\t') && line.includes(' ')) {
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: 'Mixed tabs and spaces',
          startLineNumber: lineNumber + 1,
          startColumn: 1,
          endLineNumber: lineNumber + 1,
          endColumn: line.length + 1
        });
      }
      
      // Check for lines longer than 79 characters (PEP 8)
      if (line.length > 79) {
        markers.push({
          severity: monaco.MarkerSeverity.Info,
          message: 'Line too long (PEP 8 recommends 79 characters)',
          startLineNumber: lineNumber + 1,
          startColumn: 80,
          endLineNumber: lineNumber + 1,
          endColumn: line.length + 1
        });
      }
    });
    
    monaco.editor.setModelMarkers(model, 'python', markers);
  }

  // Enhanced IntelliSense with context-aware suggestions
  public provideEnhancedCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position): monaco.languages.CompletionItem[] {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };
    
    const suggestions: monaco.languages.CompletionItem[] = [];
    
    // Context-aware suggestions
    const line = model.getLineContent(position.lineNumber);
    const linePrefix = line.substring(0, position.column - 1);
    
    // If we're after a dot, suggest object methods/properties
    if (linePrefix.endsWith('.')) {
      // In a real implementation, this would analyze the object type
      suggestions.push(
        ...['append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index', 'count', 'sort', 'reverse', 'copy']
          .map(method => ({
            label: method,
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: method,
            range: range
          }))
      );
    } 
    // If we're at the beginning of a line or after indentation, suggest statements
    else if (/^\s*$/.test(linePrefix) || linePrefix.trim() === '') {
      suggestions.push(
        ...['if', 'for', 'while', 'def', 'class', 'try', 'with', 'import', 'from', 'return', 'yield', 'raise', 'assert', 'pass', 'break', 'continue']
          .map(keyword => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            range: range
          }))
      );
    }
    // Otherwise, provide general suggestions
    else {
      suggestions.push(
        ...this.getPythonKeywords().map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range
        }))
      );
    }
    
    return suggestions;
  }

  private getPythonKeywords(): string[] {
    return [
      'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 
      'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 
      'lambda', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 
      'yield', 'None', 'True', 'False', 'async', 'await', 'nonlocal'
    ];
  }
}

// Create a singleton instance
export const pythonLanguageService = new PythonLanguageService();

// Initialize the service when the module is loaded
export function initializePythonLanguageService() {
  return pythonLanguageService;
}