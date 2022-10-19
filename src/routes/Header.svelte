<script>
	import { page } from '$app/stores';
	import { DarkMode } from 'flowbite-svelte';
	import logo from '$lib/images/urf_emote.png';
	import { Button } from 'flowbite-svelte';
	import { ChartBar, Plus, PresentationChartLine } from 'svelte-heros-v2';
</script>

<header class="flex content-between w-full items-center justify-between">
	<a class="" href="/">
		<img class="w-3/12 h-auto m-2" src={logo} alt="Urf Logo" />
	</a>

	<nav class="flex p-2 gap-4 row flex-row h-fit">
		<Button
			color="yellow"
			outline={!$page.url.pathname.includes('ranking')}
			class="!p-2 border border-yellow-400"
			href="/ranking"
		>
			<ChartBar />
		</Button>
		<Button
			color="yellow"
			outline={!$page.url.pathname.includes('stats')}
			class="!p-2 border border-yellow-400"
			href="/stats"
		>
			<PresentationChartLine />
		</Button>
		<Button
			color="yellow"
			outline={!$page.url.pathname.includes('create')}
			class="!p-2 border border-yellow-400"
			href="/create"
		>
			<Plus />
		</Button>
		<DarkMode
			btnClass="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
		/>
	</nav>
</header>

<style>
</style>
