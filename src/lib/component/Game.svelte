<script lang="ts">
	import { format, intervalToDuration } from 'date-fns';
	import { scale, slide } from 'svelte/transition';
	import { quintIn, circIn, backIn } from 'svelte/easing';

	import type { Champion, Game, PlayerStat, Stat, User } from '@prisma/client';
	import { computeStat, getChampionName } from '$lib/utils';
	import _ from 'lodash';

	export let game: Game & {
		players: (PlayerStat & {
			champion: Champion;
			stat: Stat | null;
		})[];
	};

	export let mainUsers: User[];

	const duration = intervalToDuration({ start: 0, end: (game.duration || 0) * 1000 });
	const allyTeam = game.players.filter((player) => player.isAllyTeam);
	const enemyTeam = game.players.filter((player) => !player.isAllyTeam);
	const isWin = allyTeam[0].isWin;
</script>

<div
	class={`card hover:brightness-125 flex border-1 backdrop-blur ${
		isWin ? 'border-emerald-300' : 'border-rose-300'
	} ${isWin ? 'bg-emerald-300/30 dark:bg-green-500/20' : 'bg-rose-200/30 dark:bg-rose-500/20'}`}
>
	<div class="flex flex-col w-full p-4">
		<div class="flex justify-between text-xs  mb-4">
			<p>
				{`${duration.minutes}:${duration.seconds}`}
			</p>
			<p>
				{format(game.gameCreation || new Date(), 'dd/MM/yyyy')}
			</p>
		</div>
		<div class="flex flex-col sm:flex-row gap-6">
			<div class="sm:basis-1/2 flex flex-col gap-1">
				{#each allyTeam || [] as player}
					<div
						class={`flex text-xs gap-2 items-center justify-between  ${
							_.includes(
								mainUsers.map((p) => p.ign),
								player.sumName
							)
								? 'font-bold'
								: ''
						}`}
					>
						<div class="flex gap-2 items-center">
							<img
								class=" w-7"
								alt={player.champion.name}
								src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${getChampionName(
									player.champion.name
								)}.png`}
							/>
							<div>
								{player.sumName}
								{player.stat ? ` | ${computeStat(player.stat)}` : ''}
							</div>
						</div>
						<div>
							{player.kills} / {player.deaths} / {player.assists}
						</div>
					</div>
				{/each}
			</div>

			<div class=" sm:hidden">
				<hr class="my-3 w-full" />
			</div>
			<div class="sm:basis-1/2 w-full flex flex-col gap-1">
				{#each enemyTeam || [] as player}
					<div class="flex text-xs gap-2 items-center justify-between ">
						<div class="flex gap-2 items-center">
							<img
								class="w-7"
								alt={player.champion.name}
								src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${getChampionName(
									player.champion.name
								)}.png`}
							/>
							<div>
								{player.sumName}
							</div>
						</div>
						<div>
							{player.kills} / {player.deaths} / {player.assists}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
