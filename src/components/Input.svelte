<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import { handleChat } from '../utils/commands';

  let command = '';
  let historyIndex = -1;

  let input: HTMLInputElement;

  onMount(() => {
    input.focus();
  });

  afterUpdate(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      const prompt = command.trim();

      if (!prompt) {
        return;
      }

      const output = await handleChat(prompt);

      if (output === 'CLEAR_COMMAND') {
        $history = [];
      } else {
        $history = [...$history, { command: prompt, outputs: [output] }];
      }

      command = '';
      historyIndex = -1;
    } else if (event.key === 'ArrowUp') {
      if (historyIndex < $history.length - 1) {
        historyIndex++;
        command = $history[$history.length - 1 - historyIndex].command;
      }
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      if (historyIndex > -1) {
        historyIndex--;
        command = historyIndex >= 0 ? $history[$history.length - 1 - historyIndex].command : '';
      }
      event.preventDefault();
    } else if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      $history = [];
    }
  };
</script>

<svelte:window on:click={() => input.focus()} />

<div class="flex w-full items-center">
  <span class="font-bold mr-2 whitespace-nowrap" style={`color: ${$theme.green}`}>❯</span>

  <input
    id="command-input"
    name="command-input"
    aria-label="Chat input"
    class="w-full bg-transparent outline-none"
    type="text"
    style={`color: ${$theme.foreground}`}
    bind:value={command}
    on:keydown={handleKeyDown}
    bind:this={input}
    autocomplete="off"
    spellcheck="false"
  />
</div>
