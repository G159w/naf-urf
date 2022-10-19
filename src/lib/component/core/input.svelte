<script>
	import { Input, Label, Helper } from 'flowbite-svelte';
	export let placeholder = '';
	export let label = '';
	export let error = '';
	export let value = '';
</script>

<div>
	<Label for="name" color={error ? 'red' : 'gray'} class="block mb-2">{label}</Label>
	<Input
		{...$$restProps}
		bind:value
		on:blur
		on:change
		on:click
		on:focus
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		color={error ? 'red' : 'base'}
		{placeholder}
	/>
	<Helper class="mt-2" color={error ? 'red' : 'gray'}>
		{error}
	</Helper>
</div>
