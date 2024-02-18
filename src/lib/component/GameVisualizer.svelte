<script lang="ts">
	import { scale, slide } from 'svelte/transition';
	import { Cowled, CrossedSwords } from 'svelte-game-icons';
	import { Coins } from 'lucide-svelte';
	import {
		championMapDbToDisplay,
		computeStat,
		getChampionDragonName,
		getChampionImage
	} from '$lib/utils';
	import _ from 'lodash';
	import type { CompletePStat as CompleteStat } from '$lib/type';

	export let stat: CompleteStat;
	export let color: string;

	$: allyTeam = stat.playerStat.game.players.filter((player) => player.isAllyTeam) || [];
	$: enemyTeam = stat.playerStat.game.players.filter((player) => !player.isAllyTeam) || [];
	$: maxDamage = _.maxBy(stat.playerStat.game.players, 'damage')?.damage || 0;
	$: isWin = allyTeam[0].isWin;
</script>

<div class="flex flex-col gap-4 max-w-2/3 w-[70rem]">
	<div
		class="flex bg-black z-[1] rounded-lg text-white drop-shadow-2xl"
		in:scale={{ delay: 150, duration: 500 }}
	>
		<div
			class={`basis-1/2 flex flex-col 
${isWin ? 'border-green-600' : 'border-red-600'}
	rounded-lg border-r-0 rounded-r-none`}
		>
			{#each allyTeam as player, index}
				<div
					class={`w-full relative h-28  flex flex-col justify-between ${
						player.userId === stat.playerStat?.userId ? 'inner-border' : ''
					}`}
				>
					<div class="p-2 flex flex-row content-evenly justify-between h-full">
						<img
							class={`h-28 w-full opacity-50 object-cover object-top absolute top-0 left-0 z-[-1] font-roboto
					${index === 0 ? 'rounded-tl-lg' : ''}
					${index === 4 ? 'rounded-bl-lg' : ''}
				`}
							alt={player.champion?.name}
							src={getChampionImage(player.champion?.name || '', 'splash')}
						/>
						<div class=" flex flex-col gap-1">
							<span class="text-xl font-semibold">
								{player.sumName}
							</span>
							<span class="text-lg flex flex-row gap-2 align-middle">
								<CrossedSwords
									strokeWidth="4px"
									fg="#fff"
									style={'width: 20px'}
									bg="rgba(0,0,0,0)"
								/>

								{player.kills} / {player.deaths} / {player.assists} ({(
									(player.kills + player.assists) /
									(player.deaths || 0)
								).toFixed(1)})
							</span>
							<span class="text-xs flex flex-row gap-2 align-middle font-semibold">
								{championMapDbToDisplay[player.champion.name]}
							</span>
						</div>
						<div class=" flex flex-col h-full justify-center font-semibold gap-2 pr-4">
							<span class="flex flex-row gap-2 align-middle text-md text-right">
								<Coins />
								{(player.goldEarned / 1000).toFixed(1).replace('.', ',')} k
							</span>
							<span class="flex flex-row gap-2 align-middle text-md text-right">
								<Cowled strokeWidth="4px" fg="#fff" style={'width: 22px'} bg="rgba(0,0,0,0)" />
								{player.totalMinionsKilled + player.neutralMinionsKilled} cs
							</span>
						</div>
					</div>
					<div
						class={`h-4  
			${
				isWin ? 'bg-green-700' : ' bg-red-700'
			} absolute bottom-0 left-0 opacity-90 shadow-inner rounded-tr-md font-semibold text-xs text-right pr-4
				${index === 4 ? 'rounded-bl-lg' : ''}
			`}
						style={`width: ${(player.damage / maxDamage) * 95}%`}
					>
						{player.damage.toLocaleString()}
					</div>
				</div>
			{/each}
		</div>
		<div
			class={`basis-1/2 flex flex-col
 ${isWin ? 'border-red-600' : 'border-green-600'}
border-6 rounded-lg border-l-0 rounded-l-none`}
		>
			{#each enemyTeam as player, index}
				<div class="w-full relative h-28 flex flex-col justify-between items-end">
					<div class="p-2 flex flex-row content-evenly justify-between h-full w-full">
						<img
							class={`h-28 w-full opacity-50 object-cover object-top absolute top-0 left-0 z-[-1]
					${index === 0 ? 'rounded-tr-lg' : ''}
					${index === 4 ? 'rounded-br-lg' : ''}
				`}
							alt={player.champion?.name}
							src={getChampionImage(player.champion?.name || '', 'splash')}
						/>
						<div class=" flex flex-col h-full justify-center font-semibold gap-2 pl-4">
							<span class="flex flex-row gap-2 align-middle text-md text-right">
								{(player.goldEarned / 1000).toFixed(1).replace('.', ',')} k
								<Coins />
							</span>
							<span class="flex flex-row gap-2 align-middle text-md text-right">
								{player.totalMinionsKilled + player.neutralMinionsKilled} cs
								<Cowled strokeWidth="4px" fg="#fff" style={'width: 22px'} bg="rgba(0,0,0,0)" />
							</span>
						</div>
						<div class=" flex flex-col items-end gap-1">
							<span class="text-xl font-semibold">
								{player.sumName}
							</span>
							<span class="text-lg flex flex-row gap-2 align-middle">
								{player.kills} / {player.deaths} / {player.assists} ({(
									(player.kills + player.assists) /
									(player.deaths || 0)
								).toFixed(1)})
								<CrossedSwords
									strokeWidth="4px"
									fg="#fff"
									style={'width: 20px'}
									bg="rgba(0,0,0,0)"
								/>
							</span>
							<span class="text-xs flex flex-row gap-2 align-middle font-semibold">
								{championMapDbToDisplay[player.champion.name]}
							</span>
						</div>
					</div>
					<div
						class={`h-4 ${
							isWin ? 'bg-red-700' : ' bg-green-700'
						} absolute bottom-0 right-0  shadow-inner	 rounded-tl-md font-semibold  text-xs  pl-4 
					${index === 4 ? 'rounded-br-lg' : ''}
			`}
						style={`width: ${(player.damage / maxDamage) * 95}%`}
					>
						{player.damage.toLocaleString()}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex flex-row w-full gap-4">
		<div
			class={`flex justify-center items-center text-2xl p-8 rounded-lg ${color ?? 'bg-surface-700'} bg-opacity-50 font-bold`}
		>
			{computeStat(stat)}
		</div>
		<div class="rounded-lg p-4 bg-surface-700 bg-opacity-50 flex flex-col gap-2 w-full">
			<div class="font-bold">Appréciation du juge:</div>
			<div class=" text-lg">
				{#if !!stat.comment}
					{stat.comment}
				{:else}
					Rien à signaler
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.img {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%);
	}

	.inner-border {
		-webkit-box-shadow: inset 0px 0px 0px 10px #f00;
		-moz-box-shadow: inset 0px 0px 0px 10px #f00;
		box-shadow: inset 0px 0px 10px 4px #fff;
	}
</style>
