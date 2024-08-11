<script lang="ts">
  import { browser } from '$app/environment';

  import type { PageData } from './$types';

  // Components
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';

  let { data }: { data: PageData } = $props();

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString();
  };
</script>

<div class="flex flex-col items-center justify-center gap-10 p-12">
  <div>
    <h1 class="text-3xl">Workspaces</h1>
    <Button href={`/workspaces/create`}>Create</Button>
  </div>

  <h2 class="text-lg">
    You're a member of {data.workspaces.length} workspaces
  </h2>

  <ul class="grid grid-cols-3 gap-8">
    {#each data.workspaces as workspace}
      <li>
        <Card.Root class="w-[350px]">
          <Card.Header>
            <Card.Title>{workspace.name || workspace.slug}</Card.Title>
            <Card.Description>{workspace.id}</Card.Description>
          </Card.Header>
          <Card.Content>
            {#if browser}
              Created on {formattedDate(
                workspace.createdAt as unknown as string,
              )}
            {/if}
          </Card.Content>
          <Card.Footer class="flex justify-between">
            <Button href={`/workspaces/${workspace.slug}`}>View</Button>
          </Card.Footer>
        </Card.Root>
      </li>
    {/each}
  </ul>
</div>
