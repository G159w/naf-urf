<script lang="ts">
	import { Coins, Gavel } from 'lucide-svelte';
	import { page } from '$app/stores';
	import type { Period, User } from '@prisma/client';
	import { goto } from '$app/navigation';

	export let options: string[];
</script>

<div>
	<input />
</div>
