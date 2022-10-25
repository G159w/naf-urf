<script lang="ts">
	import { Select, Button, Label, Input } from 'flowbite-svelte';

	import { GQL_AllUsers, QueryMode } from '$houdini';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	export let defaultValue = '';

	$: search = defaultValue.toString();
	$: browser && GQL_AllUsers.fetch();

	const defaulSelecttValue = {
		value: '',
		name: 'Général (par default)'
	};
	const getUsers = (users: typeof $GQL_AllUsers.data.users) => {
		return (
			users?.map((user) => ({
				value: user.id.toString(),
				name: user.ign
			})) || []
		);
	};

	const goToDetail = () => {
		goto(`/stats${search ? `/${search}` : ''}`);
	};
</script>

<div>
	<Select
		bind:value={search}
		placeholder={'Général (par default)'}
		id="select-sm"
		size="lg"
		on:change={goToDetail}
		items={[...(search ? [defaulSelecttValue] : []), ...getUsers($GQL_AllUsers.data?.users)]}
		class="mb-6"
	/>
</div>
