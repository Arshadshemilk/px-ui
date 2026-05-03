<script lang="ts">
  import { theme } from '../stores/theme';

  export let specs = {
    model: 'Llama-3-8B-Instruct-Q4_K_M',
    tokenSpeed: '42.5 tokens/sec',
    gpu: 'RTX 4090 24GB',
    vram: '8.4 GB / 24 GB',
    loadTime: '1.2s'
  };

  export let logs = [
    '[INFO] Model loaded successfully',
    '[INFO] KV Cache initialized',
    '[DEBUG] Tokenizer ready',
    '[INFO] EA-llama.cpp engine started'
  ];
</script>

<div class="flex flex-col h-full border-l-2 pl-4" style={`border-color: ${$theme.green};`}>
  <!-- Top Section: AI Specs -->
  <div class="flex-1 py-4">
    <h2 class="text-xl font-bold mb-4" style={`color: ${$theme.yellow}`}>AI SPECS</h2>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="opacity-70">Model:</span>
        <span style={`color: ${$theme.blue}`}>{specs.model}</span>
      </div>
      <div class="flex justify-between">
        <span class="opacity-70">Speed:</span>
        <span style={`color: ${$theme.green}`}>{specs.tokenSpeed}</span>
      </div>
      <div class="flex justify-between">
        <span class="opacity-70">GPU:</span>
        <span style={`color: ${$theme.cyan}`}>{specs.gpu}</span>
      </div>
      <div class="flex justify-between">
        <span class="opacity-70">VRAM:</span>
        <span style={`color: ${$theme.purple}`}>{specs.vram}</span>
      </div>
      <div class="flex justify-between">
        <span class="opacity-70">Load:</span>
        <span style={`color: ${$theme.yellow}`}>{specs.loadTime}</span>
      </div>
    </div>
  </div>

  <!-- Bottom Section: Logs/System -->
  <div class="flex-1 border-t-2 py-4" style={`border-color: ${$theme.green};`}>
    <h2 class="text-xl font-bold mb-4" style={`color: ${$theme.red}`}>SYSTEM LOGS</h2>
    <div class="space-y-1 font-mono text-[10px] opacity-60">
      {#each logs as log}
        <p>{log}</p>
      {/each}
    </div>
  </div>
</div>
