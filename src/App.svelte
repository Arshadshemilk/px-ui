<script lang="ts">
  import { onMount } from 'svelte';
  import Input from './components/Input.svelte';
  import History from './components/History.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import { theme } from './stores/theme';
  import { updateStats } from './stores/system';

  const BASE_URL = 'https://ideal-acorn-69vvg4gqpg4wfrwr7-8080.app.github.dev';

  onMount(() => {
    // Initial fetch
    updateStats(BASE_URL);
    
    // Poll every 5 seconds
    const interval = setInterval(() => {
      updateStats(BASE_URL);
    }, 5000);

    return () => clearInterval(interval);
  });
</script>

<main
  class="flex h-full border-2 rounded-md overflow-hidden text-xs sm:text-sm md:text-base"
  style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: ${$theme.green};`}
>
  <!-- Left Section: Terminal -->
  <div class="flex-1 flex flex-col p-4 overflow-auto border-r-2" style={`border-color: ${$theme.green};`}>
    <History />

    <div class="flex flex-col mt-2">
      <Input />
    </div>
  </div>

  <!-- Right Section: System Info (50% split) -->
  <div class="flex-1 p-4 overflow-auto">
    <Sidebar />
  </div>
</main>
