import packageJson from '../../package.json';
import { todoManager } from './todo';
import { pushLog, updateTimings } from '../stores/system';
import { history } from '../stores/history';

export const handleChat = async (prompt: string): Promise<string | void> => {
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
        pushLog(`Streaming request: ${prompt.substring(0, 30)}...`);
        
        // Add user command to history and prepare placeholder for AI response
        history.update(h => [...h, { command: prompt, outputs: [''] }]);
        const historyIdx = (await new Promise(r => {
          const unsub = history.subscribe(h => {
            r(h.length - 1);
            unsub();
          });
        })) as number;

        const response = await fetch('https://ideal-acorn-69vvg4gqpg4wfrwr7-8080.app.github.dev/completion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `### Instruction: ${prompt}\n\n### Response:`,
            n_predict: 400,
            temperature: 0.7,
            stop: ['### Instruction:', 'User:', 'AI:', '\n\n'],
            stream: true,
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const reader = response.body?.getReader();
        if (!reader) throw new Error('ReadableStream not supported');
        
        const decoder = new TextDecoder();
        let fullContent = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the partial line in the buffer
          
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                history.update(h => {
                  const newHistory = [...h];
                  newHistory[historyIdx].outputs = [fullContent];
                  return newHistory;
                });
              }
              
              if (data.stop && data.timings) {
                const evalMs = data.timings.predicted_ms || data.timings.prompt_ms || 0;
                const n = data.timings.predicted_n || data.timings.prompt_n || 0;
                
                if (evalMs > 0 && n > 0) {
                  updateTimings(evalMs, n);
                  pushLog(`Stream finished: ${n} tokens in ${evalMs.toFixed(0)}ms (${(n / (evalMs / 1000)).toFixed(2)} t/s)`);
                }
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          }
        }
        return 'STREAMING_COMPLETE';
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