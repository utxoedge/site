<script lang="ts">
  // Icons
  import SolarMenuDotsCircleBroken from '~icons/solar/menu-dots-circle-broken';

  // Components
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Button } from '$lib/components/ui/button';

  import type { PageData } from './$types';

  let {
    apiKey,
  }: {
    apiKey: PageData['apiKeys'][0];
    currentWorkspace: PageData['currentWorkspace'];
  } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative h-8 w-8 p-0"
    >
      <span class="sr-only">Open menu</span>
      <SolarMenuDotsCircleBroken class="h-6 w-6" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>

      <DropdownMenu.Item
        on:click={() => navigator.clipboard.writeText(apiKey.id)}
      >
        Copy ID
      </DropdownMenu.Item>

      <DropdownMenu.Item
        on:click={() => navigator.clipboard.writeText(apiKey.token)}
      >
        Copy Key
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
