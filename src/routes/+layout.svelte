<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppRail,
		LightSwitch,
		AppRailAnchor,
		ProgressRadial
	} from '@skeletonlabs/skeleton';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import { Github, BarChart, List, User, Gavel } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { beforeUpdate } from 'svelte';
	import { initializeStores, Toast, Modal, Drawer, storePopup } from '@skeletonlabs/skeleton';
	import { navigating } from '$app/stores';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';

	initializeStores();

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import logo from '$lib/images/urf_emote.png';
	import CreatePeriod from '$lib/component/CreatePeriod.svelte';

	$: index = writable(1);
	beforeUpdate(async () => {
		if ($page.url.pathname === '/history') {
			index.set(2);
		} else if ($page.url.pathname === '/ranks') {
			index.set(3);
		} else if ($page.url.pathname === '/stats') {
			index.set(4);
		} else if ($page.url.pathname === '/tribunal') {
			index.set(5);
		} else {
			index.set(1);
		}
	});
</script>

<svelte:head>
	<title>URF | NAF</title>
	<meta name="URF NAF" content="NAF Urf naf" />
</svelte:head>

<Toast />
<Modal />
<Drawer />

<AppShell class="h-full">
	<Modal />
	<svelte:fragment slot="sidebarLeft">
		<AppRail selected={index} class="align-middle flex">
			<svelte:fragment slot="lead">
				<AppRailAnchor tag="a" href="/">
					<svelte:fragment slot="lead"><img class="w-12" alt="Home" src={logo} /></svelte:fragment>
				</AppRailAnchor>
			</svelte:fragment>
			<AppRailAnchor label="Historique" tag="a" href="/history" value={2}>
				<svelte:fragment slot="lead"><List /></svelte:fragment>
			</AppRailAnchor>
			<AppRailAnchor label="Ranks" tag="a" href="/ranks" value={3}>
				<svelte:fragment slot="lead"><BarChart /></svelte:fragment>
			</AppRailAnchor>
			<AppRailAnchor label="Stats" tag="a" href="/stats" value={4}>
				<svelte:fragment slot="lead"><User /></svelte:fragment>
			</AppRailAnchor>
			<AppRailAnchor label="Tribunal" tag="a" href="/tribunal" value={5}>
				<svelte:fragment slot="lead"><Gavel /></svelte:fragment>
			</AppRailAnchor>
			<svelte:fragment slot="trail">
				<AppRailAnchor>
					<svelte:fragment slot="lead"><LightSwitch /></svelte:fragment>
				</AppRailAnchor>
				<AppRailAnchor tag="a" href="https://github.com/G159w/naf-urf">
					<svelte:fragment slot="lead"><Github /></svelte:fragment>
				</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<div class="h-full p-4 sm:p-12">
		{#if $navigating}
			<div class="flex w-full h-full items-center justify-center">
				<ProgressRadial stroke={10} value={undefined} />
			</div>
		{:else}
			<slot />
		{/if}
	</div>
</AppShell>
