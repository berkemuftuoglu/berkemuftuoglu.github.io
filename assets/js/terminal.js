/**
 * TERMINAL TAKEOVER - Terminal Module
 * Handles xterm.js initialization, command parsing, and I/O
 */

class TerminalManager {
  constructor() {
    this.term = null;
    this.fitAddon = null;
    this.currentLine = '';
    this.cursorPosition = 0;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.cwd = '/home/berke'; // Current working directory
    this.filesystem = null;
    this.promptPrefix = () => `\x1b[1;32mberke@portfolio\x1b[0m:\x1b[1;34m${this.cwd}\x1b[0m$ `;
    this.adminMode = false;

    // Load command history from localStorage
    const saved = localStorage.getItem('terminal_history');
    if (saved) {
      try {
        this.commandHistory = JSON.parse(saved);
      } catch (e) {
        this.commandHistory = [];
      }
    }
  }

  async initialize() {
    const getFontSize = () => {
      if (window.innerWidth <= 480) return 11;
      if (window.innerWidth <= 768) return 12;
      return 14;
    };

    // Create terminal instance
    this.term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
      fontSize: getFontSize(),
      fontWeight: 400,
      lineHeight: 1.5,
      theme: {
        background: '#000000',
        foreground: '#00ff41',
        cursor: '#00ff41',
        cursorAccent: '#000000',
        selectionBackground: 'rgba(0, 255, 65, 0.3)',
        black: '#000000',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#8be9fd',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#a4ffff',
        brightMagenta: '#ff92df',
        brightCyan: '#a4ffff',
        brightWhite: '#ffffff'
      },
      allowProposedApi: true
    });

    // Initialize FitAddon
    this.fitAddon = new FitAddon.FitAddon();
    this.term.loadAddon(this.fitAddon);

    // Mount terminal
    const container = document.getElementById('terminal');
    this.term.open(container);
    this.fitAddon.fit();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.term.options.fontSize = getFontSize();
      this.fitAddon.fit();
    });

    // Load filesystem
    await this.loadFilesystem();

    // Show welcome message
    this.showWelcome();

    // Display prompt
    this.displayPrompt();

    // Handle keyboard input
    this.term.onData(data => this.handleInput(data));

    // Focus terminal
    this.term.focus();
  }

  async loadFilesystem() {
    try {
      const response = await fetch('data/filesystem.json');
      this.filesystem = await response.json();
    } catch (error) {
      this.writeLine('\x1b[1;31mERROR:\x1b[0m Failed to load filesystem');
      this.filesystem = { '/': { type: 'directory', name: '/', children: [] } };
    }
  }

  showWelcome() {
    const welcome = `
\x1b[1;32m╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ██████╗ ███████╗██████╗ ██╗  ██╗███████╗   ███████╗██╗  ║
║   ██╔══██╗██╔════╝██╔══██╗██║ ██╔╝██╔════╝   ██╔════╝██║  ║
║   ██████╔╝█████╗  ██████╔╝█████╔╝ █████╗     ███████╗██║  ║
║   ██╔══██╗██╔══╝  ██╔══██╗██╔═██╗ ██╔══╝     ╚════██║██║  ║
║   ██████╔╝███████╗██║  ██║██║  ██╗███████╗██╗███████║██║  ║
║   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚═╝  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;36mBerke Muftuoglu - Interactive Portfolio Terminal\x1b[0m
\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m

System Status: \x1b[1;32mOPERATIONAL\x1b[0m
Role: Data Automation Engineer @ NossaData
Location: United Kingdom

\x1b[1;33mQuick Start:\x1b[0m
  • Type \x1b[1;36mhelp\x1b[0m to see available commands
  • Type \x1b[1;36mls\x1b[0m to list directories
  • Type \x1b[1;36mcat README.md\x1b[0m to get started
  • Use \x1b[1;36mTab\x1b[0m for autocomplete, \x1b[1;36m↑/↓\x1b[0m for history

\x1b[1;35mTip:\x1b[0m Start with \x1b[1;36mhelp\x1b[0m to explore sections quickly.

\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
`;
    this.term.write(welcome);
  }

  displayPrompt() {
    this.term.write('\r\n' + this.promptPrefix());
  }

  handleInput(data) {
    const ord = data.charCodeAt(0);

    // Enter key (execute command)
    if (ord === 13) { // \r
      this.term.write('\r\n');
      const command = this.currentLine.trim();

      if (command) {
        this.executeCommand(command);
        this.addToHistory(command);
      }

      this.currentLine = '';
      this.cursorPosition = 0;
      this.displayPrompt();
      return;
    }

    // Backspace
    if (ord === 127) {
      if (this.cursorPosition > 0) {
        this.currentLine =
          this.currentLine.substring(0, this.cursorPosition - 1) +
          this.currentLine.substring(this.cursorPosition);
        this.cursorPosition--;
        this.term.write('\b \b');

        // Redraw the rest of the line
        if (this.cursorPosition < this.currentLine.length) {
          this.term.write(this.currentLine.substring(this.cursorPosition) + ' ');
          for (let i = 0; i <= this.currentLine.length - this.cursorPosition; i++) {
            this.term.write('\b');
          }
        }
      }
      return;
    }

    // Tab (autocomplete)
    if (ord === 9) {
      // TODO: Implement autocomplete
      return;
    }

    // Ctrl+C
    if (ord === 3) {
      this.term.write('^C');
      this.currentLine = '';
      this.cursorPosition = 0;
      this.displayPrompt();
      return;
    }

    // Ctrl+L (clear)
    if (ord === 12) {
      this.term.clear();
      this.displayPrompt();
      return;
    }

    // Arrow keys and escape sequences
    if (ord === 27) { // ESC
      if (data.length === 3) {
        if (data[1] === '[') {
          switch (data[2]) {
            case 'A': // Up arrow
              this.navigateHistory(-1);
              return;
            case 'B': // Down arrow
              this.navigateHistory(1);
              return;
            case 'C': // Right arrow
              if (this.cursorPosition < this.currentLine.length) {
                this.term.write(data);
                this.cursorPosition++;
              }
              return;
            case 'D': // Left arrow
              if (this.cursorPosition > 0) {
                this.term.write(data);
                this.cursorPosition--;
              }
              return;
          }
        }
      }
      return;
    }

    // Regular character
    if (ord >= 32 && ord < 127) {
      this.currentLine =
        this.currentLine.substring(0, this.cursorPosition) +
        data +
        this.currentLine.substring(this.cursorPosition);
      this.cursorPosition++;
      this.term.write(data);

      // Redraw the rest of the line if needed
      if (this.cursorPosition < this.currentLine.length) {
        this.term.write(this.currentLine.substring(this.cursorPosition));
        for (let i = this.cursorPosition; i < this.currentLine.length; i++) {
          this.term.write('\b');
        }
      }
    }
  }

  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;

    // Clear current line
    for (let i = 0; i < this.currentLine.length; i++) {
      this.term.write('\b \b');
    }

    if (direction === -1) {
      // Up arrow
      if (this.historyIndex === -1) {
        this.historyIndex = this.commandHistory.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }
    } else {
      // Down arrow
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
      } else {
        this.historyIndex = -1;
        this.currentLine = '';
        this.cursorPosition = 0;
        return;
      }
    }

    if (this.historyIndex >= 0) {
      this.currentLine = this.commandHistory[this.historyIndex];
      this.cursorPosition = this.currentLine.length;
      this.term.write(this.currentLine);
    }
  }

  addToHistory(command) {
    // Don't add duplicate consecutive commands
    if (this.commandHistory[this.commandHistory.length - 1] !== command) {
      this.commandHistory.push(command);
      // Limit history to 100 commands
      if (this.commandHistory.length > 100) {
        this.commandHistory.shift();
      }
      // Save to localStorage
      localStorage.setItem('terminal_history', JSON.stringify(this.commandHistory));
    }
    this.historyIndex = -1;
  }

  executeCommand(input) {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check if command exists in COMMANDS registry (from commands.js)
    if (typeof COMMANDS !== 'undefined' && COMMANDS[command]) {
      try {
        const result = COMMANDS[command].execute(args, this.cwd, this);
        if (result && result.output) {
          this.write(result.output);
        }
        if (result && result.cwd) {
          this.cwd = result.cwd;
        }
      } catch (error) {
        this.writeLine(`\x1b[1;31mError executing command:\x1b[0m ${error.message}`);
      }
    } else {
      this.writeLine(`\x1b[1;31mCommand not found:\x1b[0m ${command}`);
      this.writeLine(`Type \x1b[1;36mhelp\x1b[0m for available commands.`);
    }
  }

  write(text) {
    this.term.write(text);
  }

  writeLine(text) {
    this.term.write(text + '\r\n');
  }

  getFileContent(path) {
    // Resolve path
    const fullPath = this.resolvePath(path);

    if (this.filesystem[fullPath]) {
      const item = this.filesystem[fullPath];
      if (item.type === 'file') {
        return item.content || `[Empty file: ${fullPath}]`;
      } else {
        return null; // It's a directory
      }
    }
    return null;
  }

  listDirectory(path) {
    const fullPath = this.resolvePath(path);

    if (this.filesystem[fullPath]) {
      const item = this.filesystem[fullPath];
      if (item.type === 'directory') {
        return item.children || [];
      }
    }
    return null;
  }

  resolvePath(path) {
    // Handle absolute paths
    if (path.startsWith('/')) {
      return this.normalizePath(path);
    }

    // Handle relative paths
    if (path === '.') {
      return this.cwd;
    }

    if (path === '..') {
      const parts = this.cwd.split('/').filter(p => p);
      parts.pop();
      return '/' + parts.join('/');
    }

    // Combine cwd with path
    const combined = this.cwd === '/' ? '/' + path : this.cwd + '/' + path;
    return this.normalizePath(combined);
  }

  normalizePath(path) {
    const parts = path.split('/').filter(p => p);
    const resolved = [];

    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else if (part !== '.') {
        resolved.push(part);
      }
    }

    return '/' + resolved.join('/');
  }

  pathExists(path) {
    const fullPath = this.resolvePath(path);
    return !!this.filesystem[fullPath];
  }

  isDirectory(path) {
    const fullPath = this.resolvePath(path);
    return this.filesystem[fullPath]?.type === 'directory';
  }

  isFile(path) {
    const fullPath = this.resolvePath(path);
    return this.filesystem[fullPath]?.type === 'file';
  }

  clear() {
    this.term.clear();
  }

  applyTheme(themeName) {
    const themes = {
      matrix: {
        background: '#000000',
        foreground: '#00ff41',
        cursor: '#00ff41'
      },
      hacker: {
        background: '#000000',
        foreground: '#ffb000',
        cursor: '#ffb000'
      },
      dracula: {
        background: '#282a36',
        foreground: '#f8f8f2',
        cursor: '#ff79c6'
      },
      solarized: {
        background: '#002b36',
        foreground: '#839496',
        cursor: '#268bd2'
      },
      monokai: {
        background: '#272822',
        foreground: '#f8f8f2',
        cursor: '#f92672'
      }
    };

    if (themes[themeName]) {
      this.term.options.theme = { ...this.term.options.theme, ...themes[themeName] };
      document.body.className = `theme-${themeName}`;
      localStorage.setItem('terminal_theme', themeName);
      return true;
    }
    return false;
  }
}

// Global terminal instance
let terminal = null;
