<script lang="ts">
	import type { Champion, Period, PlayerStat, Stat, User } from '@prisma/client';
	import { Trophy } from 'lucide-svelte';
	import {
		colorsLevels,
		computeStat,
		getChampionDragonName,
		getChampionImage,
		getColor
	} from '$lib/utils';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import GameVisualizer from '../GameVisualizer.svelte';
	import type { CompleteStat, MaxStat } from '$lib/type';
	export let playerStats: MaxStat[];
	export let statKey: keyof PlayerStat;
	export let title: string;

	const modalStore = getModalStore();

	function triggerDetailGameModal(playerStat: CompleteStat['playerStat'], stat: Stat): void {
		const modalComponent: ModalComponent = {
			ref: GameVisualizer,
			props: {
				playerStat: playerStat,
				stat: stat,
				color: stat ? colorsLevels.total[computeStat(stat)] : ''
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

<div
	class={`card shadow-sm flex flex-col justify-between items-center gap-4 p-4 backdrop-blur-md !bg-gray-300/30 dark:!bg-black/40`}
>
	<h4>{title}</h4>
	<div class="flex flex-col w-full">
		{#each playerStats || [] as playerStat, index}
			<button
				class="flex flex-row gap-4 align-middle items-center hover:bg-surface-900 rounded-r-md"
				on:click={() => triggerDetailGameModal(playerStat, playerStat.stat)}
			>
				<img
					class="w-12"
					alt={playerStat.champion.name}
					src={getChampionImage(playerStat.champion.name)}
				/>
				<div class="flex flex-row justify-between items-center w-36">
					<div class="flex flex-col justify-start">
						<span class="text-lg font-bold leading-none justify-start flex">
							{playerStat[statKey]?.toLocaleString()}
						</span>
						<span class="text-sm font-light text-gray-800 dark:text-gray-200 leading-none justify-start flex">
							{playerStat.user?.name}
						</span>
					</div>
					{#if index < 3}
						<span class="text-lg pr-2"> <Trophy class={`${getColor(index)}`} /> </span>
					{/if}
				</div>
			</button>
		{/each}
	</div>
</div>
