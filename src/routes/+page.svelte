<script>
	import logo from '$lib/images/urf.png';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>URF | Home</title>
	<meta name="home" content="NAF Urf home" />
</svelte:head>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full  items-center justify-center"
	in:fade={{ duration: 200 }}
>
	<img class="w-72" alt="Home" src={logo} />
	<h1 class="font-bold">NAF-URF</h1>

	<hr />
	<div class="flex gap-4 w-full align-middle justify-center">
		<a href="/ranks" class="card p-4 w-96">
			<h3 class="font-bold">Classement</h3>
			<p>Classement OBJECTIF entre les différents utilisateurs, "all time" ou par session.</p>
		</a>
		<a href="/stats" class="card p-4 w-96">
			<h3 class="font-bold">Statistiques</h3>
			<p>Statistiques FACTUELLES diverses et variées globales ou par joueurs.</p>
		</a>
	</div>
</section>
