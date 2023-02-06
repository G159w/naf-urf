<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Filters from '$lib/component/Filters.svelte';
	import _ from 'lodash';

	export let data: PageData;

	$: userStats = data.users.map((user) => {
		const stats = _.find(data.stats, (stat) => stat.userId === user.id);
		return {
			...user,
			games: stats?._count.kda || 0,
			points:
				(stats?._sum.damage || 0) +
				(stats?._sum.kda || 0) +
				(stats?._sum.perf || 0) +
				(stats?._sum.xClass || 0)
		};
	});
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
	<table class="table table-hover mt-10">
		<thead>
			<tr>
				<th>Name</th>
				<th>IGN</th>
				<th>Games</th>
				<th>Points</th>
			</tr>
		</thead>
		<tbody>
			{#each userStats as user, i}
				<tr>
					<td>{user.name}</td>
					<td>{user.ign}</td>
					<td>{user.games}</td>
					<td>{user.points}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
