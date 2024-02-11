<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;


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
