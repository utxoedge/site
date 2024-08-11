<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<p>hello</p>
<p>You are viewing {data.currentWorkspace.slug}</p>
