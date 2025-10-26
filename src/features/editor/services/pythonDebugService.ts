// Python Debug Service
// This service provides debugging capabilities for Python code in the browser

export interface DebugPoint {
  id: string;
  lineNumber: number;
  enabled: boolean;
}

export interface DebugVariable {
  name: string;
  value: string;
  type: string;
}

export interface DebugStackFrame {
  id: string;
  name: string;
  line: number;
  filename: string;
}

export interface DebugState {
  isRunning: boolean;
  currentLine: number | null;
  variables: DebugVariable[];
  stackFrames: DebugStackFrame[];
  breakpoints: DebugPoint[];
}

class PythonDebugService {
  private debugState: DebugState = {
    isRunning: false,
    currentLine: null,
    variables: [],
    stackFrames: [],
    breakpoints: []
  };

  private onStateChangeCallbacks: ((state: DebugState) => void)[] = [];

  // Set a breakpoint
  public setBreakpoint(lineNumber: number): DebugPoint {
    const existing = this.debugState.breakpoints.find(bp => bp.lineNumber === lineNumber);
    if (existing) {
      return existing;
    }

    const breakpoint: DebugPoint = {
      id: this.generateId(),
      lineNumber,
      enabled: true
    };

    this.debugState.breakpoints.push(breakpoint);
    this.notifyStateChange();
    return breakpoint;
  }

  // Remove a breakpoint
  public removeBreakpoint(lineNumber: number): void {
    this.debugState.breakpoints = this.debugState.breakpoints.filter(
      bp => bp.lineNumber !== lineNumber
    );
    this.notifyStateChange();
  }

  // Toggle breakpoint enabled state
  public toggleBreakpoint(lineNumber: number): void {
    const breakpoint = this.debugState.breakpoints.find(bp => bp.lineNumber === lineNumber);
    if (breakpoint) {
      breakpoint.enabled = !breakpoint.enabled;
      this.notifyStateChange();
    }
  }

  // Start debugging session
  public async startDebugging(code: string): Promise<void> {
    this.debugState.isRunning = true;
    this.debugState.currentLine = 1;
    this.notifyStateChange();

    // In a real implementation, this would connect to a Python debugger
    // For now, we'll simulate a simple debugging session
    await this.simulateDebugging(code);
  }

  // Stop debugging session
  public stopDebugging(): void {
    this.debugState.isRunning = false;
    this.debugState.currentLine = null;
    this.debugState.variables = [];
    this.debugState.stackFrames = [];
    this.notifyStateChange();
  }

  // Step over to next line
  public stepOver(): void {
    if (this.debugState.currentLine !== null) {
      this.debugState.currentLine += 1;
      this.notifyStateChange();
    }
  }

  // Step into function
  public stepInto(): void {
    if (this.debugState.currentLine !== null) {
      this.debugState.currentLine += 1;
      this.notifyStateChange();
    }
  }

  // Step out of function
  public stepOut(): void {
    if (this.debugState.currentLine !== null) {
      this.debugState.currentLine += 1;
      this.notifyStateChange();
    }
  }

  // Continue execution
  public continueExecution(): void {
    this.debugState.isRunning = true;
    this.debugState.currentLine = null;
    this.notifyStateChange();
  }

  // Get current debug state
  public getDebugState(): DebugState {
    return { ...this.debugState };
  }

  // Subscribe to debug state changes
  public onStateChange(callback: (state: DebugState) => void): void {
    this.onStateChangeCallbacks.push(callback);
  }

  // Unsubscribe from debug state changes
  public offStateChange(callback: (state: DebugState) => void): void {
    this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
  }

  // Simulate debugging process (in a real implementation, this would connect to a Python debugger)
  private async simulateDebugging(code: string): Promise<void> {
    // Parse code to extract variables and functions
    const lines = code.split('\n');
    
    // Simulate variables
    this.debugState.variables = [
      { name: 'x', value: '10', type: 'int' },
      { name: 'y', value: "'hello'", type: 'str' },
      { name: 'items', value: '[1, 2, 3]', type: 'list' }
    ];

    // Simulate stack frames
    this.debugState.stackFrames = [
      { id: '1', name: '<module>', line: 1, filename: 'main.py' },
      { id: '2', name: 'process_data', line: 5, filename: 'main.py' }
    ];

    // Simulate execution line by line
    for (let i = 1; i <= lines.length; i++) {
      if (!this.debugState.isRunning) break;
      
      this.debugState.currentLine = i;
      this.notifyStateChange();
      
      // Check for breakpoints
      const breakpoint = this.debugState.breakpoints.find(
        bp => bp.lineNumber === i && bp.enabled
      );
      
      if (breakpoint) {
        this.debugState.isRunning = false;
        this.notifyStateChange();
        break;
      }
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Notify all subscribers of state changes
  private notifyStateChange(): void {
    const state = this.getDebugState();
    this.onStateChangeCallbacks.forEach(callback => callback(state));
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Evaluate expression in debug context
  public async evaluateExpression(expression: string): Promise<string> {
    // In a real implementation, this would evaluate the expression in the debug context
    // For now, we'll return a simulated result
    if (expression === 'x') {
      return '10';
    } else if (expression === 'y') {
      return "'hello'";
    } else if (expression === 'items') {
      return '[1, 2, 3]';
    } else {
      return `<${expression}>`;
    }
  }

  // Get breakpoints
  public getBreakpoints(): DebugPoint[] {
    return [...this.debugState.breakpoints];
  }

  // Check if there's a breakpoint at a specific line
  public hasBreakpointAt(lineNumber: number): boolean {
    return this.debugState.breakpoints.some(
      bp => bp.lineNumber === lineNumber && bp.enabled
    );
  }
}

// Create a singleton instance
export const pythonDebugService = new PythonDebugService();