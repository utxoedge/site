<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import { browser } from '$app/environment';

  import type { PageData } from './$types';

  // Components
  import * as Card from '$lib/components/ui/card';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  // Validations
  import { createWorkspaceSchema } from '$lib/validations';

  let { data }: { data: PageData } = $props();

  const form = superForm(data.form, {
    validators: zodClient(createWorkspaceSchema),
  });

  const { form: formData, enhance } = form;

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString();
  };
</script>

<div class="flex h-full flex-col items-center gap-10 bg-muted/40 p-12">
  <h1 class="text-3xl">Workspaces</h1>

  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: 'default' })}
      >Create Workspace</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Create Workspace</Dialog.Title>
        <Dialog.Description>
          Please provide a unique name and display name for your workspace.
          Click save when you're done.
        </Dialog.Description>
      </Dialog.Header>
      <form method="post" use:enhance>
        <div class="grid gap-4 py-4">
          <Form.Field {form} name="slug">
            <Form.Control let:attrs>
              <Form.Label>Name</Form.Label>
              <Input {...attrs} bind:value={$formData.slug} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="name">
            <Form.Control let:attrs>
              <Form.Label>Display Name</Form.Label>
              <Input {...attrs} bind:value={$formData.name} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>
        <Dialog.Footer class="flex justify-between">
          <Button type="submit">
            <span>
              Create <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>

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
