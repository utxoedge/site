<script lang="ts">
  import type { Snippet } from 'svelte';

  // Icons
  import SolarUserCircleBroken from '~icons/solar/user-circle-broken';

  // Components
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Button } from '$lib/components/ui/button';

  import type { LayoutData } from './$types';

  let { data, children }: { children: Snippet; data: LayoutData } = $props();

  const otherWorkspaces = $derived(
    data.workspaces.filter((w) => w.id !== data.currentWorkspace.id),
  );
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
  <nav class="flex flex-none items-center justify-between px-4 py-2">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="outline"
          size="icon"
          class="size-10"
        >
          {data.currentWorkspace.slug.slice(0, 2).toUpperCase()}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Workspaces</DropdownMenu.Label>
          <DropdownMenu.Separator />

          {#if otherWorkspaces.length > 0}
            {#each otherWorkspaces as workspace}
              <DropdownMenu.Item>
                <a href={`/workspaces/${workspace.slug}`}>{workspace.slug}</a>
              </DropdownMenu.Item>
            {/each}
          {:else}
            <DropdownMenu.Item>
              <a href="/workspaces">Create</a>
            </DropdownMenu.Item>
          {/if}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>

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
    class="flex h-full flex-1 flex-col gap-12 overflow-y-auto border-t bg-muted/40 px-10 pb-4 pt-8 shadow-inner"
  >
    {@render children()}
  </main>
</div>
