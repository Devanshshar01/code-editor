import axios, { AxiosError } from 'axios';

// Piston API - Free code execution service
const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

export interface ExecutionLanguage {
  language: string;
  version: string;
  aliases: string[];
}

export interface ExecutionRequest {
  language: string;
  version: string;
  files: Array<{
    name?: string;
    content: string;
  }>;
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

export interface ExecutionResult {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

// Map Monaco language IDs to Piston runtime IDs
const LANGUAGE_MAP: Record<string, { runtime: string; version: string; extension: string }> = {
  javascript: { runtime: 'javascript', version: '18.15.0', extension: 'js' },
  typescript: { runtime: 'typescript', version: '5.0.3', extension: 'ts' },
  python: { runtime: 'python', version: '3.10.0', extension: 'py' }, // Reverting to stable version
  java: { runtime: 'java', version: '15.0.2', extension: 'java' },
  cpp: { runtime: 'c++', version: '10.2.0', extension: 'cpp' },
  c: { runtime: 'c', version: '10.2.0', extension: 'c' },
  go: { runtime: 'go', version: '1.16.2', extension: 'go' },
  rust: { runtime: 'rust', version: '1.68.2', extension: 'rs' },
  php: { runtime: 'php', version: '8.2.3', extension: 'php' },
  ruby: { runtime: 'ruby', version: '3.0.1', extension: 'rb' },
  shell: { runtime: 'bash', version: '5.2.0', extension: 'sh' },
  sql: { runtime: 'sqlite', version: '3.36.0', extension: 'sql' },
};

// Python-specific execution options
const PYTHON_EXECUTION_OPTIONS = {
  // Extended timeout for Python programs that might need more time
  run_timeout: 10000,
  // Memory limit for Python programs (in bytes)
  run_memory_limit: 512000000, // 512 MB
  // Additional packages that can be imported
  allowed_packages: [
    'math', 'random', 'datetime', 'json', 'os', 'sys', 'collections', 
    'itertools', 'functools', 're', 'urllib', 'requests', 'numpy', 
    'pandas', 'matplotlib', 'scipy', 'sklearn'
  ]
};

class ExecutionService {
  async getAvailableLanguages(): Promise<ExecutionLanguage[]> {
    try {
      const response = await axios.get(`${PISTON_API_URL}/runtimes`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch available languages:', error);
      return [];
    }
  }

  async executeCode(
    code: string,
    language: string,
    stdin?: string
  ): Promise<ExecutionResult> {
    const languageConfig = LANGUAGE_MAP[language.toLowerCase()];
    
    if (!languageConfig) {
      throw new Error(`Language "${language}" is not supported for execution`);
    }

    // Python-specific enhancements
    let enhancedCode = code;
    if (language.toLowerCase() === 'python') {
      // Add common imports that are frequently used
      enhancedCode = this.enhancePythonCode(code);
    }

    // Ensure stdin ends with a newline for proper input handling
    const formattedStdin = stdin ? (stdin.endsWith('\n') ? stdin : `${stdin}\n`) : '';

    const request: ExecutionRequest = {
      language: languageConfig.runtime,
      version: languageConfig.version,
      files: [
        {
          name: `main.${languageConfig.extension}`,
          content: enhancedCode,
        },
      ],
      stdin: formattedStdin,
      compile_timeout: 10000,
      run_timeout: language.toLowerCase() === 'python' ? PYTHON_EXECUTION_OPTIONS.run_timeout : 3000,
      compile_memory_limit: -1,
      run_memory_limit: language.toLowerCase() === 'python' ? PYTHON_EXECUTION_OPTIONS.run_memory_limit : -1,
    };

    try {
      const response = await axios.post(`${PISTON_API_URL}/execute`, request);
      return response.data;
    } catch (error) {
      console.error('Code execution failed:', error);
      
      // Provide more specific error information
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // Server responded with error status
          const status = axiosError.response.status;
          const statusText = axiosError.response.statusText;
          throw new Error(`Execution server error (${status} ${statusText}). Please try again.`);
        } else if (axiosError.request) {
          // Request was made but no response received
          throw new Error('Unable to reach execution server. Please check your internet connection and try again.');
        } else {
          // Something else happened
          throw new Error(`Request setup error: ${axiosError.message}`);
        }
      } else {
        // Non-Axios error
        throw new Error(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Enhance Python code with common patterns and imports
  private enhancePythonCode(code: string): string {
    // Check if code already has common imports
    const hasPrint = code.includes('print(');
    const hasInput = code.includes('input(');
    
    // Add common imports if they might be needed
    let enhancedCode = code;
    
    // Add error handling for better user experience
    if (hasInput) {
      enhancedCode = `import sys
${code}`;
    }
    
    return enhancedCode;
  }

  // Execute Python code with additional packages
  async executePythonWithPackages(
    code: string,
    packages: string[] = [],
    stdin?: string
  ): Promise<ExecutionResult> {
    // Filter to only allowed packages
    const allowedPackages = packages.filter(pkg => 
      PYTHON_EXECUTION_OPTIONS.allowed_packages.includes(pkg)
    );
    
    // Add package imports to the code
    const importStatements = allowedPackages.map(pkg => `import ${pkg}`).join('\n');
    const enhancedCode = importStatements ? `${importStatements}\n\n${code}` : code;
    
    return this.executeCode(enhancedCode, 'python', stdin);
  }

  getSupportedLanguages(): string[] {
    return Object.keys(LANGUAGE_MAP);
  }

  isLanguageSupported(language: string): boolean {
    return language.toLowerCase() in LANGUAGE_MAP;
  }

  getLanguageInfo(language: string) {
    return LANGUAGE_MAP[language.toLowerCase()];
  }

  // Get Python-specific execution information
  getPythonExecutionInfo() {
    return {
      version: LANGUAGE_MAP.python.version,
      runtime: LANGUAGE_MAP.python.runtime,
      extension: LANGUAGE_MAP.python.extension,
      timeout: PYTHON_EXECUTION_OPTIONS.run_timeout,
      memoryLimit: PYTHON_EXECUTION_OPTIONS.run_memory_limit,
      allowedPackages: PYTHON_EXECUTION_OPTIONS.allowed_packages
    };
  }
}

export const executionService = new ExecutionService();