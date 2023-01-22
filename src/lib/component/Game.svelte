<script lang="ts">
	import { format, intervalToDuration } from 'date-fns';
	import type { Champion, Game, PlayerStat, User } from '@prisma/client';
	import { getChampionName } from '$lib/utils';
	import _ from 'lodash';

	export let game: Game & {
		players: (PlayerStat & {
			champion: Champion;
		})[];
	};

	export let mainUsers: User[];

	const duration = intervalToDuration({ start: 0, end: (game.duration || 0) * 1000 });
	const allyTeam = game.players.filter((player) => player.isAllyTeam);
	const enemyTeam = game.players.filter((player) => !player.isAllyTeam);
	const isWin = allyTeam[0].isWin;
</script>

<div
	class={`card flex border-2	 ${isWin ? 'border-emerald-300' : 'border-rose-300'} ${
		isWin ? 'bg-emerald-200/30' : 'bg-rose-200/30'
	}`}
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
		<div class="flex">
			<div class="basis-1/2 flex flex-col gap-1">
				{#each allyTeam || [] as player}
					<div
						class={`flex text-xs gap-1 items-center  ${
							_.includes(
								mainUsers.map((p) => p.ign),
								player.sumName
							)
								? 'font-bold'
								: ''
						}`}
					>
						<img
							class="basis-1/12 w-4"
							alt={player.champion.name}
							src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${getChampionName(
								player.champion.name
							)}.png`}
						/>
						<div class="basis-7/12">
							{player.sumName}
						</div>
						<div>
							{player.kills} / {player.deaths} / {player.assists}
						</div>
					</div>
				{/each}
			</div>
			<div class="basis-1/2 flex flex-col gap-1">
				{#each enemyTeam || [] as player}
					<div class="flex text-xs gap-1 items-center">
						<img
							class="basis-1/12 w-4"
							alt={player.champion.name}
							src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${getChampionName(
								player.champion.name
							)}.png`}
						/>
						<div class="basis-7/12">
							{player.sumName}
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
