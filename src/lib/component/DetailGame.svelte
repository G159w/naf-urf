<script lang="ts">
	import { format, intervalToDuration } from 'date-fns';
	import { scale, slide } from 'svelte/transition';
	import { quintIn, circIn, backIn } from 'svelte/easing';
	import { Cowled, CrossedSwords } from 'svelte-game-icons';
	import { Coins } from 'lucide-svelte';

	import type { Champion, ChampionStat, Game, Item, PlayerStat, Stat, User } from '@prisma/client';
	import { computeStat, getChampionName, type GameCreateStat } from '$lib/utils';
	import _ from 'lodash';
	import CreateStat from './CreateStat.svelte';

	export let game: Game & {
		players: (PlayerStat & {
			user: User | null;
			champion: Champion & {
				stats: ChampionStat[];
			};
			stat: Stat | null;
			items: Item[];
		})[];
	};

	export let mainUsers: User[];

	$: duration = intervalToDuration({ start: 0, end: (game.duration || 0) * 1000 });
	$: allyTeam = game.players.filter((player) => player.isAllyTeam);
	$: enemyTeam = game.players.filter((player) => !player.isAllyTeam);
	$: maxDamage = _.maxBy(game.players, 'damage')?.damage || 0;
	$: isWin = allyTeam[0].isWin;
	let playerStat: GameCreateStat | undefined;
</script>

<div
	in:scale={{ duration: 200 }}
	class={`card  flex border-1 backdrop-blur ${isWin ? 'border-emerald-300' : 'border-rose-300'} ${
		isWin ? 'bg-emerald-300/30 dark:bg-green-500/20' : 'bg-rose-200/30 dark:bg-rose-500/20'
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
		<div class="flex flex-col sm:flex-row gap-6">
			<div class="sm:basis-1/2 flex flex-col gap-2">
				{#each allyTeam || [] as player}
					<button
						on:click={() => {
							if (player.userId) {
								playerStat = {
									...player,
									game: game
								};
							}
						}}
						class={`flex text-xs gap-2 items-center justify-between rounded-md pr-2
							${!!player.userId ? 'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20' : ''}
							${playerStat?.userId === player.userId ? 'bg-black/30 dark:bg-white/30' : ''}

						`}
					>
						<div class="flex gap-2 items-center h-full relative">
							<img
								class="w-16 img"
								alt={player.champion.name}
								src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${getChampionName(
									player.champion.name
								)}.png`}
							/>
							<div class="w-16 absolute left-0 bottom-0 text-center font-bold">
								{_.find(player.champion.stats, (x) => x.periodId === game.periodId)?.winrate || 0}%
							</div>
							<div class="flex flex-row content-between h-full justify-start flex-wrap w-52">
								<div class=" text-left w-full text-base leading-none ">
									{player.sumName}
								</div>
								<div class="w-full text-left pl-2 bg-gray-900/30 rounded-sm  relative">
									<div
										class="absolute top-0 left-0 z-[-1] bg-blue-600 rounded-sm h-full"
										style={`width: ${(player.damage / maxDamage) * 100}%`}
									/>
									{player.damage.toLocaleString()}
								</div>
								<div class="flex flex-row">
									{#each player.items || [] as item}
										{#if item.itemId}
											<img
												class="w-6"
												alt={item.itemId.toString()}
												src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${item.itemId}.png`}
											/>
										{/if}
									{/each}
								</div>
							</div>
						</div>
						<div>
							{player.stat ? ` ${computeStat(player.stat)}` : ''}
						</div>
						<div class="w-18">
							<span class="flex flex-row gap-2 items-center text-md text-right justify-end">
								<div class=" leading-none h-fit">
									{player.kills} / {player.deaths} / {player.assists}
								</div>
								<CrossedSwords
									strokeColor="#fff"
									strokeWidth="4px"
									fg="#fff"
									style={'width: 15'}
									bg="rgba(0,0,0,0)"
								/>
							</span>
							<span class="flex flex-row gap-2 items-center text-md text-right justify-end">
								<div class=" leading-none h-fit">
									{(player.goldEarned / 1000).toFixed(1).replace('.', ',')} k
								</div>
								<Coins class="w-4" />
							</span>
							<span class="flex flex-row gap-2 align-middle text-md text-right justify-end">
								{player.totalCs} cs
								<Cowled
									strokeColor="#fff"
									strokeWidth="4px"
									fg="#fff"
									style={'width: 15px'}
									bg="rgba(0,0,0,0)"
								/>
							</span>
						</div>
					</button>
				{/each}
			</div>

			<div class=" sm:hidden">
				<hr class="my-3 w-full" />
			</div>
			<div class="sm:basis-1/2 w-full flex flex-col gap-2">
				{#each enemyTeam || [] as player}
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
						<div class="flex gap-2 items-center h-full ">
							<img
								class="w-16"
								alt={player.champion.name}
								src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${getChampionName(
									player.champion.name
								)}.png`}
							/>
							<div class="flex flex-row content-between h-full justify-start flex-wrap w-52">
								<div class=" text-left w-full text-base leading-none ">
									{player.sumName}
								</div>
								<div class="w-full text-left pl-2 bg-gray-900/30 rounded-sm relative">
									<div
										class="absolute top-0 left-0 z-[-1] bg-blue-500 rounded-sm h-full"
										style={`width: ${(player.damage / maxDamage) * 100}%`}
									/>
									{player.damage.toLocaleString()}
								</div>
								<div class="flex flex-row">
									{#each player.items || [] as item}
										{#if item.itemId}
											<img
												class="w-6"
												alt={item.itemId.toString()}
												src={`http://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${item.itemId}.png`}
											/>
										{/if}
									{/each}
								</div>
							</div>
						</div>
						<div>
							{player.stat ? ` ${computeStat(player.stat)}` : ''}
						</div>
						<div class="w-18">
							<span class="flex flex-row gap-2 items-center text-md text-right justify-end">
								<div class=" leading-none h-fit">
									{player.kills} / {player.deaths} / {player.assists}
								</div>
								<CrossedSwords
									strokeColor="#fff"
									strokeWidth="4px"
									fg="#fff"
									style={'width: 15'}
									bg="rgba(0,0,0,0)"
								/>
							</span>
							<span class="flex flex-row gap-2 items-center text-md text-right justify-end">
								<div class=" leading-none h-fit">
									{(player.goldEarned / 1000).toFixed(1).replace('.', ',')} k
								</div>
								<Coins class="w-4" />
							</span>
							<span class="flex flex-row gap-2 align-middle text-md text-right justify-end">
								{player.totalCs} cs
								<Cowled
									strokeColor="#fff"
									strokeWidth="4px"
									fg="#fff"
									style={'width: 15px'}
									bg="rgba(0,0,0,0)"
								/>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
		{#if playerStat}
			<div transition:slide={{ duration: 300 }} class=" self-center w-fit p-2">
				{#key playerStat.id}
					<CreateStat {playerStat} callback={(playerStat = undefined)} />
				{/key}
			</div>
		{/if}
	</div>
</div>

<style>
	.img {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%);
	}
</style>
