<script lang="ts">
	import { page } from '$app/stores';
	import type { Champion, Period, User } from '@prisma/client';
	import { goto } from '$app/navigation';
	import { getChampionName } from '$lib/utils';
	import {
		Autocomplete,
		popup,
		type AutocompleteOption,
		type PopupSettings,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';
	import _ from 'lodash';

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

	let championById = _.keyBy(champions, 'id');
	let userById = _.keyBy(users, 'id');
	let periodById = _.keyBy(periods, 'id');

	const championList: AutocompleteOption<string, Champion>[] = _.map(champions, (champion) => ({
		label: getChampionName(champion.name),
		value: champion.name,
		meta: champion
	}));

	let selectedChampion: string | undefined = selectedChampionId
		? getChampionName(championById[selectedChampionId].name)
		: undefined;

	const userList: AutocompleteOption<string, User>[] = _.map(users, (user) => ({
		label: user.name,
		value: user.name,
		meta: user
	}));

	let selectedUser: string | undefined = selectedUserId ? userById[selectedUserId].name : undefined;

	let popupAutocompleteChampion: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteChampion',
		placement: 'bottom-start'
	};

	let popupAutocompleteUser: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocompleteUser',
		placement: 'bottom-start'
	};

	const popupComboboxPeriod: PopupSettings = {
		event: 'click',
		target: 'popupComboboxPeriod',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
	let comboboxValue: string;
</script>

<div class="flex mt-2 flex-col gap-1 items-center sm:flex-row">
	{#if periods}
		<button class="btn variant-filled-surface w-48 justify-between" use:popup={popupComboboxPeriod}>
			<span class="capitalize"
				>{selectedPeriodId ? periodById[selectedPeriodId].name : 'Période'}</span
			>
		</button>
		<div class="card w-48 shadow-xl py-2 z-50" data-popup="popupComboboxPeriod">
			<ListBox rounded="rounded-none">
				<ListBoxItem
					bind:group={comboboxValue}
					name={'No period'}
					value={''}
					on:click={async () => {
						const newUrl = new URL($page.url);
						newUrl?.searchParams?.delete('period');
						await goto(newUrl);
					}}
				>
					Aucun filtre</ListBoxItem
				>
				{#each periods as period}
					<ListBoxItem
						bind:group={comboboxValue}
						name={period.name}
						value={period.id}
						on:click={async () => {
							const newUrl = new URL($page.url);
							newUrl?.searchParams?.set('period', period.id.toString());
							await goto(newUrl);
						}}
					>
						{period.name}</ListBoxItem
					>
				{/each}
			</ListBox>
			<div class="arrow bg-surface-100-800-token" />
		</div>
	{/if}
	{#if users}
		<input
			class="input autocomplete"
			type="search"
			name="autocomplete-search"
			bind:value={selectedUser}
			placeholder="Joueur..."
			use:popup={popupAutocompleteUser}
		/>
		<div
			data-popup="popupAutocompleteUser"
			class="card w-full max-w-64 max-h-48 overflow-y-auto z-50"
			tabindex="-1"
		>
			<Autocomplete
				bind:input={selectedUser}
				options={userList}
				on:selection={async (value) => {
					const newUrl = new URL($page.url);
					selectedUser = value.detail.value;
					if (!value.detail.meta) {
						newUrl?.searchParams?.delete('user');
					} else {
						selectedUserId = value.detail.meta.id;
						newUrl?.searchParams?.set('user', selectedUserId.toString());
					}
					await goto(newUrl);
				}}
			/>
		</div>
	{/if}
	{#if champions}
		<input
			class="input autocomplete"
			type="search"
			name="autocomplete-search"
			bind:value={selectedChampion}
			placeholder="Champion..."
			use:popup={popupAutocompleteChampion}
		/>
		<div
			data-popup="popupAutocompleteChampion"
			class="card w-full max-w-64 max-h-48 overflow-y-auto z-50"
			tabindex="-1"
		>
			<Autocomplete
				bind:input={selectedChampion}
				options={championList}
				on:selection={async (value) => {
					const newUrl = new URL($page.url);
					selectedChampion = value.detail.value;
					if (!value.detail.meta) {
						newUrl?.searchParams?.delete('champion');
					} else {
						selectedChampionId = value.detail.meta.id;
						newUrl?.searchParams?.set('champion', selectedChampionId.toString());
					}
					await goto(newUrl);
				}}
			/>
		</div>
	{/if}
</div>
