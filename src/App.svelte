<script lang="ts">
  import Input from './components/Input.svelte';
  import History from './components/History.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import { theme } from './stores/theme';
</script>

<main
  class="flex h-full border-2 rounded-md overflow-hidden text-xs sm:text-sm md:text-base"
  style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: ${$theme.green};`}
>
  <!-- Main Terminal Section -->
  <div class="flex-1 flex flex-col p-4 overflow-auto min-w-0">
    <History />

    <div class="flex flex-col md:flex-row mt-2">
      <Input />
    </div>
  </div>

  <!-- Right Sidebar Section -->
  <div class="hidden md:block w-64 lg:w-80 p-4">
    <Sidebar />
  </div>
</main>
