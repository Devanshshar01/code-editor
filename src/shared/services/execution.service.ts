import axios from 'axios';

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
  python: { runtime: 'python', version: '3.10.0', extension: 'py' },
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

    const request: ExecutionRequest = {
      language: languageConfig.runtime,
      version: languageConfig.version,
      files: [
        {
          name: `main.${languageConfig.extension}`,
          content: code,
        },
      ],
      stdin: stdin || '',
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    };

    try {
      const response = await axios.post(`${PISTON_API_URL}/execute`, request);
      return response.data;
    } catch (error) {
      console.error('Code execution failed:', error);
      throw new Error('Failed to execute code. Please try again.');
    }
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
}

export const executionService = new ExecutionService();
