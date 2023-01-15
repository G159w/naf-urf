<script lang="ts">
	import { tableMapperValues, Table, type TableSource } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	const simpleTable: TableSource = {
		// A list of heading labels.
		head: ['Name', 'ign', 'ID LOL', 'Games'],
		// The data visibly shown in your table body UI.
		body: tableMapperValues(data.users, ['name', 'ign', 'lolId', '_count.gameStats']),
		// Optional: The data returned when interactive is enabled and a row is clicked.
		meta: tableMapperValues(data.users, ['name', 'ign', 'lolId', '_count.gameStats'])
	};
</script>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<h1 class="font-bold">Classement</h1>
	<hr class="w-full" />
	<hr />
	<Table source={simpleTable} />
	{data.users[0].name}
</section>
