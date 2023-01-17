<script lang="ts">
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import CreateUser from '$lib/component/CreateUser.svelte';
	import { UserPlus } from 'lucide-svelte';

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
	<div class="flex flex-col gap-4 w-full">
		<h2>Moyennes:</h2>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col">
				<div class="font-bold">K/D/A:</div>
				<div>
					{data.avg.kills?.toFixed(1)}/{data.avg.deaths?.toFixed(1)}/{data.avg.assists?.toFixed(1)}
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
</section>
