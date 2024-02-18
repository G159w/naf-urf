<script lang="ts">
	import type { PageData } from './$types';
	import { getChampionDragonName } from '$lib/utils';
	import Filters from '$lib/component/Filters.svelte';
	import { enhance } from '$app/forms';
	import { Save } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data: PageData;

	let periodId: number | undefined = +($page.url.searchParams.get('period') || 0) || undefined;
</script>

<svelte:head>
	<title>URF | Stats</title>
	<meta name="URF WinRates" content="NAF WinRates" />
</svelte:head>

<section class="container h-full mx-auto flex flex-col gap-8 w-full items-center">
	<Filters periods={data.periods} />
	{#key data}
		<div class="flex flex-wrap gap-1">
			{#each data.champions as champion}
				<form
					method="POST"
					action="/winrates?/createChampStat"
					use:enhance={({ formData }) => {
						formData.append('championId', `${champion.id}`);
						formData.append('periodId', `${periodId}`);

						return async () => {};
					}}
				>
					<div class="flex flex-row gap-2 items-center">
						<div class="w-32">{getChampionDragonName(champion.name)}</div>
						<input
							name="winrate"
							type="number"
							step="0.01"
							value={champion.stats?.[0]?.winrate}
							class="!w-20 "
						/>
						<button class="btn btn-icon p-0"> <Save /></button>
					</div>
				</form>
			{/each}
		</div>
	{/key}
</section>
