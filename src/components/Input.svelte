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

  let isLoading = false;

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      const prompt = command.trim();

      if (!prompt || isLoading) {
        return;
      }

      isLoading = true;
      const currentCommand = command;
      command = '';
      
      const output = await handleChat(prompt);

      if (output === 'CLEAR_COMMAND') {
        $history = [];
      } else if (output === 'STREAMING_COMPLETE') {
        // Chat streaming is already handled by handleChat updating the store
      } else if (output) {
        // Standard command response
        $history = [...$history, { command: currentCommand, outputs: [output] }];
      }

      isLoading = false;
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
    class={`w-full bg-transparent outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    type="text"
    style={`color: ${$theme.foreground}`}
    bind:value={command}
    on:keydown={handleKeyDown}
    bind:this={input}
    disabled={isLoading}
    autocomplete="off"
    spellcheck="false"
  />
</div>
