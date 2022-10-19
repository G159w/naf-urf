<script>
	import { Search, Button } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	export let data;
	$: ({ Users } = data);
	$: helloData = $Users?.data;
</script>

<svelte:head>
	<title>URF | Stats</title>
	<meta name="statistiques" content="Urf statistiques" />
</svelte:head>

<div class="page-content pt-10" in:fade={{ duration: 200 }}>
	<Search>
		<Button color="yellow">Chercher</Button>
	</Search>
</div>
