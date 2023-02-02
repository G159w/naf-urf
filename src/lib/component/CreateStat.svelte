<script lang="ts">
	import { Coins, Gavel } from 'lucide-svelte';

	let damageBonus: number = 0;
</script>

<form method="POST" action="/tribunal?/createStat	">
	<div class="flex mt-2">
		<select name="bonusDamage" class=" w-60" style="width: 80px; border-radius: 0">
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
			<option value={-3}> -3 </option>
			<option value={-5}> -5 </option>
		</select>
		<select
			name="kda"
			bind:value={damageBonus}
			disabled
			class=" w-60 rounded-none"
			style="width: 80px; border-radius: 0"
		>
			<option value={3}> +3 </option>
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
		</select>
		<select name="perf" class=" w-60 rounded-none" style="width: 80px; border-radius: 0">
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
		</select>
		<select name="xclass" class=" w-60 rounded-none" style="width: 80px; border-radius: 0">
			<option value={-4}> +4 </option>
			<option value={0}> 0 </option>
			<option value={4}> -4 </option>
		</select>
		<input
			style="width: 200px; border-radius: 0"
			placeholder="Remarques"
			type="text"
			minlength="2"
		/>
		<button
			class="icon-btn btn-filled-primary p-0 rounded-none w-12 flex justify-center items-center"
		>
			<Gavel />
		</button>
	</div>
</form>
