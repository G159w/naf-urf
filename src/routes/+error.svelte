<script>
	import notFound from '$lib/images/404.png';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>404</title>
	<meta name="not found" content="404 Error not found" />
</svelte:head>

<section
	class="flex flex-row justify-center align-strech items-center mt-60 gap-10"
	in:fade={{ duration: 200 }}
>
	<img class="w-48 mb-20" src={notFound} alt="URF" />
	<h1 class="format text-4xl  mb-20">Désolé, cette page n'existe pas</h1>
</section>

<style>
</style>
