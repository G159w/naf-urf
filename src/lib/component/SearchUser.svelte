<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';

	import Autocomplete from '@smui-extra/autocomplete';
	import { GQL_AllUsers, QueryMode } from '$houdini';
	import { goto } from '$app/navigation';
	export let defaultValue = undefined;

	let value = defaultValue;

	const goToDetail = async (option) => {
		const user = option.detail;
		if (user) {
			const url = new URL(location.toString());
			url.searchParams.set('user', user.id);
			await goto(url);
		}
	};

	const reset = async () => {
		value = undefined;
		const url = new URL(location.toString());
		url.searchParams.delete('user');
		await goto(url.href, { replaceState: true });
	};

	const fetch = async () => {
		const response = await GQL_AllUsers.fetch();
		return response.data.users;
	};
</script>

<div class="flex relative">
	<Autocomplete
		options={() => fetch()}
		class="w-full"
		textfield$class="w-full"
		textfield$variant="outlined"
		toggle
		on:SMUIAutocomplete:selected={(option) => goToDetail(option)}
		bind:value
		on:change={goToDetail}
		getOptionLabel={(option) => (option ? `${option.name} (${option.ign})` : '')}
		label="Utilisateur (Général par default)"
	/>
	<Button class="absolute right-0 h-full" color="secondary" on:click={reset}>
		<Icon class="material-icons">cancel</Icon>
	</Button>
</div>
