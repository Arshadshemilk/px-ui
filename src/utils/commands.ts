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
      // Mock AI response logic for non-commands
      return `[Llama-3] ${prompt.length > 20 ? 'Analyzing your request...' : 'Processing...'}
      
Based on my knowledge base, here is a response to: "${prompt}"

This is a simulated AI response from the EA-llama.cpp engine. In a production environment, this would call a local or remote LLM API. The terminal is now purely chat-focused.`;
  }
};