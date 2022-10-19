<script lang="ts">
	import Input from '$lib/component/core/input.svelte';
	import { fade } from 'svelte/transition';
	import { Button } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { graphql, type CreateUserStore } from '$houdini';

	const createUser: CreateUserStore = graphql`
		mutation CreateUser($name: String!, $lolId: String!, $ign: String!) {
			createOneUser(data: { name: $name, lolId: $lolId, ign: $ign }) {
				id
				ign
				lolId
			}
		}
	`;

	const { form, errors, state, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
			ign: '',
			lolId: ''
		},
		validationSchema: yup.object().shape({
			name: yup.string().required(),
			ign: yup.string().required(),
			lolId: yup.string().required()
		}),
		onSubmit: (values) => {
			createUser.mutate({
				name: values.name,
				lolId: values.lolId,
				ign: values.ign
			});
		}
	});
</script>

<svelte:head>
	<title>URF Stats</title>
	<meta name="statistiques" content="Urf statistiques" />
</svelte:head>

<div class="page-content pt-10" in:fade={{ duration: 200 }}>
	<h1 class="dark:text-white">Create user</h1>
	<form class="flex flex-col align-middle justify-center gap-3" on:submit={handleSubmit}>
		<Input
			id="name"
			name="name"
			label="Nom d'utilisateur"
			placeholder="Henri"
			error={$errors.name}
			on:change={handleChange}
			on:blur={handleChange}
			bind:value={$form.name}
		/>
		<Input
			id="ign"
			name="ign"
			label="Nom d'invocateur"
			placeholder="Frank Château"
			error={$errors.ign}
			on:change={handleChange}
			on:blur={handleChange}
			bind:value={$form.ign}
		/>
		<Input
			id="lolId"
			name="lolId"
			label="ID Lol"
			placeholder="156494651"
			error={$errors.lolId}
			on:change={handleChange}
			on:blur={handleChange}
			bind:value={$form.lolId}
		/>
		<Button color="yellow" class="mt-2" type="submit">Créer</Button>
	</form>
</div>
