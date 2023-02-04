<script lang="ts">
	import { page } from '$app/stores';
	import type { Champion, Period, User } from '@prisma/client';
	import { goto } from '$app/navigation';

	export let periods: Period[] | undefined = undefined;
	export let users: User[] | undefined = undefined;
	export let champions: Champion[] | undefined = undefined;

	const getRoundedClass = (type: 'user' | 'period' | 'champion') => {
		if (type === 'user') {
			if (periods && champions) {
				return 'sm:!rounded-none';
			} else if (!periods && champions) {
				return 'sm:!rounded-r-none';
			} else if (periods && !champions) {
				return 'sm:!rounded-l-none';
			} else {
				return '';
			}
		} else if (type === 'period') {
			if (users || champions) {
				return 'sm:!rounded-r-none';
			} else {
				return '';
			}
		} else {
			if (users || periods) {
				return 'sm:!rounded-l-none';
			} else {
				return '';
			}
		}
	};

	let selectedPeriodId: number | undefined =
		+($page.url.searchParams.get('period') || 0) || undefined;
	let selectedUserId: number | undefined = +($page.url.searchParams.get('user') || 0) || undefined;
	let selectedChampionId: number | undefined =
		+($page.url.searchParams.get('champion') || 0) || undefined;
</script>

<div class="flex mt-2 flex-col gap-2 items-center sm:flex-row sm:gap-0">
	{#if periods}
		<select
			bind:value={selectedPeriodId}
			on:change={async () => {
				const newUrl = new URL($page.url);
				newUrl?.searchParams?.delete('page');
				if (selectedPeriodId) {
					newUrl?.searchParams?.set('period', selectedPeriodId.toString());
				} else {
					newUrl?.searchParams?.delete('period');
				}
				await goto(newUrl);
			}}
			class={`!w-48 ${getRoundedClass('period')}`}
			style="width: 180px"
		>
			<option value={undefined}> Période </option>
			{#each periods as period}
				<option value={period.id}>
					{period.name}
				</option>
			{/each}
		</select>
	{/if}
	{#if users}
		<select
			bind:value={selectedUserId}
			on:change={async () => {
				const newUrl = new URL($page.url);
				if (selectedUserId) {
					newUrl?.searchParams?.set('user', selectedUserId.toString());
				} else {
					newUrl?.searchParams?.delete('user');
				}
				await goto(newUrl);
			}}
			class={`!w-48 ${getRoundedClass('user')}`}
		>
			<option value={undefined}> Joueur </option>
			{#each users as user}
				<option value={user.id}>
					{user.name}
				</option>
			{/each}
		</select>
	{/if}
	{#if champions}
		<select
			bind:value={selectedChampionId}
			on:change={async () => {
				const newUrl = new URL($page.url);
				if (selectedChampionId) {
					newUrl?.searchParams?.set('champion', selectedChampionId.toString());
				} else {
					newUrl?.searchParams?.delete('champion');
				}
				await goto(newUrl);
			}}
			class={`!w-48 ${getRoundedClass('champion')}`}
		>
			<option value={undefined}> Champion </option>
			{#each champions as champion}
				<option value={champion.id}>
					{champion.name}
				</option>
			{/each}
		</select>
	{/if}
</div>
