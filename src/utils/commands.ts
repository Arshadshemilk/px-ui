import packageJson from '../../package.json';
import { todoManager } from './todo';
import { pushLog, updateTimings } from '../stores/system';

export const handleChat = async (prompt: string): Promise<string> => {
  const [cmd, ...args] = prompt.trim().split(' ');
  const command = cmd.toLowerCase();

  switch (command) {
    case 'help':
      return `Available commands:
  help      - Show this help message
  todo      - Manage your tasks (add, list, complete, remove, clear, stats)
  about     - About this terminal
  repo      - Open the GitHub repository
  banner    - Show the banner
  clear     - Clear the terminal`;

    case 'clear':
      return 'CLEAR_COMMAND';

    case 'about':
      return `Terminal UI v${packageJson.version}
Author: ${packageJson.author.name}
License: ${packageJson.license}
Built with Svelte 4, TypeScript, and Tailwind CSS.
This is a modern, AI-enhanced terminal interface for local LLMs.`;

    case 'repo':
      window.open(packageJson.repository.url, '_blank');
      return `Opening repository: ${packageJson.repository.url}`;

    case 'banner':
      return `
██████╗ ██╗  ██╗      ██╗   ██╗██╗
██╔══██╗╚██╗██╔╝      ██║   ██║██║
██████╔╝ ╚███╔╝ █████╗██║   ██║██║
██╔═══╝  ██╔██╗ ╚════╝██║   ██║██║
██║     ██╔╝ ██╗      ╚██████╔╝██║
╚═╝     ╚═╝  ╚═╝       ╚═════╝ ╚═╝
PX-UI Terminal v${packageJson.version}
Type 'help' to see available commands.`;

    case 'todo':
      if (args.length === 0 || args[0] === 'list') {
        return todoManager.list();
      }
      const subCommand = args[0].toLowerCase();
      const subArgs = args.slice(1).join(' ');

      switch (subCommand) {
        case 'add':
          return subArgs ? todoManager.add(subArgs) : 'Usage: todo add <text>';
        case 'complete':
          return subArgs ? todoManager.complete(parseInt(subArgs)) : 'Usage: todo complete <id>';
        case 'remove':
          return subArgs ? todoManager.remove(parseInt(subArgs)) : 'Usage: todo remove <id>';
        case 'clear':
          return todoManager.clear(args[1] === 'completed');
        case 'stats':
          return todoManager.stats();
        default:
          return 'Unknown todo subcommand. Try: add, list, complete, remove, clear, stats';
      }

    default:
      try {
        pushLog(`Processing request: ${prompt.substring(0, 30)}...`);
        const response = await fetch('https://ideal-acorn-69vvg4gqpg4wfrwr7-8080.app.github.dev/completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `### Instruction: ${prompt}\n\n### Response:`,
            n_predict: 400,
            temperature: 0.7,
            stop: ['### Instruction:', 'User:', 'AI:', '\n\n'],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.timings) {
          updateTimings(data.timings.predicted_ms, data.timings.predicted_n);
          pushLog(`Response received: ${data.timings.predicted_n} tokens in ${data.timings.predicted_ms.toFixed(0)}ms`);
        }

        return data.content || 'No response from model.';
      } catch (error) {
        console.error('Llama.cpp connection error:', error);
        pushLog(`[ERROR] Connection failed: ${error}`);
        return `[ERROR] Could not connect to the remote llama.cpp server.
        
Status: 502 Bad Gateway (The URL is reachable, but the server inside the workspace isn't responding).

Checklist:
1. Is llama-server running in the Codespace?
2. Did you use '--host 0.0.0.0 --port 8080'?
3. Is port 8080 set to 'Public' in the Ports tab?`;
      }
  }
};