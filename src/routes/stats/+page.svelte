<script lang="ts">
	import CircularProgress from '@smui/circular-progress';
	import SearchUser from '$lib/component/SearchUser.svelte';
	import Game from '$lib/component/Game.svelte';
	import Fab, { Icon } from '@smui/fab';
	import { page } from '$app/stores';
	import { graphql, LoadGamesStore, type SyncUsersMatchesStore } from '$houdini';
	import { forEach } from 'lodash';
	export let data;

	let loading = false;
	const syncGamesMutation: SyncUsersMatchesStore = graphql`
		mutation SyncUsersMatches($args: UserWhereUniqueInput, $full: Boolean) {
			syncUsersMatches(args: $args, full: $full) {
				id
				matchId
			}
		}
	`;

	const loadGamesMutation: LoadGamesStore = graphql`
		mutation LoadGames {
			loadGames
		}
	`;

	const syncGames = async () => {
		loading = true;
		const user = $page.url.searchParams.get('user');
		await syncGamesMutation.mutate({
			args: user
				? {
						id: +user
				  }
				: undefined
		});
		loading = false;
	};

	const loadGames = async () => {
		loading = true;
		await loadGamesMutation.mutate(null);
		loading = false;
	};

	$: ({ AllUsers, User, CountGames, Games } = data);
</script>

<svelte:head>
	<title>URF | Stats</title>
	<meta name="statistiques" content="Urf statistiques" />
</svelte:head>

<div class="page-content pt-10">
	<SearchUser />
	<div class="text-white mt-4">
		{$CountGames?.data?.countGames} games non chargées
	</div>
	<div class="flex flex-wrap">
		{#each $Games?.data?.games || [] as game}
			<div class="basis-1/2 p-2">
				<Game {game} />
			</div>
		{/each}
	</div>
	<div class="flex gap-4 fixed bottom-10 right-10">
		<Fab on:click={() => syncGames()}>
			<Icon class="material-icons">sync</Icon>
		</Fab>
		{#if $CountGames?.data?.countGames || 0 > 0}
			<Fab on:click={() => loadGames()}>
				<Icon class="material-icons">cloud_download</Icon>
			</Fab>
		{/if}
	</div>
</div>
