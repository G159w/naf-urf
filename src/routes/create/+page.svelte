<script>
	import { fade } from 'svelte/transition';
	import { Button } from 'flowbite-svelte';
	import { User } from 'svelte-heros-v2';
</script>

<svelte:head>
	<title>URF Stats</title>
	<meta name="statistiques" content="Urf statistiques" />
</svelte:head>

<div class="page-content pt-10" in:fade={{ duration: 200 }}>
	<h1 class="dark:text-white">Création</h1>
	<Button color="yellow" href="/create/user" class="w-fit gap-2">
		<User variation="solid" />
		Utilisateur
	</Button>
</div>
