<script lang="ts">
  import { theme } from '../stores/theme';
  import { systemStats } from '../stores/system';
</script>

<div class="flex flex-col h-full pl-4">
  <!-- Top Section: AI Specs -->
  <div class="py-4">
    <h2 class="text-xl font-bold mb-4" style={`color: ${$theme.yellow}`}>AI SPECS</h2>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between border-b border-white/10 pb-1">
        <span class="opacity-70">Model:</span>
        <span style={`color: ${$theme.blue}`} class="text-right ml-2">{$systemStats.model}</span>
      </div>
      <div class="flex justify-between border-b border-white/10 pb-1">
        <span class="opacity-70">Context:</span>
        <span style={`color: ${$theme.green}`}>{$systemStats.n_ctx} tokens</span>
      </div>
      <div class="flex justify-between border-b border-white/10 pb-1">
        <span class="opacity-70">Build:</span>
        <span style={`color: ${$theme.cyan}`}>{$systemStats.build}</span>
      </div>
      <div class="flex justify-between border-b border-white/10 pb-1">
        <span class="opacity-70">Slots:</span>
        <span style={`color: ${$theme.purple}`}>{$systemStats.active_slots} / {$systemStats.slots}</span>
      </div>
      <div class="flex justify-between border-b border-white/10 pb-1">
        <span class="opacity-70">Last Eval:</span>
        <span style={`color: ${$theme.yellow}`}>{$systemStats.last_eval_speed}</span>
      </div>
    </div>
  </div>

  <!-- Bottom Section: Logs/System -->
  <div class="flex-1 border-t-2 py-4 mt-4" style={`border-color: ${$theme.green};`}>
    <h2 class="text-xl font-bold mb-4" style={`color: ${$theme.red}`}>SYSTEM LOGS</h2>
    <div class="space-y-1 font-mono text-[10px] opacity-80 overflow-y-auto max-h-[60vh]">
      {#each $systemStats.logs as log}
        <p class="border-b border-white/5 pb-1">{log}</p>
      {/each}
    </div>
  </div>
</div>
