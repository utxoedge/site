<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  // Schemas
  import { createWorkspaceSchema } from '$lib/validations';

  // Components
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const form = superForm(data.form, {
    validators: zodClient(createWorkspaceSchema),
  });

  const { form: formData, enhance } = form;
</script>

<Card.Root class="w-3/4 self-center">
  <Card.Header>
    <Card.Title>Create Workspace</Card.Title>
    <!-- <Card.Description></Card.Description> -->
  </Card.Header>
  <form method="post" use:enhance>
    <Card.Content>
      <div class="grid grid-cols-3 gap-8">
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
    </Card.Content>
    <Card.Footer class="flex justify-between">
      <Button type="submit">
        <span>
          Create <span aria-hidden="true">&rarr;</span>
        </span>
      </Button>

      <Button variant="outline" onclick={() => window.history.back()}
        >Go back</Button
      >
    </Card.Footer>
  </form>
</Card.Root>
