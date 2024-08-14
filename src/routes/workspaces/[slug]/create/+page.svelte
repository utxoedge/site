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

  let { data }: { data: PageData } = $props();

  const form = superForm(data.form, {
    validators: zodClient(createApiKeySchema),
  });

  const { form: formData, enhance } = form;

  let selectedChain = $derived(
    $formData.name
      ? { label: $formData.name, value: $formData.name }
      : undefined,
  );

  let selectedNetwork = $derived(
    $formData.network
      ? { label: $formData.network, value: $formData.network }
      : undefined,
  );

  let networkOptions = $derived(
    selectedChain?.value === 'cardano'
      ? ['mainnet', 'preprod', 'preview']
      : ['mainnet', 'testnet'],
  );
</script>

<Card.Root class="w-3/4 self-center">
  <Card.Header>
    <Card.Title>Create API Key</Card.Title>
    <!-- <Card.Description></Card.Description> -->
  </Card.Header>
  <form method="post" use:enhance>
    <Card.Content>
      <div class="grid grid-cols-3 gap-8">
        <Form.Field {form} name="keyName">
          <Form.Control let:attrs>
            <Form.Label>Name</Form.Label>
            <Input {...attrs} bind:value={$formData.keyName} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label>Blockchain</Form.Label>

            <Select.Root
              portal={null}
              selected={selectedChain}
              onSelectedChange={(v) => {
                if (v) {
                  $formData.name = v.value;
                }
              }}
            >
              <Select.Trigger {...attrs}>
                <Select.Value placeholder="Select a blockchain" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value="cardano" label="cardano"
                    >Cardano</Select.Item
                  >

                  <Select.Item value="bitcoin" label="bitcoin"
                    >Bitcoin</Select.Item
                  >
                </Select.Group>
              </Select.Content>
              <Select.Input {...attrs} bind:value={$formData.name} />
            </Select.Root>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="network">
          <Form.Control let:attrs>
            <Form.Label>Network</Form.Label>

            <Select.Root
              portal={null}
              selected={selectedNetwork}
              onSelectedChange={(v) => {
                if (v) {
                  $formData.network = v.value;
                }
              }}
            >
              <Select.Trigger {...attrs}>
                <Select.Value placeholder="Select a network" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each networkOptions as option}
                    <Select.Item value={option} label={option}>
                      {option}
                    </Select.Item>
                  {/each}
                </Select.Group>
              </Select.Content>
              <Select.Input {...attrs} bind:value={$formData.network} />
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
