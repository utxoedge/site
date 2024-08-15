<script lang="ts">
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from 'svelte-headless-table';
  import { addPagination } from 'svelte-headless-table/plugins';
  import { writable } from 'svelte/store';

  // $app
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Components
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';
  import FormattedDate from '$lib/components/FormattedDate.svelte';

  // Local components
  import DataTableActions from './data-table-actions.svelte';
  import Pfp from './pfp.svelte';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // Convert to writable store
  const members = writable(data.members);
  const totalCount = writable(data.totalCount);

  // Ensure reactivity when data changes
  $effect(() => members.set(data.members));
  $effect(() => totalCount.set(data.totalCount));

  const table = createTable(members, {
    page: addPagination({
      initialPageIndex: data.currentPage - 1,
      initialPageSize: data.currentPageSize,
      serverSide: true,
      serverItemCount: totalCount,
    }),
  });

  const columns = table.createColumns([
    table.column({
      id: 'image',
      accessor: (member) => member,
      header: 'Image',
      cell: ({ value }) => {
        return createRender(Pfp, {
          src: value.image,
          alt: value.name,
          fallback: value.email.slice(0, 1),
        });
      },
    }),

    table.column({ accessor: 'name', header: 'Name' }),

    table.column({
      accessor: 'email',
      header: 'Email',
    }),

    table.column({
      accessor: 'joined',
      header: 'Joined',
      cell: ({ value }) => {
        const date = new Date(value);

        return createRender(FormattedDate, { date });
      },
    }),

    table.column({
      accessor: (member) => member,
      header: '',
      cell: ({ value }) => {
        return createRender(DataTableActions, {
          member: value,
          currentWorkspace: data.currentWorkspace,
        });
      },
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);

  function changePage(newPage: number) {
    let query = new URLSearchParams($page.url.searchParams);

    query.set('page', `${newPage}`);

    goto(`?${query.toString()}`, { invalidateAll: true });
  }
</script>

<div>
  <div class="rounded-md border bg-background">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <Table.Head {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  <div class="flex items-center justify-end space-x-4 py-4">
    <Button
      variant="outline"
      size="sm"
      on:click={() => {
        changePage(data.currentPage - 1);
      }}
      disabled={!data.canPrevPage}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!data.canNextPage}
      on:click={() => {
        changePage(data.currentPage + 1);
      }}>Next</Button
    >
  </div>
</div>
