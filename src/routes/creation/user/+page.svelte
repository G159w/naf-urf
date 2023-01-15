<script lang="ts">
	import { fade } from 'svelte/transition';

	export let form;
</script>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<h1 class="font-bold">Nouvel Utilisateur</h1>
	<hr class="w-full" />
	<form method="POST">
		<div class="flex flex-col gap-4 w-72 mt-24">
			<label for="name">
				<span>Nom</span>
				<input type="text" name="name" minlength="2" required />
			</label>
			<label for="color">
				<span>IGN</span>
				<input type="text" name="ign" minlength="2" required />
			</label>
		</div>
		<button class="btn btn-filled-primary btn-base mt-8 w-72"> Create </button>
	</form>
</section>
