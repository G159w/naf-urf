<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { RefreshCcw, Download, FlaskRound, Trophy, FolderPlus, Settings } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import Game from '$lib/component/Game.svelte';
	import {
		getModalStore,
		Paginator,
		type ModalComponent,
		type ModalSettings,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CreatePeriod from '$lib/component/CreatePeriod.svelte';
	import Filters from '$lib/component/Filters.svelte';
	import { quintIn } from 'svelte/easing';
	import DetailGame from '$lib/component/DetailGame.svelte';

	export let form: ActionData;
	export let data: PageData;

	const menuPopup: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'menuPopup',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};

	$: currentPage = +($page.url.searchParams.get('page') || 0);
	$: limit = +($page.url.searchParams.get('limit') || 20);
	$: paginatorSettings = {
		page: currentPage,
		offset: currentPage,
		limit: limit,
		size: data.totalLoadedGames,
		amounts: [10, 20, 50]
	};

	afterNavigate(() => {
		currentPage = +($page.url.searchParams.get('page') || 0);
		limit = +($page.url.searchParams.get('take') || 20);

		paginatorSettings = {
			page: currentPage,
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
		getModalStore().trigger(d);
	}

	function scrollIntoView(element) {
		element.scroll({ top: element.scrollHeight, behavior: 'smooth' });

		console.log(element, element.scrollHeight);
	}

	let expendedGameId: number | undefined;
</script>

<svelte:head>
	<title>URF | History</title>
	<meta name="URF History" content="NAF History" />
</svelte:head>

<div class=" card p-4 w-48 shadow-xl z-50" data-popup="menuPopup">
	<ul>
		<li class="p-1">
			<form method="POST" action="?/sanitize">
				<button class="p-0 flex gap-2 items-center">
					<FlaskRound size={20} />
					Sanitize
				</button>
			</form>
		</li>
		<li class="p-1">
			<form method="POST" action="?/loadWinRates">
				<button class="p-0 flex gap-2 items-center">
					<Trophy size={20} />
					Load WinRates
				</button>
			</form>
		</li>
		<li class="p-1">
			<button class="p-0 flex gap-2 items-center" on:click={triggerCustomModal}>
				<FolderPlus size={20} />
				Create Period
			</button>
		</li>
		<li class="p-1">
			<form method="POST" action="?/loadGamesDetail">
				<button class="p-0 flex gap-2 items-center">
					<Download size={20} />
					Download details
				</button>
			</form>
		</li>
		<!-- <li class="p-1">
			<form method="POST" action="?/updateGamesDetail">
				<button class="p-0 flex gap-2 items-center">
					<Download size={20} />
					Update details
				</button>
			</form>
		</li> -->
		<li class="p-1">
			<form method="POST" action="?/loadUserGames">
				<button class="p-0 flex gap-2 items-center">
					<RefreshCcw size={20} />
					Fetch all games
				</button>
			</form>
		</li>
	</ul>
</div>

<section class="container h-full mx-auto flex flex-col gap-8 w-full items-center">
	<div class="flex flex-col-reverse lg:flex-row gap-8 justify-between w-full items-center">
		<div class="flex gap-2 flex-col items-center lg:items-start">
			<p>Total games: {data.totalGames}</p>
			<p>Games chargées: {data.totalLoadedGames}</p>
		</div>

		<Filters periods={data.periods} users={data.users} champions={data.champions} />

		<div>
			<button class="btn btn-icon btn-ringed-primary p-0" use:popup={menuPopup}
				><Settings /></button
			>
		</div>
	</div>
	<div class="w-full m-8">
		<Paginator
			bind:settings={paginatorSettings}
			on:page={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('page', event.detail.toString());
				await goto(newUrl);
			}}
			on:amount={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('take', event.detail.toString());
				await goto(newUrl);
			}}
		/>
	</div>
	<div class="flex flex-wrap w-full" in:slide={{ duration: 200, easing: quintIn }}>
		{#each data?.games || [] as game (game.id)}
			{#if expendedGameId !== game.id}
				<button
					on:click={(event) => {
						console.log(event.target);
						scrollIntoView(event.target);
						expendedGameId = game.id;
					}}
					class={`lg:basis-1/2 w-full p-2`}
				>
					<Game {game} mainUsers={data.users} />
				</button>
			{:else}
				<button on:click={() => (expendedGameId = game.id)} class={`w-full p-2`}>
					<DetailGame {game} mainUsers={data.users} />
				</button>
			{/if}
		{/each}
	</div>
	<div class="w-full mt-8">
		<Paginator
			bind:settings={paginatorSettings}
			on:page={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('page', event.detail.toString());
				await goto(newUrl);
			}}
			on:amount={async (event) => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.set('take', event.detail.toString());
				await goto(newUrl);
			}}
		/>
	</div>
</section>
