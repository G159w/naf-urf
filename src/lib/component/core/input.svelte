<script>
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	export let placeholder = '';
	export let label = '';
	export let error = '';
	export let value = '';
</script>

<div>
	<Textfield variant="outlined" invalid={error} bind:value {label}>
		<HelperText slot="helper">{placeholder}</HelperText>
	</Textfield>
</div>
