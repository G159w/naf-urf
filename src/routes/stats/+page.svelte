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
		<h1 class="font-bold">Statistiques</h1>
		<button class="btn-icon btn-filled-primary p-0" on:click={triggerCustomModal}>
			<UserPlus size={20} />
		</button>
	</div>

	<hr class="w-full" />
	<hr />
	Pas de stats .... Pour l'instant :)
</section>
