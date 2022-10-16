<svelte:head>
	<title>URF Stats</title>
	<meta name="statistiques" content="Urf statistiques" />
</svelte:head>

<script>
  import { Select, Label, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte'
  import { fade } from 'svelte/transition';
  export let data;
  let names = ["Henri", "Nicolas", "Kevin" ]
  $: ({ Hello } = data)
  $: helloData = $Hello?.data
</script>

<div class="text-column" in:fade={{ duration: 200 }}>
	<h1>URF Stats</h1>
  {helloData?.hello}
  <div class="flex p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
    <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
    <span class="sr-only">Info</span>
    <div>
      <span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
    </div>
  </div>
  <Label for="select-sm" class="mb-2">Small select</Label>
  <Select value='' id="select-sm" size="sm" items={names.map((value, index) => ({ value: index.toString(), name: value}))} class="mb-6" />   

    <Table striped>
      <TableHead>
        <TableHeadCell>Product name</TableHeadCell>
        <TableHeadCell>Color</TableHeadCell>
        <TableHeadCell>Category</TableHeadCell>
        <TableHeadCell>Price</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">
        <TableBodyRow>
          <TableBodyCell>Amumu</TableBodyCell>
          <TableBodyCell>Sliver</TableBodyCell>
          <TableBodyCell>Laptop</TableBodyCell>
          <TableBodyCell>$2999</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
          <TableBodyCell>Microsoft Surface Pro</TableBodyCell>
          <TableBodyCell>White</TableBodyCell>
          <TableBodyCell>Laptop PC</TableBodyCell>
          <TableBodyCell>$1999</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
          <TableBodyCell>Magic Mouse 2</TableBodyCell>
          <TableBodyCell>Black</TableBodyCell>
          <TableBodyCell>Accessories</TableBodyCell>
          <TableBodyCell>$99</TableBodyCell>
        </TableBodyRow>
      </TableBody>
    </Table>
</div>
