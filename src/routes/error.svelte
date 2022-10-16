<script>
	import notFound from '$lib/images/404.png';
    import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>404</title>
	<meta name="home" content="NAF Urf home" />
</svelte:head>

<section class="flex flex-row justify-center align-strech items-center mt-60 gap-10" in:fade={{ duration: 200 }}>
	<img class="w-1/12 h-auto mb-20" src={notFound} alt="URF">
	<h1 class="format text-4xl text-white mb-20">
		Désolé, votre page n'existe pas
	</h1>
</section>

<style>

</style>
