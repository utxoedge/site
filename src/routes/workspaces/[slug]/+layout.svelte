<script lang="ts">
  import type { Snippet } from 'svelte';

  // Icons
  import SolarUserCircleBroken from '~icons/solar/user-circle-broken';

  // Components
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Button } from '$lib/components/ui/button';

  import type { LayoutData } from './$types';

  let { data, children }: { children: Snippet; data: LayoutData } = $props();
</script>

<div class="flex h-full flex-1 flex-col">
  <nav class="flex flex-none items-center justify-between py-2 pl-2 pr-4">
    <Button
      variant="ghost"
      class="p-0 text-xl font-bold"
      href={`/workspaces/${data.currentWorkspace.slug}`}
    >
      {data.currentWorkspace.slug}
    </Button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} variant="ghost" class="p-0" size="icon">
          <SolarUserCircleBroken class="text-2xl" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Separator />

          <DropdownMenu.Item>
            <a href="/workspaces">Workspaces</a>
          </DropdownMenu.Item>

          <DropdownMenu.Item>
            <a href="/account">Settings</a>
          </DropdownMenu.Item>

          {#if data.user.kind === 'admin' || data.user.kind === 'support'}
            <DropdownMenu.Item>
              <a href="/admin">Admin</a>
            </DropdownMenu.Item>
          {/if}

          <DropdownMenu.Separator />

          <DropdownMenu.Item>
            <a href="/home">Home Page</a>
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item class="flex">
            <Button href="/logout" class="w-full" variant="destructive"
              >Logout</Button
            >
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </nav>
  <main
    class="flex h-full flex-1 flex-col gap-12 overflow-y-auto rounded-tl border-l border-t bg-muted/40 px-10 pb-4 pt-8 shadow-inner"
  >
    {@render children()}
  </main>
</div>
