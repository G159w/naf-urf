<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
	// Form Data
	const formData = {
		name: 'Jane Doe',
		tel: '214-555-1234',
		email: 'jdoe@email.com'
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}
	// Base Classes
	const cBase = 'space-y-4';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

<form method="POST" action="/stats?/createUser">
	<div class="modal-example-form {cBase}">
		<div class="modal-form {cForm}">
			<label for="name">
				<span>Nom</span>
				<input type="text" name="name" minlength="2" required />
			</label>
			<label for="color">
				<span>IGN</span>
				<input type="text" name="ign" minlength="2" required />
			</label>
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click|preventDefault={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}">Create</button>
		</footer>
	</div>
</form>
