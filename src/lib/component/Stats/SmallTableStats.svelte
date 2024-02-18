<script lang="ts">
	import type { Champion, Period, PlayerStat, User } from '@prisma/client';
	import { Trophy } from 'lucide-svelte';
	import { getChampionDragonName, getColor } from '$lib/utils';
	export let playerStats: (PlayerStat & {
		champion: Champion;
		user: User | null;
	})[];
	export let statKey: keyof PlayerStat;
	export let title: string;
</script>

<div
	class={`card shadow-sm flex flex-col justify-between items-center gap-4 p-4 backdrop-blur-md !bg-gray-300/30 dark:!bg-black/40`}
>
	<h4>{title}</h4>
	<div class="flex flex-col w-full">
		{#each playerStats || [] as playerStat, index}
			<div class="flex flex-row gap-4 align-middle items-center ">
				<img
					class="w-12"
					alt={playerStat.champion.name}
					src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${getChampionDragonName(
						playerStat.champion.name
					)}.png`}
				/>
				<div class="flex flex-row justify-between items-center w-36">
					<div class="flex flex-col ">
						<span class="text-lg font-bold leading-none	">
							{playerStat[statKey]?.toLocaleString()}
						</span>
						<span class="text-sm font-light text-gray-800 dark:text-gray-200 leading-none	">
							{playerStat.user?.name}
						</span>
					</div>
					{#if index < 3}
						<span class="text-lg"> <Trophy class={`${getColor(index)}`} /> </span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
