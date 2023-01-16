<script>
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { Github, BarChart, List, UserPlus } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { beforeUpdate } from 'svelte';

	import logo from '$lib/images/urf_emote.png';

	$: index = writable(1);
	beforeUpdate(async () => {
		if ($page.url.pathname === '/stats') {
			index.set(2);
		} else if ($page.url.pathname === '/ranks') {
			index.set(3);
		} else if ($page.url.pathname === '/creation/user') {
			index.set(4);
		} else {
			index.set(1);
		}
	});
</script>

<AppShell class="h-full">
	<svelte:fragment slot="sidebarLeft">
		<AppRail selected={index}>
			<svelte:fragment slot="lead">
				<AppRailTile tag="a" href="/">
					<img class="w-12" alt="Home" src={logo} />
				</AppRailTile>
			</svelte:fragment>
			<AppRailTile label="Stats" tag="a" href="/stats" value={2}>
				<List />
			</AppRailTile>
			<AppRailTile label="Ranks" tag="a" href="/ranks" value={3}>
				<BarChart />
			</AppRailTile>
			<AppRailTile label="Add" tag="a" href="/creation/user" value={4}>
				<UserPlus />
			</AppRailTile>
			<svelte:fragment slot="trail">
				<AppRailTile tag="a" href="https://github.com/G159w/naf-urf">
					<Github />
				</AppRailTile>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<div class="h-full p-24">
		<slot />
	</div>
</AppShell>
