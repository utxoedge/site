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
    dataType: 'json',
  });

  const { form: formData, enhance } = form;

  const selectedChain = $state($formData.chain.name);

  const networkOptions = $derived(
    selectedChain === 'cardano'
      ? [
          { value: 'mainnet', label: 'Mainnet' },
          { value: 'preprod', label: 'Preprod' },
          { value: 'preview', label: 'Preview' },
        ]
      : [
          { value: 'mainnet', label: 'Mainnet' },
          { value: 'testnet', label: 'Testnet' },
        ],
  );

  $effect(() => {
    if (selectedChain) {
      $formData.chain.network = 'mainnet';
    }
  });
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

            <Select.Root
              portal={null}
              onSelectedChange={(v) => {
                console.log(v);
              }}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select a blockchain" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
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
                  {#each networkOptions as option}
                    <Select.Item value={option.value} label={option.label}>
                      {option.label}
                    </Select.Item>
                  {/each}
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
