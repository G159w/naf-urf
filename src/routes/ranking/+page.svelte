<script lang="ts">
	import {
		Select,
		Label,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import _ from 'lodash';
	import { fade } from 'svelte/transition';
	import type { User } from '$type-graphql';
	export let data;
	$: ({ Users } = data);
	$: userData = $Users?.data;

	let columns = [
		{
			header: 'Nom',
			format: (user: User) => user.name
		},
		{
			header: 'Points',
			format: (user: User) => user.ign
		},
		{
			header: 'Points / Games',
			format: (user: User) => user.lolId
		},
		{
			header: 'KDA',
			format: (user: User) => user.name
		},
		{
			header: 'Winrate',
			format: (user: User) => user.name
		},
		{
			header: 'Games',
			format: (user: User) => user.name
		}
	];
</script>

<svelte:head>
	<title>URF | Ranking</title>
	<meta name="rankings" content="Urf rankings" />
</svelte:head>

<div class="page-content pt-10" in:fade={{ duration: 200 }}>
	<Table striped={!_.isEmpty(userData?.users)} color="yellow">
		<TableHead>
			{#each columns as column}
				<TableHeadCell>{column.header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody class="divide-y">
			{#if _.isEmpty(userData?.users)}
				<TableBodyRow>
					<TableBodyCell colspan={columns.length} class="text-center">
						Aucune donnée pour le moment
					</TableBodyCell>
				</TableBodyRow>
			{:else}
				{#each userData?.users as user}
					<TableBodyRow>
						{#each columns as column}
							<TableBodyCell>{column.format(user)}</TableBodyCell>
						{/each}
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>
