/**
 * TERMINAL TAKEOVER - Commands Registry
 * All available terminal commands and their implementations
 */

const COMMANDS = {
  // ===== BASIC FILE COMMANDS =====

  ls: {
    execute: (args, cwd, term) => {
      const path = args[0] || '.';
      const children = term.listDirectory(path);

      if (children === null) {
        if (term.pathExists(path)) {
          return { output: `\x1b[1;31mls: ${path}: Not a directory\x1b[0m\r\n` };
        } else {
          return { output: `\x1b[1;31mls: ${path}: No such file or directory\x1b[0m\r\n` };
        }
      }

      if (children.length === 0) {
        return { output: '' };
      }

      let output = '';
      children.forEach((child, index) => {
        const fullPath = term.resolvePath(path === '.' ? child : `${path}/${child}`);
        const isDir = term.isDirectory(fullPath);

        if (isDir) {
          output += `\x1b[1;34m${child}/\x1b[0m  `;
        } else {
          output += `\x1b[0m${child}\x1b[0m  `;
        }

        if ((index + 1) % 4 === 0) {
          output += '\r\n';
        }
      });

      return { output: output + '\r\n' };
    },
    help: 'List directory contents'
  },

  cd: {
    execute: (args, cwd, term) => {
      if (args.length === 0) {
        return { output: '', cwd: '/home/berke' };
      }

      const path = args[0];
      const newPath = term.resolvePath(path);

      if (!term.pathExists(newPath)) {
        return { output: `\x1b[1;31mcd: ${path}: No such file or directory\x1b[0m\r\n` };
      }

      if (!term.isDirectory(newPath)) {
        return { output: `\x1b[1;31mcd: ${path}: Not a directory\x1b[0m\r\n` };
      }

      return { output: '', cwd: newPath };
    },
    help: 'Change directory'
  },

  pwd: {
    execute: (args, cwd, term) => {
      return { output: cwd + '\r\n' };
    },
    help: 'Print working directory'
  },

  cat: {
    execute: (args, cwd, term) => {
      if (args.length === 0) {
        return { output: '\x1b[1;31mcat: missing file operand\x1b[0m\r\n' };
      }

      const path = args[0];
      const content = term.getFileContent(path);

      if (content === null) {
        if (term.isDirectory(path)) {
          return { output: `\x1b[1;31mcat: ${path}: Is a directory\x1b[0m\r\n` };
        } else {
          return { output: `\x1b[1;31mcat: ${path}: No such file or directory\x1b[0m\r\n` };
        }
      }

      return { output: content + '\r\n' };
    },
    help: 'Display file contents'
  },

  clear: {
    execute: (args, cwd, term) => {
      term.clear();
      return { output: '' };
    },
    help: 'Clear the terminal screen'
  },

  // ===== GIT COMMANDS =====

  git: {
    execute: (args, cwd, term) => {
      if (args.length === 0 || args[0] === '--help') {
        return {
          output: `usage: git <command> [<args>]

Available commands:
  \x1b[1;36mlog\x1b[0m        Show commit history (career timeline)
  \x1b[1;36mshow\x1b[0m       Show commit details (job details)
  \x1b[1;36mstatus\x1b[0m     Show working tree status

Type 'git <command> --help' for more info.
\r\n`
        };
      }

      const subcommand = args[0];

      if (subcommand === 'log') {
        return {
          output: `\x1b[1;33mcommit a4f7e2b3\x1b[0m (HEAD -> main)
Author: Berke Muftuoglu <berkemuftuoglu1@gmail.com>
Date:   2025-04-01

    feat: joined NossaData as Data Automation Engineer

\x1b[1;33mcommit c8e9a1d2\x1b[0m
Author: Berke Muftuoglu <berkemuftuoglu1@gmail.com>
Date:   2024-11-01

    feat: completed MSc in Emerging Digital Technologies at UCL

\x1b[1;33mcommit b7d6c3e4\x1b[0m
Author: Berke Muftuoglu <berkemuftuoglu1@gmail.com>
Date:   2024-10-01

    feat: completed research at NetraScale (Federated Learning)

\x1b[1;33mcommit a3f7e8c2\x1b[0m
Author: Berke Muftuoglu <berkemuftuoglu1@gmail.com>
Date:   2023-08-01

    feat: completed DevOps internship at BtcTurk

\x1b[1;33mcommit d4a8f7e2\x1b[0m
Author: Berke Muftuoglu <berkemuftuoglu1@gmail.com>
Date:   2023-05-31

    feat: graduated with First-Class Honours (BSc CS) from KCL

Type 'git show <hash>' to see details.
\r\n`
        };
      }

      if (subcommand === 'show') {
        const hash = args[1] || 'a3f7e8c2';
        if (hash === 'a3f7e8c2') {
          return {
            output: `\x1b[1;33mcommit a3f7e8c2\x1b[0m
Author: Berke Muftuoglu <berkemuftuoglu1@gmail.com>
Date:   Summer 2023

    feat: completed DevOps internship at BtcTurk

    - Built infrastructure as code with Terraform and Ansible
    - Configured CI/CD pipelines in Azure DevOps
    - Implemented Velero backup/disaster recovery for Kubernetes
    - Worked across hybrid cloud and on-prem environments

    Technologies: Terraform, Ansible, Azure DevOps, Kubernetes, Docker
\r\n`
          };
        }
        return { output: `\x1b[1;31mgit: commit not found\x1b[0m\r\nTry: git log\r\n` };
      }

      if (subcommand === 'status') {
        return {
          output: `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
\r\n`
        };
      }

      return { output: `\x1b[1;31mgit: '${subcommand}' is not a git command. See 'git --help'.\x1b[0m\r\n` };
    },
    help: 'Git version control commands'
  },

  // ===== DOCKER/KUBERNETES COMMANDS =====

  docker: {
    execute: (args, cwd, term) => {
      if (args.length === 0 || args[0] !== 'ps') {
        return {
          output: `Usage: docker ps\r\n\x1b[90mShows running skill containers\x1b[0m\r\n`
        };
      }

      return {
        output: `CONTAINER ID   IMAGE              STATUS        NOTES
\x1b[1;36ma3f7e8c2\x1b[0m       aws:latest         Running       \x1b[1;32mCloud infrastructure\x1b[0m
\x1b[1;36m7b2d4f19\x1b[0m       kubernetes:1.28    Running       \x1b[1;32mContainer orchestration\x1b[0m
\x1b[1;36mc8e9a3b1\x1b[0m       python:3.11        Running       \x1b[1;32mAutomation and scripting\x1b[0m
\x1b[1;36md4a8f7e2\x1b[0m       terraform:latest   Running       \x1b[1;32mInfrastructure as code\x1b[0m
\x1b[1;36me5b9c3a4\x1b[0m       graphql:latest     Running       \x1b[1;32mAPI development\x1b[0m
\r\n`
      };
    },
    help: 'Docker commands (try: docker ps)'
  },

  kubectl: {
    execute: (args, cwd, term) => {
      if (args.length < 2 || args[0] !== 'get' || args[1] !== 'pods') {
        return {
          output: `Usage: kubectl get pods\r\n\x1b[90mShows active project pods\x1b[0m\r\n`
        };
      }

      return {
        output: `NAME                           READY   STATUS    RESTARTS   AGE
\x1b[1;32mnossa-data-automation-0\x1b[0m        1/1     Running   0          11mo
\x1b[1;32mnetrascale-research-0\x1b[0m          1/1     Running   0          8mo (completed)
\x1b[1;32mbtcturk-devops-0\x1b[0m               1/1     Running   0          3mo (archived)
\x1b[1;32mgetir-microservices-0\x1b[0m         1/1     Running   0          3mo (archived)
\r\n`
      };
    },
    help: 'Kubernetes commands (try: kubectl get pods)'
  },

  // ===== SYSTEM INFO COMMANDS =====

  top: {
    execute: (args, cwd, term) => {
      return {
        output: `top - Live Skill Monitoring
\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m

  PID   USER   CPU%   MEM%   PROCESS
  \x1b[1;36m1337\x1b[0m  berke  \x1b[1;32m92%\x1b[0m    \x1b[1;32m87%\x1b[0m    aws
  \x1b[1;36m1338\x1b[0m  berke  \x1b[1;32m88%\x1b[0m    \x1b[1;32m85%\x1b[0m    kubernetes
  \x1b[1;36m1339\x1b[0m  berke  \x1b[1;32m90%\x1b[0m    \x1b[1;32m82%\x1b[0m    python
  \x1b[1;36m1340\x1b[0m  berke  \x1b[1;32m85%\x1b[0m    \x1b[1;32m80%\x1b[0m    terraform
  \x1b[1;36m1341\x1b[0m  berke  \x1b[1;33m75%\x1b[0m    \x1b[1;33m72%\x1b[0m    docker
  \x1b[1;36m1342\x1b[0m  berke  \x1b[1;33m70%\x1b[0m    \x1b[1;33m68%\x1b[0m    linux
  \x1b[1;36m1343\x1b[0m  berke  \x1b[1;33m65%\x1b[0m    \x1b[1;33m60%\x1b[0m    cicd

\x1b[90mType any command to continue.\x1b[0m
\r\n`
      };
    },
    help: 'Display running processes (skills)'
  },

  tree: {
    execute: (args, cwd, term) => {
      return {
        output: `/
├── home/
│   └── berke/
│       ├── experience/
│       │   ├── nossa-data.yml
│       │   ├── netrascale.yml
│       │   ├── btcturk.yml
│       │   └── getir.yml
│       ├── skills/
│       │   ├── cloud.txt
│       │   ├── containers.txt
│       │   ├── languages.txt
│       │   └── tools.txt
│       ├── education/
│       │   ├── ucl-msc.txt
│       │   └── kcl-bsc.txt
│       ├── certifications/
│       │   ├── aws.txt
│       │   ├── wine.txt
│       │   └── scuba.txt
│       ├── about.txt
│       └── resume.txt
├── var/log/
│   ├── system.log
│   └── goals.log
├── etc/
│   └── contact.conf
└── README.md

\x1b[1;32m8 directories, 18 files\x1b[0m
\r\n`
      };
    },
    help: 'Display directory tree'
  },

  // ===== HELP & INFO =====

  help: {
    execute: (args, cwd, term) => {
      return {
        output: `\x1b[1;36mAVAILABLE COMMANDS\x1b[0m
\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m

\x1b[1;33mFile System:\x1b[0m
  \x1b[1;36mls\x1b[0m         List directory contents
  \x1b[1;36mcd\x1b[0m         Change directory
  \x1b[1;36mpwd\x1b[0m        Print working directory
  \x1b[1;36mcat\x1b[0m        Display file contents
  \x1b[1;36mtree\x1b[0m       Display directory tree

\x1b[1;33mGit:\x1b[0m
  \x1b[1;36mgit log\x1b[0m    Show career timeline as commits
  \x1b[1;36mgit show\x1b[0m   Show commit details (job info)

\x1b[1;33mContainers:\x1b[0m
  \x1b[1;36mdocker ps\x1b[0m  Show running skill containers
  \x1b[1;36mkubectl get pods\x1b[0m  Show project pods

\x1b[1;33mSystem:\x1b[0m
  \x1b[1;36mtop\x1b[0m        Display skill usage
  \x1b[1;36mtheme\x1b[0m      Change terminal theme
  \x1b[1;36mclear\x1b[0m      Clear terminal
  \x1b[1;36mhistory\x1b[0m    Show command history
  \x1b[1;36mexitx1b[0m       Exit terminal (fake logout)

\x1b[1;33mUtility:\x1b[0m
  \x1b[1;36mcurl\x1b[0m       Fetch URL (limited)
  \x1b[1;36mssh contact\x1b[0m  Open email
  \x1b[1;36mwhoami\x1b[0m     Display current user

\x1b[1;35mHidden Commands:\x1b[0m
  Try: git log, docker ps, kubectl get pods, cat /home/berke/about.txt

\x1b[90mType a command name for more info. Use Tab for autocomplete.\x1b[0m
\r\n`
      };
    },
    help: 'Display this help message'
  },

  man: {
    execute: (args, cwd, term) => {
      if (args.length === 0) {
        return { output: 'What manual page do you want?\r\nTry: man help\r\n' };
      }

      const cmd = args[0];
      if (COMMANDS[cmd]) {
        return {
          output: `\x1b[1mNAME\x1b[0m
    ${cmd} - ${COMMANDS[cmd].help}

\x1b[1mSYNOPSIS\x1b[0m
    ${cmd} [options]

Type 'help' to see all commands.
\r\n`
        };
      }

      return { output: `\x1b[1;31mNo manual entry for ${cmd}\x1b[0m\r\n` };
    },
    help: 'Display manual page for command'
  },

  history: {
    execute: (args, cwd, term) => {
      if (term.commandHistory.length === 0) {
        return { output: '\x1b[90mNo command history yet.\x1b[0m\r\n' };
      }

      let output = '';
      term.commandHistory.slice(-20).forEach((cmd, index) => {
        output += `  ${index + 1}  ${cmd}\r\n`;
      });

      return { output: output };
    },
    help: 'Show command history'
  },

  // ===== THEME COMMANDS =====

  theme: {
    execute: (args, cwd, term) => {
      if (args.length === 0 || args[0] === '--list') {
        return {
          output: `\x1b[1;36mAVAILABLE THEMES:\x1b[0m
  \x1b[1;32mmatrix\x1b[0m      Green on black (default)
  \x1b[1;33mhacker\x1b[0m      Amber on black
  \x1b[1;35mdracula\x1b[0m     Purple/pink on dark gray
  \x1b[1;36msolarized\x1b[0m   Solarized Dark
  \x1b[1;31mmonokai\x1b[0m     Monokai (Sublime Text)

Usage: theme <name>
\r\n`
        };
      }

      const themeName = args[0];
      if (term.applyTheme(themeName)) {
        return { output: `\x1b[1;32mTheme changed to: ${themeName}\x1b[0m\r\n` };
      } else {
        return { output: `\x1b[1;31mUnknown theme: ${themeName}\x1b[0m\r\nType 'theme --list' to see available themes.\r\n` };
      }
    },
    help: 'Change terminal color theme'
  },

  // ===== UTILITY COMMANDS =====

  whoami: {
    execute: (args, cwd, term) => {
      return { output: 'berke\r\n' };
    },
    help: 'Display current user'
  },

  exit: {
    execute: (args, cwd, term) => {
      term.writeLine('\x1b[1;33mLogging out...\x1b[0m');
      term.writeLine('Connection to portfolio closed.');
      setTimeout(() => {
        term.clear();
        term.showWelcome();
        term.displayPrompt();
      }, 1500);
      return { output: '' };
    },
    help: 'Exit terminal (fake logout)'
  },

  ssh: {
    execute: (args, cwd, term) => {
      if (args.length === 0 || args[0] !== 'contact') {
        return { output: 'Usage: ssh contact\r\n\x1b[90mOpens email client\x1b[0m\r\n' };
      }

      term.writeLine('\x1b[1;32mConnecting to contact@berke.sh...\x1b[0m');
      term.writeLine('Opening email client...');

      setTimeout(() => {
        window.location.href = 'mailto:berkemuftuoglu1@gmail.com?subject=Hello from your portfolio!';
      }, 1000);

      return { output: '' };
    },
    help: 'SSH to contact (opens email)'
  },

  curl: {
    execute: (args, cwd, term) => {
      if (args.length === 0) {
        return { output: 'curl: no URL specified\r\nUsage: curl <url>\r\n' };
      }

      const url = args[0];

      // Easter egg: wttr.in weather
      if (url.includes('wttr.in')) {
        return {
          output: `Fetching weather from ${url}...\r\n\x1b[90mIn a real terminal, this would show ASCII weather.\x1b[0m\r\n\x1b[1;36mTry: curl wttr.in/London\x1b[0m (requires external API)\r\n`
        };
      }

      return {
        output: `curl: ${url}\r\n\x1b[90mExternal requests are limited for security.\x1b[0m\r\n`
      };
    },
    help: 'Fetch URL (limited functionality)'
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = COMMANDS;
}
