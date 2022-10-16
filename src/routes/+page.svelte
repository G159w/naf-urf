<script>
	import urf from '$lib/images/urf.png';
    import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="home" content="NAF Urf home" />
</svelte:head>

<section class="flex flex-col justify-items-center items-center my-20" in:fade={{ duration: 200 }}>
	<h1 class="format text-6xl text-white mb-20">
		URF NAF
	</h1>
	<pre><a rel="external" href="/api/graphql">/api/graphql</a></pre>
	<img class="w-3/12 h-auto mb-20" src={urf} alt="URF">
	<div class="flex flex-row justify-items-center items-center gap-4">
		<a href="/rank" class="block p-6 max-w-sm bg-gray-800 border-gray-700 hover:bg-gray-700">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
				Classement NAF
			</h5>
			<p class="font-normal text-gray-400">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
			</p>
		</a>
		<a href="/stats" class="block p-6 max-w-sm bg-gray-800 border-gray-700 hover:bg-gray-700"
	 	 >
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
				Statistiques par joueur
			</h5>
			<p class="font-normal text-gray-400">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
			</p>
		</a>
	</div>
</section>

<style>

</style>
