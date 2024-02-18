<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Filters from '$lib/component/Filters.svelte';
	import _ from 'lodash';
	import {
		championMapDbToDisplay,
		colorsLevels,
		computeStat,
		getChampionDragonName,
		getChampionImage
	} from '$lib/utils';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import GameVisualizer from '$lib/component/GameVisualizer.svelte';
	import type { CompleteStat } from '$lib/type';

	export let data: PageData;

	$: userStats = _(data.stats)
		.map((stats) => {
			const user = _.find(data.users, (user) => user.id === stats.userId);
			const championStats = _.countBy(data.nbChampionStats, (stat) => stat.userId === user?.id);
			const winRate = _.find(data.winRates, (winRate) => winRate.userId === user?.id);

			return {
				...user,
				...stats,
				championStats: championStats.true || 0,
				games: stats?._count.kda || 0,
				winRate: winRate?.winRate.toFixed(2) || 0,
				points:
					(stats?._sum.damage || 0) +
					(stats?._sum.kda || 0) +
					(stats?._sum.perf || 0) +
					(stats?._sum.xClass || 0)
			};
		})
		.orderBy('points', 'desc')
		.value();

	const modalStore = getModalStore();

	function triggerDetailGameModal(stat: CompleteStat): void {
		const modalComponent: ModalComponent = {
			ref: GameVisualizer,
			props: {
				playerStat: stat.playerStat,
				stat: stat,
				color: colorsLevels.total[computeStat(stat)]
			},
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
	<title>URF | Ranks</title>
	<meta name="URF Ranks" content="NAF Ranks" />
</svelte:head>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<Filters periods={data.periods} users={data.users} champions={data.champions} />
	<table class="table table-hover mt-12 text-center">
		<thead>
			<tr>
				{#if userStats.length > 1}
					<th class="text-center">Rang</th>
					<th class="text-center">Name</th>
				{/if}
				<th class="text-center">Games</th>
				<th class="text-center">Points</th>
				<th class="text-center">P/G</th>
				<th class="text-center">W/R</th>
				<th class="text-center">Max Kills</th>
				<th class="text-center">Max Deaths</th>
				<th class="text-center">Nb Chars</th>
			</tr>
		</thead>
		<tbody>
			{#each userStats as user, i}
				<tr>
					{#if userStats.length > 1}
						<th>{i + 1}</th>
						<td>{user.name}</td>
					{/if}
					<td>{user.games}</td>
					<td>{user.points}</td>
					<td>{(user.points / user.games).toFixed(2)}</td>
					<td>{user.winRate} % </td>
					<td>{user._max?.kills}</td>
					<td>{user._max?.deaths}</td>
					<td>{user.championStats}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if !!data.allStats.length}
		<table class="table table-hover mt-12 text-center">
			<thead>
				<tr>
					<th class="text-center border-primary-500 border-r-2">Champion</th>
					<th class="text-center">Kills</th>
					<th class="text-center">Deaths</th>
					<th class="text-center border-primary-500 border-r-2">Assists</th>
					<th class="text-center">Damage</th>
					<th class="text-center">KDA</th>
					<th class="text-center">Perso</th>
					<th class="text-center border-primary-500 border-r-2">xClass</th>
					<th class="text-center">Total</th>
				</tr>
			</thead>
			<tbody>
				{#each data.allStats as stats}
					<tr on:click={() => triggerDetailGameModal(stats)}>
						<td
							class={`border-primary-500 border-r-2 font-bold ${colorsLevels.win[stats.playerStat.isWin.toString()]}`}
						>
							<div class="flex gap-4 justify-center items-center">
								<img
									class="w-9 m-[-0.5rem] shadow-xl"
									alt={stats.champion.champion.name}
									src={getChampionImage(stats.champion.champion.name)}
								/>
								<div class=" w-28">
									{championMapDbToDisplay[stats.champion.champion.name]}
								</div>
							</div>
						</td>
						<td>{stats.playerStat.kills} </td>
						<td>{stats.playerStat.deaths}</td>
						<td class="border-primary-500 border-r-2">{stats.playerStat.assists}</td>
						<td class={`${colorsLevels.dmg[stats.damage]}`}>{stats.damage}</td>
						<td class={`${colorsLevels.kda[stats.kda]}`}>{stats.kda}</td>
						<td class={`${colorsLevels.perso[stats.perf]}`}>{stats.perf}</td>
						<td class={`border-primary-500 border-r-2 ${colorsLevels.xClass[stats.xClass]}`}
							>{stats.xClass}</td
						>
						<td class={`font-bold ${colorsLevels.total[computeStat(stats)]}`}
							>{computeStat(stats)}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
