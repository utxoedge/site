<script lang="ts">
  // Components
  import { Button } from '$lib/components/ui/button';

  // Locals
  import type { PageData } from './$types';
  import DataTable from './data-table.svelte';

  let { data }: { data: PageData } = $props();
</script>

<div class="flex items-center justify-between">
  <h1 class="text-3xl">API Keys</h1>

  <Button href={`/workspaces/${data.currentWorkspace.slug}/create`}
    >Create Key</Button
  >
</div>

<DataTable {data} />
