<script lang="ts">
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import CreateUser from '$lib/component/CreateUser.svelte';
	import { UserPlus } from 'lucide-svelte';
	import { getChampionName } from '$lib/utils';

	export let data: PageData;

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			ref: CreateUser,
			slot: '<p>Skeleton</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(d);
	}
</script>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<div class="flex gap-4 justify-between w-full items-center">
		<div class="flex gap-2 flex-col" />
		<h1 class="font-bold">Statistiques Globale</h1>
		<button class="btn-icon btn-filled-primary p-0" on:click={triggerCustomModal}>
			<UserPlus size={20} />
		</button>
	</div>

	<hr class="w-full" />
	<hr />
	<div class="w-full flex flex-row justify-between">
		<div class="flex flex-col gap-4">
			<h2>Moyennes:</h2>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col">
					<div class="font-bold">K/D/A:</div>
					<div>
						{data.avg.kills?.toFixed(1)}/{data.avg.deaths?.toFixed(1)}/{data.avg.assists?.toFixed(
							1
						)}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Dégâts:</div>
					<div>
						{data.avg.damage?.toLocaleString()}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Gold:</div>
					<div>
						{data.avg.goldEarned?.toLocaleString()}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Double kills:</div>
					<div>
						{((data.avg.doubleKills || 0) * 100).toFixed(2)} %
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Triple kills:</div>
					<div>
						{((data.avg.tripleKills || 0) * 100).toFixed(2)} %
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Quadrakill:</div>
					<div>
						{((data.avg.quadraKills || 0) * 100).toFixed(2)} %
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Pentakills:</div>
					<div>
						{((data.avg.pentaKills || 0) * 100).toFixed(2)} %
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-4 ">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col">
					<div class="font-bold">Win Rate:</div>
					<div>
						{data.wr.toFixed(2)} %
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Max kills:</div>
					<div>
						{data.max.kills?.toLocaleString()}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Max deaths:</div>
					<div>
						{data.max.deaths?.toLocaleString()}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Max assists:</div>
					<div>
						{data.max.assists?.toLocaleString()}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Max dégâts:</div>
					<div>
						{data.max.damage?.toLocaleString()}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Champions le plus joué:</div>
					<div>
						{data.max.champion.name} ({data.max.champion._count.players} picks)
					</div>
				</div>
				<div class="flex flex-col">
					<div class="font-bold">Champions qui a le plus gagné:</div>
					<div>
						{data.max.championWin.name} ({data.max.championWin._count.players} wins)
					</div>
				</div>
			</div>
		</div>
		<div>
			<img
				class="basis-1/12s"
				alt={data.max.champion.name}
				src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${getChampionName(
					data.max.champion.name
				)}_0.jpg`}
			/>
		</div>
	</div>
</section>
