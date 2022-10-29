<script>
	import { page } from '$app/stores';
	import Button, { Label, Icon } from '@smui/button';
	import logo from '$lib/images/urf_emote.png';
	import { ChartBar, Plus, PresentationChartLine } from 'svelte-heros-v2';
</script>

<header class="flex content-between w-full items-center justify-between">
	<a class="" href="/">
		<img class="w-3/12 h-auto m-2" src={logo} alt="Urf Logo" />
	</a>

	<nav class="flex p-2 gap-4 row flex-row h-fit">
		<Button
			variant={!$page.url.pathname.includes('ranking') ? 'outlined' : 'raised'}
			href="/ranking"
		>
			<ChartBar />
		</Button>
		<Button variant={!$page.url.pathname.includes('stats') ? 'outlined' : 'raised'} href="/stats">
			<PresentationChartLine />
		</Button>
		<Button variant={!$page.url.pathname.includes('create') ? 'outlined' : 'raised'} href="/create">
			<Plus />
		</Button>
	</nav>
</header>

<style>
</style>
