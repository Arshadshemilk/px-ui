import packageJson from '../../package.json';
import { todoManager } from './todo';

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
        const response = await fetch('http://localhost:8080/completion', {
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
        return data.content || 'No response from model.';
      } catch (error) {
        console.error('Llama.cpp connection error:', error);
        return `[ERROR] Could not connect to llama.cpp on port 8080. 
        
Make sure the server is running with:
'./llama-server -m models/llama-3-8b.gguf --port 8080'`;
      }
  }
};