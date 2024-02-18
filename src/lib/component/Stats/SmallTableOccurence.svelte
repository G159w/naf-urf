<script lang="ts">
	import type { Champion, Period, PlayerStat, User } from '@prisma/client';
	import { Trophy } from 'lucide-svelte';
	import { getChampionDragonName, getChampionImage, getColor } from '$lib/utils';
	export let champions: {
		id?: number | undefined;
		name?: string | undefined;
		support?: boolean | undefined;
		updatedAt?: Date | undefined;
		createdAt?: Date | undefined;
		occurrence: number;
	}[];
	export let title: string;
	export let subText: string;
</script>

<div
	class={`card shadow-sm

		flex flex-col justify-between items-center gap-4 p-4 backdrop-blur-md !bg-gray-300/30 dark:!bg-black/40`}
>
	<h4>{title}</h4>
	<div class="flex flex-col w-full">
		{#each champions || [] as champion, index}
			<div class="flex flex-row gap-4 align-middle items-center ">
				<img
					class="w-10"
					alt={champion.name}
					src={getChampionImage(champion.name || '')}
				/>
				<div class="flex flex-row justify-between items-center w-32">
					<div class="flex flex-col ">
						<span class="text-lg font-bold leading-none	">
							{champion.occurrence.toLocaleString()}
						</span>
						<span class="text-sm font-light text-gray-800 dark:text-gray-200 leading-none	">
							{subText}
						</span>
					</div>
					{#if index < 3}
						<span class="text-lg text-gray-300"> <Trophy class={`${getColor(index)}`} /> </span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
