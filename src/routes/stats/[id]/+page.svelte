<script>
	import SearchUser from '$lib/component/SearchUser.svelte';
	import { Search, Button } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	export let data;

	$: ({ User } = data);
</script>

<svelte:head>
	<title>URF | Stats</title>
	<meta name="statistiques" content="Urf statistiques" />
</svelte:head>

<div class="page-content pt-10">
	<SearchUser defaultValue={$User?.data?.user?.id} />

	<div class="text-white">
		{$User?.data?.user?.name}
		{$User?.data?.user?.ign}
	</div>
</div>
