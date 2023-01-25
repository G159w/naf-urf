<script lang="ts">
	import { fade } from 'svelte/transition';
	import { RefreshCcw, Download, FlaskRound, Trophy, FolderPlus } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import Game from '$lib/component/Game.svelte';
	import {
		Paginator,
		modalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CreatePeriod from '$lib/component/CreatePeriod.svelte';
	import { format } from 'date-fns';

	export let form: ActionData;
	export let data: PageData;

	let selectedPeriodId: number | undefined =
		+($page.url.searchParams.get('period') || 0) || undefined;
		
	$: currentPage = +($page.url.searchParams.get('page') || 0);
	$: limit = +($page.url.searchParams.get('limit') || 20);
	$: paginatorSettings = {
		offset: currentPage,
		limit: limit,
		size: data.totalLoadedGames,
		amounts: [10, 20, 50]
	};
	afterNavigate(() => {
		currentPage = +($page.url.searchParams.get('page') || 0);
		limit = +($page.url.searchParams.get('take') || 20);

		paginatorSettings = {
			offset: currentPage,
			limit: limit,
			size: data.totalLoadedGames,
			amounts: [10, 20, 50]
		};
	});

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			ref: CreatePeriod,
			slot: '<p>Skeleton</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(d);
	}
</script>

<svelte:head>
	<title>URF | History</title>
	<meta name="URF History" content="NAF History" />
</svelte:head>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<div class="flex gap-4 justify-between w-full items-center">
		<div class="flex gap-2 flex-col">
			<p>Total games: {data.totalGames}</p>
			<p>Games chargées: {data.totalLoadedGames}</p>
			<select
				bind:value={selectedPeriodId}
				on:change={async () => {
					const newUrl = new URL($page.url);
					newUrl?.searchParams?.delete('page');
					if (selectedPeriodId) {
						newUrl?.searchParams?.set('period', selectedPeriodId.toString());
					} else {
						newUrl?.searchParams?.delete('period');
					}
					await goto(newUrl);
				}}
				class=" w-60"
				style="width: 180px"
			>
				<option value={undefined}> Global </option>
				{#each data.periods as period}
					<option value={period.id}>
						{period.name}
					</option>
				{/each}
			</select>
		</div>
		<h1 class="font-bold">Historique</h1>
		<div class="flex gap-2">
			<form method="POST" action="?/sanitize">
				<button class="btn-icon btn-filled-primary p-0">
					<FlaskRound size={20} />
				</button>
			</form>
			<button class="btn-icon btn-filled-primary p-0" on:click={triggerCustomModal}>
				<FolderPlus size={20} />
			</button>
			<form method="POST" action="?/loadWinRates">
				<button class="btn-icon btn-filled-primary p-0">
					<Trophy size={20} />
				</button>
			</form>
			<form method="POST" action="?/loadGamesDetail">
				<button class="btn-icon btn-filled-primary p-0">
					<Download size={20} />
				</button>
			</form>
			<form method="POST" action="?/loadUserGames">
				<button class="btn-icon btn-filled-primary p-0">
					<RefreshCcw size={20} />
				</button>
			</form>
		</div>
	</div>
	<hr class="w-full" />
	<div class="w-full">
		<Paginator
			bind:settings={paginatorSettings}
			on:page={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('page', event.detail);
				await goto(newUrl);
			}}
			on:amount={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('take', event.detail);
				await goto(newUrl);
			}}
		/>
	</div>
	<div class="flex flex-wrap">
		{#each data?.games || [] as game (game.id)}
			<div class="basis-1/2 p-2">
				<Game {game} mainUsers={data.users} />
			</div>
		{/each}
	</div>
	<div class="w-full">
		<Paginator
			bind:settings={paginatorSettings}
			on:page={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('page', event.detail);
				await goto(newUrl);
			}}
			on:amount={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('take', event.detail);
				await goto(newUrl);
			}}
		/>
	</div>
</section>
