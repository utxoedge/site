<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  // Validations
  import { createApiKeySchema } from '$lib/validations';

  // Components
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';

  // Locals
  import type { PageData } from './$types';

  // Props
  let { data }: { data: PageData } = $props();

  const form = superForm(data.form, {
    validators: zodClient(createApiKeySchema),
  });

  const { form: formData, enhance } = form;
</script>

<Card.Root class="w-3/4 self-center">
  <Card.Header>
    <Card.Title>Create API Key</Card.Title>
    <!-- <Card.Description></Card.Description> -->
  </Card.Header>
  <form method="post" use:enhance>
    <Card.Content>
      <div class="grid grid-cols-3 gap-8">
        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label>Name</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="chain.name">
          <Form.Control let:attrs>
            <Form.Label>Blockchain</Form.Label>

            <Select.Root portal={null}>
              <Select.Trigger>
                <Select.Value placeholder="Select a blockchain" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Vendors</Select.Label>
                  <Select.Item value="cardano" label="Cardano"
                    >Cardano</Select.Item
                  >

                  <Select.Item value="bitcoin" label="Bitcoin"
                    >Bitcoin</Select.Item
                  >
                </Select.Group>
              </Select.Content>
              <Select.Input {...attrs} bind:value={$formData.chain.name} />
            </Select.Root>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="chain.network">
          <Form.Control let:attrs>
            <Form.Label>Network</Form.Label>

            <Select.Root portal={null}>
              <Select.Trigger>
                <Select.Value placeholder="Select a network" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Vendors</Select.Label>
                  {#if $formData.chain.name === 'cardano'}
                    <Select.Item value="mainnet" label="Mainnet"
                      >Mainnet</Select.Item
                    >

                    <Select.Item value="preprod" label="Preprod"
                      >Preprod</Select.Item
                    >

                    <Select.Item value="preview" label="Preview"
                      >Preview</Select.Item
                    >
                  {:else}
                    <Select.Item value="mainnet" label="Mainnet"
                      >Mainnet</Select.Item
                    >

                    <Select.Item value="testnet" label="Testnet"
                      >Testnet</Select.Item
                    >
                  {/if}
                </Select.Group>
              </Select.Content>
              <Select.Input {...attrs} bind:value={$formData.chain.network} />
            </Select.Root>
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
