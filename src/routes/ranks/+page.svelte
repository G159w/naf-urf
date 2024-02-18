<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Filters from '$lib/component/Filters.svelte';
	import _ from 'lodash';
	import { championMapDbToDisplay, getChampionName } from '$lib/utils';

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

	let colorsLevels: {
		xClass: Record<string, string>;
		perso: Record<string, string>;
		kda: Record<string, string>;
		dmg: Record<string, string>;
		win: Record<string, string>;
		total: Record<number, string>;
	} = {
		xClass: {
			'-4': 'bg-red-500 bg-opacity-50',
			'4': 'bg-green-500 bg-opacity-50'
		},
		perso: {
			'-2': 'bg-red-500 bg-opacity-50',
			'2': 'bg-green-500 bg-opacity-50'
		},
		kda: {
			'-2': 'bg-red-500 bg-opacity-50',
			'2': 'bg-green-400 bg-opacity-50',
			'3': 'bg-green-500 bg-opacity-50'
		},
		dmg: {
			'-5': 'bg-red-500 bg-opacity-50',
			'-3': 'bg-red-400 bg-opacity-50',
			'-2': 'bg-red-300 bg-opacity-50',
			'2': 'bg-green-500 bg-opacity-50'
		},
		win: {
			false: 'bg-red-500 bg-opacity-50',
			true: 'bg-green-500 bg-opacity-50	'
		},
		total: {
			'-13': 'bg-red-500 bg-opacity-50',
			'-12': 'bg-red-500 bg-opacity-50',
			'-11': 'bg-red-500 bg-opacity-50',
			'-10': 'bg-red-500 bg-opacity-50',
			'-9': 'bg-red-400 bg-opacity-50',
			'-8': 'bg-red-400 bg-opacity-50',
			'-7': 'bg-red-400 bg-opacity-50',
			'-6': 'bg-red-400 bg-opacity-50',
			'-5': 'bg-red-400 bg-opacity-50',
			'-4': 'bg-red-300 bg-opacity-50',
			'-3': 'bg-red-300 bg-opacity-50',
			'-2': 'bg-red-300 bg-opacity-50',
			'-1': 'bg-red-300 bg-opacity-50',
			'1': 'bg-green-300 bg-opacity-50',
			'2': 'bg-green-300 bg-opacity-50',
			'3': 'bg-green-300 bg-opacity-50',
			'4': 'bg-green-300 bg-opacity-50',
			'5': 'bg-green-400 bg-opacity-50',
			'6': 'bg-green-400 bg-opacity-50',
			'7': 'bg-green-400 bg-opacity-50',
			'8': 'bg-green-400 bg-opacity-50',
			'9': 'bg-green-500 bg-opacity-50',
			'10': 'bg-green-500 bg-opacity-50'
		}
	};
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
					<tr>
						<td
							class={`border-primary-500 border-r-2 font-bold ${colorsLevels.win[stats.playerStat.isWin.toString()]}`}
						>
							<div class="flex gap-4 justify-center items-center">
								<img
									class="w-9 m-[-0.5rem] shadow-xl"
									alt={stats.champion.champion.name}
									src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${getChampionName(
										stats.champion.champion.name
									)}.png`}
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
						<td
							class={`font-bold ${colorsLevels.total[stats.kda + stats.perf + stats.xClass + stats.damage]}`}
							>{stats.kda + stats.perf + stats.xClass + stats.damage}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
