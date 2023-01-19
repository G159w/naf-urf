<script lang="ts">
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import CreateUser from '$lib/component/CreateUser.svelte';
	import { UserPlus } from 'lucide-svelte';
	import { getChampionName } from '$lib/utils';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Game from '$lib/component/Game.svelte';
	import { format } from 'date-fns';

	export let data: PageData;

	let selectedUserId: number | undefined = +($page.url.searchParams.get('user') || 0) || undefined;
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

<svelte:head>
	<title>URF | Tribunal</title>
	<meta name="URF Tribunal" content="NAF Tribunal" />
</svelte:head>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<h1 class="font-bold">Tribunal</h1>

	<hr class="w-full" />
	<hr />
	<div class="w-full flex flex-row justify-between items-center">
		<h3>
			Affaire n°{data.stat.id}:
			<br />
			<span class="font-bold">Mr. {data.stat.user?.ign}</span>
		</h3>
		<h4>
			Faits ayant eu lieu le: <span class="font-bold"
				>{format(data.stat.game.gameCreation || new Date(), 'dd/MM/yyyy')}</span
			>
		</h4>
	</div>
</section>
