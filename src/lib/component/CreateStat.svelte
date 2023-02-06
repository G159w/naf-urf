<script lang="ts">
	import type { Champion, ChampionStat, Game, PlayerStat, User } from '@prisma/client';
	import { applyAction, enhance } from '$app/forms';

	import _ from 'lodash';
	import { Gavel } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { quintIn } from 'svelte/easing';

	type Stat = PlayerStat & {
		user: User | null;
		champion: Champion & {
			stats: ChampionStat[];
		};
		game: Game & {
			players: (PlayerStat & {
				user: User | null;
				champion: Champion & {
					stats: ChampionStat[];
				};
			})[];
		};
	};

	export let playerStat: Stat;
	export let winRate: number;

	const computeDmg = (stat: Stat) => {
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

	const computeFirstLast = (stat: Stat) => {
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

	const computeKda = (stat: Stat) => {
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

	const computePerf = (stat: Stat) => {
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

	const computeXClass = (stat: Stat) => {
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

	let bonusDamage: number = computeDmg(playerStat);
	let firstLastDamage: number = computeFirstLast(playerStat);
	let kda: number = computeKda(playerStat);
	let perf = computePerf(playerStat);
	if (perf > 0 && firstLastDamage < 0) {
		perf = 0;
	} else if (perf < 0 && firstLastDamage > 0) {
		perf = 0;
	}
	let xclass = computeXClass(playerStat);
	$: total = bonusDamage + kda + perf + xclass;
</script>

<form
	in:slide={{ delay: 200, duration: 400, easing: quintIn }}
	method="POST"
	action="/tribunal?/createStat"
	use:enhance={({ data }) => {
		data.append('playerStatId', `${playerStat.id}`);
		return async ({ result }) => {
			await applyAction(result);
		};
	}}
>
	<div class="flex mt-2">
		<select
			bind:value={bonusDamage}
			name="bonusDamage"
			class=" w-60"
			style="width: 80px; border-radius: 0"
		>
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
			<option value={-3}> -3 </option>
			<option value={-5}> -5 </option>
		</select>
		<select
			name="kda"
			bind:value={kda}
			class=" w-60 rounded-none"
			style="width: 80px; border-radius: 0"
		>
			<option value={3}> +3 </option>
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
		</select>
		<select
			name="perf"
			bind:value={perf}
			class=" w-60 rounded-none"
			style="width: 80px; border-radius: 0"
		>
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
		</select>
		<select
			name="xclass"
			bind:value={xclass}
			class=" w-60 rounded-none"
			style="width: 80px; border-radius: 0"
		>
			<option value={4}> 4 </option>
			<option value={0}> 0 </option>
			<option value={-4}> -4 </option>
		</select>
		<input
			name="comment"
			style="width: 200px; border-radius: 0"
			placeholder="Remarques"
			type="text"
			minlength="2"
		/>
		<input
			bind:value={total}
			name="comment"
			class=" text-center"
			style="width: 60px; border-radius: 0"
			type="text"
			disabled
			minlength="2"
		/>
		<button
			class="icon-btn btn-filled-primary p-0 rounded-none w-12 flex justify-center items-center"
		>
			<Gavel />
		</button>
	</div>
</form>
