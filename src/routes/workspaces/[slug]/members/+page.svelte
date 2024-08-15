<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  // Components
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  // Validations
  import { inviteUserSchema } from '$lib/validations';

  // Locals
  import type { PageData } from './$types';
  import DataTable from './data-table.svelte';

  let { data }: { data: PageData } = $props();

  const form = superForm(data.form, {
    validators: zodClient(inviteUserSchema),
  });

  const { form: formData, enhance } = form;
</script>

<div class="flex items-center justify-between">
  <h1 class="text-3xl">Members</h1>

  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: 'default' })}
      >Add Member</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Add Member</Dialog.Title>
        <Dialog.Description>
          Please provide the email of a user to be added. Click save when you're
          done.
        </Dialog.Description>
      </Dialog.Header>
      <form method="post" use:enhance>
        <div class="grid gap-4 py-4">
          <Form.Field {form} name="email">
            <Form.Control let:attrs>
              <Form.Label>Email</Form.Label>
              <Input {...attrs} bind:value={$formData.email} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>
        <Dialog.Footer class="flex justify-between">
          <Button type="submit">
            <span>
              Invite <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>

<DataTable {data} />
