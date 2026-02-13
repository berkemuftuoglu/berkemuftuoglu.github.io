/**
 * TERMINAL TAKEOVER - Easter Eggs
 * Hidden commands and fun surprises
 */

// Add easter egg commands to the COMMANDS registry after it's loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof COMMANDS === 'undefined') {
    window.COMMANDS = {};
  }

  // ===== SUDO - Admin Mode =====
  COMMANDS.sudo = {
    execute: (args, cwd, term) => {
      if (term.adminMode) {
        return { output: '\x1b[1;33mYou are already in admin mode.\x1b[0m\r\nType exit_admin to return to normal mode.\r\n' };
      }

      term.writeLine('\x1b[1;35m[sudo]\x1b[0m password for berke:');

      // Simulate password input (we'll just check the current line)
      const checkPassword = () => {
        const password = term.currentLine.trim();

        if (password === 'devops_rules') {
          term.adminMode = true;
          term.currentLine = '';

          setTimeout(() => {
            term.clear();
            term.writeLine(`
\x1b[1;35m╔════════════════════════════════════════════════════════════╗
║            ADMIN MODE ACTIVATED                            ║
║            Welcome, Super User                             ║
╚════════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;33mFUN FACTS UNLOCKED:\x1b[0m
→ Berke can exit vim (unlike 99% of developers)
→ Dives to 30m depth (Advanced Open Water certified)
→ Knows the difference between Merlot and Cabernet (WSET Level 2)
→ Speaks 3 languages (EN/TR/ES)
→ Has never pushed to main on Friday (smart human)
→ Built this entire portfolio as a terminal (you're using it right now)

\x1b[1;32m📊 HIDDEN STATS:\x1b[0m
  Bugs squashed: 1,337
  Coffee consumed: Too much
  Uptime: 640+ days since graduation
  Git commits: Classified
  Kubernetes pods managed: Many

\x1b[1;36m🎯 SECRET COMMANDS:\x1b[0m
  \x1b[1;36mfortune\x1b[0m     Get a random fortune
  \x1b[1;36mmatrix\x1b[0m      Matrix effect in terminal
  \x1b[1;36mhack\x1b[0m        Hacker mode activated

Type \x1b[1;35mexit_admin\x1b[0m to return to normal mode.
`);
            term.displayPrompt();
          }, 500);

          return { output: '' };
        } else {
          term.writeLine('\x1b[1;31msudo: incorrect password attempt\x1b[0m');
          term.writeLine('\x1b[90mHint: Think about what DevOps engineers believe in... lowercase, underscore.\x1b[0m');
          term.displayPrompt();
          return { output: '' };
        }
      };

      // Override next enter key to check password
      const originalOnData = term.term.onData;
      const passwordHandler = (data) => {
        if (data.charCodeAt(0) === 13) { // Enter
          term.term.onData = originalOnData; // Restore original handler
          checkPassword();
        }
      };
      term.term.onData = passwordHandler;

      return { output: '' };
    },
    help: 'Run command as superuser (try password: devops_rules)'
  };

  COMMANDS.exit_admin = {
    execute: (args, cwd, term) => {
      if (!term.adminMode) {
        return { output: '\x1b[1;31mYou are not in admin mode.\x1b[0m\r\n' };
      }

      term.adminMode = false;
      return { output: '\x1b[1;33mExited admin mode. Welcome back to reality.\x1b[0m\r\n' };
    },
    help: 'Exit admin mode'
  };

  // ===== VIM - The classic trap =====
  COMMANDS.vim = {
    execute: (args, cwd, term) => {
      const filename = args[0] || 'resume.txt';

      term.clear();
      term.writeLine(`
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                          VIM - Vi IMproved                  \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                           version 9.0                        \x1b[0m
\x1b[1;32m~                      by Bram Moolenaar et al.                \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~            "${filename}" [New File]                          \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~              \x1b[1;33mType :q! to quit vim\x1b[0m                         \x1b[1;32m\x1b[0m
\x1b[1;32m~        \x1b[1;33m(This is a test. Can you escape?)\x1b[0m                 \x1b[1;32m\x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[1;32m~                                                              \x1b[0m
\x1b[0;7m                                                0,0-1         All\x1b[0m
`);

      // Set up vim mode
      term.inVimMode = true;
      term.vimCommand = '';

      return { output: '' };
    },
    help: 'Open vim text editor (good luck exiting!)'
  };

  // ===== SL - Steam Locomotive =====
  COMMANDS.sl = {
    execute: (args, cwd, term) => {
      term.writeLine('\x1b[1;33mYou typo\'d "ls" as "sl". Here\'s your punishment:\x1b[0m\r\n');

      const train = `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
   /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
  |      |  |   H  |__--------------------| [___] |   =|                        |
  | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
  |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
 |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
  \\_/      \\O=====O=====O=====O_/      \\_/               \\_/   \\_/    \\_/   \\_/
`;

      term.writeLine(train);
      term.writeLine('\x1b[1;32mChoo choo! Next time, type "ls" correctly.\x1b[0m\r\n');

      return { output: '' };
    },
    help: 'Typo of ls - steam locomotive animation'
  };

  // ===== COWSAY =====
  COMMANDS.cowsay = {
    execute: (args, cwd, term) => {
      const message = args.join(' ') || 'Hire Berke!';
      const msgLen = message.length;

      const cow = `
 ${'_'.repeat(msgLen + 2)}
< ${message} >
 ${'-'.repeat(msgLen + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;

      return { output: cow + '\r\n' };
    },
    help: 'Make a cow say something'
  };

  // ===== FORTUNE =====
  COMMANDS.fortune = {
    execute: (args, cwd, term) => {
      const fortunes = [
        "You will hire an amazing DevOps engineer today.",
        "A bug in production is worth two in testing.",
        "The best code is no code. The second best is automated code.",
        "Coffee: because debugging at 3 AM requires motivation.",
        "Kubernetes will scale your problems horizontally.",
        "There is no cloud. It's just someone else's computer.",
        "Pushing to main on Friday is a cry for help.",
        "If it's not monitored, it's not in production.",
        "Berke is available for hire. This is your fortune.",
        "Automate everything. Trust nothing. Monitor all."
      ];

      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      return { output: `\x1b[1;36m${fortune}\x1b[0m\r\n` };
    },
    help: 'Display a random fortune'
  };

  // ===== MATRIX EFFECT =====
  COMMANDS.matrix = {
    execute: (args, cwd, term) => {
      term.writeLine('\x1b[1;32mEntering the Matrix...\x1b[0m');
      term.writeLine('\x1b[90mPress Ctrl+C to exit\x1b[0m\r\n');

      let frameCount = 0;
      const maxFrames = 50;

      const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';

      const interval = setInterval(() => {
        let line = '';
        for (let i = 0; i < 80; i++) {
          line += matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        term.writeLine(`\x1b[1;32m${line}\x1b[0m`);

        frameCount++;
        if (frameCount >= maxFrames) {
          clearInterval(interval);
          term.writeLine('\r\n\x1b[1;36mYou are the One, Berke.\x1b[0m\r\n');
          term.displayPrompt();
        }
      }, 100);

      return { output: '' };
    },
    help: 'Matrix digital rain effect'
  };

  // ===== HACK - Hacker mode =====
  COMMANDS.hack = {
    execute: (args, cwd, term) => {
      term.writeLine('\x1b[1;31m[HACKER MODE ACTIVATED]\x1b[0m');
      term.writeLine('\x1b[1;32mInitializing...\x1b[0m\r\n');

      const messages = [
        'Connecting to mainframe...',
        'Bypassing firewall...',
        'Decrypting password hash...',
        'Uploading backdoor...',
        'Accessing classified files...',
        'Downloading Netflix database...',
        'Deleting browser history...',
        '\x1b[1;33mJust kidding. Berke would never hack.\x1b[0m',
        '\x1b[1;36mBut he could automate your entire infrastructure. 🚀\x1b[0m'
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < messages.length) {
          term.writeLine(`\x1b[1;32m[+]\x1b[0m ${messages[index]}`);
          index++;
        } else {
          clearInterval(interval);
          term.writeLine('\r\n\x1b[1;32mHack complete. (Not really.)\x1b[0m\r\n');
          term.displayPrompt();
        }
      }, 400);

      return { output: '' };
    },
    help: 'Activate hacker mode (fake)'
  };

  // ===== FORK BOMB - Harmless parody =====
  COMMANDS[':(){ :|:& };:'] = {
    execute: (args, cwd, term) => {
      return {
        output: `\x1b[1;31m:(){ :|:& };:\x1b[0m

\x1b[1;33mNice try!\x1b[0m

This is a fork bomb - a classic denial of service attack.
But this is just a portfolio, not a real system.

\x1b[1;32mBerke says:\x1b[0m "Not today, Satan."

\x1b[90mIf this were a real system, your processes would be forking
infinitely until the system crashed. But we're civilized here.\x1b[0m
\r\n`
      };
    },
    help: 'Fork bomb (harmless parody)'
  };

  // ===== HIRE_BERKE - The ultimate command =====
  COMMANDS.hire_berke = {
    execute: (args, cwd, term) => {
      return {
        output: `
\x1b[1;32m╔════════════════════════════════════════════════════════════╗
║                  RECRUITMENT PROTOCOL                      ║
╚════════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;36mInitiating recruitment process...\x1b[0m

\x1b[1;33mStep 1:\x1b[0m Review experience at /home/berke/experience ✓
\x1b[1;33mStep 2:\x1b[0m Check skills at /home/berke/skills ✓
\x1b[1;33mStep 3:\x1b[0m Read about Berke at /home/berke/about.txt ✓
\x1b[1;33mStep 4:\x1b[0m Contact via ssh contact ⟳

\x1b[1;32mBENEFITS OF HIRING BERKE:\x1b[0m
  ✓ Automates everything (including this portfolio)
  ✓ Never pushes to main on Friday
  ✓ Can actually exit vim
  ✓ Knows AWS, Kubernetes, Terraform, Python, and more
  ✓ Built this terminal portfolio from scratch
  ✓ Survived crypto infrastructure during bear market

\x1b[1;36mROI:\x1b[0m Infinite
\x1b[1;36mBugs:\x1b[0m Minimal
\x1b[1;36mCoffee Consumption:\x1b[0m High

Ready to hire? Run: \x1b[1;35mssh contact\x1b[0m
\r\n`
      };
    },
    help: 'Recruitment automation script'
  };

  // ===== KONAMI CODE - Hidden command =====
  let konamiSequence = [];
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.key);
    konamiSequence = konamiSequence.slice(-konamiCode.length);

    if (konamiSequence.join(',') === konamiCode.join(',')) {
      if (terminal) {
        terminal.clear();
        terminal.writeLine(`
\x1b[1;35m╔════════════════════════════════════════════════════════════╗
║            🎮 KONAMI CODE ACTIVATED! 🎮                    ║
╚════════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;33mYou found the secret!\x1b[0m

You've unlocked the ancient Konami code in a terminal portfolio.
Congratulations, you're a true nerd.

\x1b[1;36m+30 Lives\x1b[0m
\x1b[1;36m+Infinite Respect\x1b[0m
\x1b[1;36m+Access to secret command: \x1b[1;35msecret\x1b[0m

Type 'secret' to reveal Berke's ultimate secret...
`);
        terminal.displayPrompt();
      }
      konamiSequence = [];
    }
  });

  COMMANDS.secret = {
    execute: (args, cwd, term) => {
      return {
        output: `
\x1b[1;35m🔐 BERKE'S ULTIMATE SECRET:\x1b[0m

He's actually just a regular person who loves:
  • Automating boring stuff
  • Building reliable systems
  • Diving in the ocean
  • Drinking good wine
  • Learning new tech

\x1b[1;36mNo AI. No magic. Just hard work and coffee.\x1b[0m

(Oh, and he built this entire terminal portfolio to prove he can code.)

\x1b[1;32mWant to work with him? Type: ssh contact\x1b[0m
\r\n`
      };
    },
    help: 'Reveal the ultimate secret'
  };
});
