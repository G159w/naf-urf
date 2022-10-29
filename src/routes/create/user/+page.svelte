<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import Input from '$lib/component/core/input.svelte';
	import { fade } from 'svelte/transition';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { graphql, type CreateUserStore } from '$houdini';
	import { goto } from '$app/navigation';

	const createUser: CreateUserStore = graphql`
		mutation CreateUser($name: String!, $ign: String!) {
			createUser(data: { name: $name, ign: $ign }) {
				id
				ign
				lolId
			}
		}
	`;

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			name: '',
			ign: '',
			lolId: ''
		},
		validationSchema: yup.object().shape({
			name: yup.string().required(),
			ign: yup.string().required()
		}),
		onSubmit: async (values) => {
			await createUser.mutate({
				name: values.name,
				ign: values.ign
			});
			goto('/ranking');
		}
	});
</script>

<svelte:head>
	<title>URF Stats</title>
	<meta name="statistiques" content="Urf statistiques" />
</svelte:head>

<div class="page-content pt-10" in:fade={{ duration: 200 }}>
	<h1 class="text-white">Create user</h1>
	<form class="flex flex-col align-middle justify-center gap-3" on:submit={handleSubmit}>
		<!-- <Input
			id="name"
			name="name"
			label="Nom d'utilisateur"
			placeholder="Entrer votre nom"
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
		/> -->
		<Button class="mt-2" type="submit">Créer</Button>
	</form>
</div>
