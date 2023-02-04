<script lang="ts">
	import { scale } from 'svelte/transition';

	import { page } from '$app/stores';
	import type { Champion, Period, User } from '@prisma/client';
	import { goto } from '$app/navigation';
</script>

<div
	in:scale
	class={`card shadow-sm

		p-4 ${
			$$slots.rank ? 'w-48' : 'w-36'
		} flex flex-row justify-between items-center backdrop-blur-md !bg-gray-300/30 dark:!bg-black/40`}
>
	<div class="flex flex-col gap-0">
		<div class=" font-light text-lg text-gray-800 dark:text-gray-200 leading-0">
			<slot name="title">No Title</slot>
		</div>
		<div class=" font-bold text-lg leading-0">
			<slot name="stat">KDA</slot>
		</div>
		{#if $$slots.subStat}
			<div class="text-xs font-light text-gray-800 dark:text-gray-200 leading-0">
				<slot name="subStat">top 4%</slot>
			</div>
		{/if}
	</div>
	{#if $$slots.rank}
		<div
			class="text-lg font-bold  rounded-full w-10 h-10  border-2 border-gray-200 flex items-center justify-center"
		>
			<slot name="rank">5</slot>
		</div>
	{/if}
</div>
