<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
	// Form Data
	const formData = {
		name: 'ARURF 2021',
		date: new Date()
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

<form method="POST" action="/history?/createPeriod">
	<div class="modal-example-form {cBase}">
		<div class="modal-form {cForm}">
			<label for="name">
				<span>Nom</span>
				<input type="text" name="name" minlength="2" required />
			</label>
			<label for="date">
				<span>Date</span>
				<input type="date" name="date" required />
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
