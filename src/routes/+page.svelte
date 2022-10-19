<script>
	import urf from '$lib/images/urf.png';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>URF | Home</title>
	<meta name="home" content="NAF Urf home" />
</svelte:head>

<section class="flex flex-col justify-items-center items-center my-20" in:fade={{ duration: 200 }}>
	<h1 class="format text-6xl text-amber-400 mb-20">URF</h1>
	<img class="w-3/12 h-auto mb-20" src={urf} alt="URF" />
	<div class="flex flex-row justify-items-center items-center gap-4">
		<a
			href="/ranking"
			class="block p-6 max-w-sm hover:border dark:bg-neutral-800 border-amber-500 hover:bg-neutral-700"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Classement</h5>
			<p class="font-normal text-gray-400">
				Classement OBJECTIF ente les differents utilisateurs, "all time" ou par session.
			</p>
		</a>
		<a
			href="/stats"
			class="block p-6 max-w-sm hover:border dark:bg-neutral-800 border-amber-500 hover:bg-neutral-700"
		>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Statistiques</h5>
			<p class="font-normal text-gray-400">
				Statistiques FACTUELLES diverses et variées globales ou par joueurs.
			</p>
		</a>
	</div>
</section>
