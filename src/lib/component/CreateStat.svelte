<script lang="ts">
	import type { Champion, ChampionStat, Game, PlayerStat, User } from '@prisma/client';
	import { applyAction, enhance } from '$app/forms';

	import _ from 'lodash';
	import { Gavel } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import type { GameCreateStat } from '$lib/utils';

	export let playerStat: GameCreateStat;
	export let callback: (() => void) | undefined = undefined;

	let winRate =
		_.find(playerStat.champion.stats, (x) => x.periodId === playerStat.game.periodId)?.winrate || 0;

	const computeDmg = (stat: GameCreateStat) => {
		if (stat.stat) {
			return stat.stat.damage;
		}
		if (stat.champion.support) {
			return 0;
		}
		const teamStat = stat.game.players.filter((p) => p.isAllyTeam && p.userId !== stat.userId);
		const maxDmg = _.maxBy(teamStat, 'damage');
		if ((maxDmg?.damage || 0) * 1.2 < stat.damage) {
			return 2;
		}
		const minDmg = _.minBy(teamStat, 'damage');
		if ((minDmg?.damage || 0) * 0.8 > stat.damage) {
			return -2;
		}
		return 0;
	};

	const computeFirstLast = (stat: GameCreateStat) => {
		if (stat.champion.support) {
			return 0;
		}
		const teamStat = stat.game.players.filter((p) => p.isAllyTeam && p.userId !== stat.userId);
		const maxDmg = _.maxBy(teamStat, 'damage');
		if ((maxDmg?.damage || 0) < stat.damage) {
			return 2;
		}
		const minDmg = _.minBy(teamStat, 'damage');
		if ((minDmg?.damage || 0) > stat.damage) {
			return -2;
		}
		return 0;
	};

	const computeKda = (stat: GameCreateStat) => {
		if (stat.stat) {
			return stat.stat.kda;
		}
		if (stat.champion.support) {
			return 0;
		}
		if (stat.deaths === 0) {
			return 3;
		}
		const kda = (stat.kills + stat.assists) / stat.deaths;
		if (kda > 3) {
			return 2;
		}
		if (kda < 1.5) {
			return -2;
		}
		return 0;
	};

	const computePerf = (stat: GameCreateStat) => {
		if (stat.stat) {
			return stat.stat.perf;
		}
		if (stat.champion.support) {
			return 0;
		}
		const kd = stat.kills / (stat.deaths || 1);
		if (winRate < 48.5) {
			return kd > 1 ? 2 : 0;
		}
		if (winRate > 51.5) {
			return kd > 1 ? 0 : -2;
		}
		if (kd < 0.8) return -2;
		if (kd >= 0.8 && kd <= 1.2) return 0;
		return 2;
	};

	const computeXClass = (stat: GameCreateStat) => {
		if (stat.stat) {
			return stat.stat.xClass;
		}
		if (stat.champion.support) {
			return 0;
		}
		const teamStat = stat.game.players.filter((p) => p.isAllyTeam && p.userId !== stat.userId);
		// Master
		const hasSupport = !!teamStat.find((p) => p.userId && p.champion.support);
		const maxDmg = _.maxBy(teamStat, 'damage');
		if (
			!hasSupport &&
			(maxDmg?.damage || 0) * 1.4 < stat.damage &&
			teamStat.map((p) => p.kills / (p.deaths || 1)).filter((x) => x < 1.1).length === 4
		) {
			return 4;
		}
		// Disaster
		const kd = stat.kills / (stat.deaths || 1);
		if (
			kd <= 0.5 &&
			teamStat.map((p) => p.kills / (p.deaths || 1)).filter((x) => x >= 1).length === 4
		) {
			return -4;
		}
		return 0;
	};

	let bonusDamage = computeDmg(playerStat);
	let firstLastDamage = computeFirstLast(playerStat);
	let kda = computeKda(playerStat);
	let perf = computePerf(playerStat);
	if (perf > 0 && firstLastDamage < 0) {
		perf = 0;
	} else if (perf < 0 && firstLastDamage > 0) {
		perf = 0;
	}
	let xclass = computeXClass(playerStat);
	$: total = bonusDamage + kda + perf + xclass;
	let comment = playerStat.stat?.comment || '';
</script>

<form
	method="POST"
	action="/tribunal?/createStat"
	use:enhance={({ formData }) => {
		formData.append('playerStatId', `${playerStat.id}`);
		if (playerStat.stat) {
			formData.append('statId', `${playerStat.stat.id}`);
		}
		callback?.();
	}}
>
	<div class="flex mt-2 items-center">
		<div class="flex flex-col">
			<div class="w-full items-center text-center">Dmg</div>
			<select bind:value={bonusDamage} name="bonusDamage" class=" w-[80] variant-filled-primary">
				<option value={2}> +2 </option>
				<option value={0}> 0 </option>
				<option value={-2}> -2 </option>
				<option value={-3}> -3 </option>
				<option value={-5}> -5 </option>
			</select>
		</div>
		<div class="flex flex-col">
			<div class="w-full items-center text-center">KDA</div>
			<select name="kda" bind:value={kda} class=" w-[80] variant-filled-primary">
				<option value={3}> +3 </option>
				<option value={2}> +2 </option>
				<option value={0}> 0 </option>
				<option value={-2}> -2 </option>
			</select>
		</div>
		<div class="flex flex-col">
			<div class="w-full items-center text-center">Perf</div>
			<select name="perf" bind:value={perf} class=" w-[80] variant-filled-primary">
				<option value={2}> +2 </option>
				<option value={0}> 0 </option>
				<option value={-2}> -2 </option>
			</select>
		</div>
		<div class="flex flex-col">
			<div class="w-full items-center text-center">xClass</div>
			<select name="xclass" bind:value={xclass} class=" w-[80] variant-filled-primary">
				<option value={4}> +4 </option>
				<option value={0}> 0 </option>
				<option value={-4}> -4 </option>
			</select>
		</div>
		<div class="flex flex-col">
			<div class="w-full items-center text-center">Total</div>
			<input
				bind:value={total}
				class="text-center variant-filled-primary w-[60]"
				type="text"
				disabled
			/>
		</div>
		<div class="flex flex-col ml-4">
			<div class="w-full items-center text-center">Remarques</div>
			<textarea
				name="comment"
				bind:value={comment}
				class="textarea variant-filled-primary w-[400px]"
				rows="2"
				autocomplete="off"
				placeholder="Enter some long form content."
			/>
		</div>
		<div class="flex flex-col ml-4 h-20">
			<div class="opacity-0">T</div>
			<button
				class=" rounded-xl icon-btn variant-filled-secondary w-16 h-full flex justify-center items-center"
			>
				<Gavel />
			</button>
		</div>
	</div>
</form>
