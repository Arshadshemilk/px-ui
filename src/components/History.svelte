<script lang="ts">
  import { history } from '../stores/history';
  import { theme } from '../stores/theme';
  import Ps1 from './Ps1.svelte';
</script>

{#each $history as { command, outputs }}
  <div class="mb-2" style={`color: ${$theme.foreground}`}>
    <!-- User Input -->
    {#if command !== 'system'}
      <div class="flex items-center">
        <span class="font-bold mr-2" style={`color: ${$theme.green}`}>❯</span>
        <span class="opacity-90 font-bold">{command}</span>
      </div>
    {/if}

    <!-- AI Response -->
    {#each outputs as output}
      <div class="flex items-start mt-1">
        <span class="font-bold mr-2 shrink-0" style={`color: ${$theme.red}`}>❯</span>
        <p class="whitespace-pre-wrap opacity-80 flex-1">
          {output}
        </p>
      </div>
    {/each}
  </div>
{/each}
