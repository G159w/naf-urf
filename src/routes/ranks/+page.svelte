<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Filters from '$lib/component/Filters.svelte';
	import _ from 'lodash';

	export let data: PageData;

	$: userStats = _(data.users)
		.map((user) => {
			const stats = _.find(data.stats, (stat) => stat.userId === user.id);
			const championStats = _.countBy(data.nbChampionStats, (stat) =>
				stat.userId === user.id ? true : false
			);

			return {
				...user,
				...stats,
				championStats: championStats.true || 0,
				games: stats?._count.kda || 0,
				points:
					(stats?._sum.damage || 0) +
					(stats?._sum.kda || 0) +
					(stats?._sum.perf || 0) +
					(stats?._sum.xClass || 0)
			};
		})
		.orderBy('points', 'desc')
		.value();
</script>

<svelte:head>
	<title>URF | Ranks</title>
	<meta name="URF Ranks" content="NAF Ranks" />
</svelte:head>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<Filters periods={data.periods} champions={data.champions} />
	<table class="table table-hover mt-12">
		<thead>
			<tr>
				<th>Rang</th>
				<th>Name</th>
				<th>Games</th>
				<th>Points</th>
				<th>P/G</th>
				<th>W/R</th>
				<th>Max Kills</th>
				<th>Max Deaths</th>
				<th>Nb Chars</th>
			</tr>
		</thead>
		<tbody>
			{#each userStats as user, i}
				<tr>
					<td>{i + 1}</td>
					<td>{user.name}</td>
					<td>{user.games}</td>
					<td>{user.points}</td>
					<td>{(user.points / user.games).toFixed(2)}</td>
					<td />
					<td>{user._max?.kills}</td>
					<td>{user._max?.deaths}</td>
					<td>{user.championStats}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
