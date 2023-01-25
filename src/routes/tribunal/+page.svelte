<script lang="ts">
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import CreateUser from '$lib/component/CreateUser.svelte';
	import { Coins, Gavel } from 'lucide-svelte';
	import { Cowled, CrossedSwords } from 'svelte-game-icons';
	import { championMapDbToDisplay, getChampionName } from '$lib/utils';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Game from '$lib/component/Game.svelte';
	import { format } from 'date-fns';
	import _ from 'lodash';

	export let data: PageData;

	const allyTeam = data.stat.game.players.filter((player) => player.isAllyTeam);
	const enemyTeam = data.stat.game.players.filter((player) => !player.isAllyTeam);
	const maxDamage = _.maxBy(data.stat.game.players, 'damage')?.damage || 0;
	const isWin = allyTeam[0].isWin;

	let damageBonus: number = 0;
</script>

<svelte:head>
	<title>URF | Tribunal</title>
	<meta name="URF Tribunal" content="NAF Tribunal" />
</svelte:head>

<section
	class="container h-full mx-auto flex flex-col gap-8 w-full items-center"
	in:fade={{ duration: 200 }}
>
	<h1 class="font-bold">Tribunal</h1>

	<hr class="w-full" />
	<hr />
	<div class="w-full flex flex-row justify-between items-center">
		<h3>
			Affaire n°{data.stat.id}:
			<br />
			<span class="font-bold">Mr. {data.stat.user?.ign}</span>
		</h3>
		<h4>
			Faits ayant eu lieu le: <span class="font-bold"
				>{format(data.stat.game.gameCreation || new Date(), 'dd/MM/yyyy')}</span
			>
		</h4>
	</div>
	<div class="flex w-2/3 mt-8 bg-slate-900 z-[1] rounded-lg text-white drop-shadow-2xl">
		<div
			class={`basis-1/2 flex flex-col 
			${isWin ? 'border-green-600' : 'border-red-600'}
				rounded-lg border-r-0 rounded-r-none`}
		>
			{#each allyTeam || [] as player, index}
				<div class="w-full relative h-28  flex flex-col justify-between">
					<div class="p-2 flex flex-row content-evenly justify-between h-full">
						<img
							class={`h-28 w-full opacity-60 object-cover object-top absolute top-0 left-0 z-[-1] font-roboto
								${index === 0 ? 'rounded-tl-lg' : ''}
								${index === 4 ? 'rounded-bl-lg' : ''}
							`}
							alt={player.champion?.name}
							src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${getChampionName(
								player.champion?.name || ''
							)}_0.jpg`}
						/>
						<div class=" flex flex-col gap-1 ">
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
							<span class="text-xs flex flex-row gap-2 align-middle">
								{championMapDbToDisplay[player.champion.name]} - {player.champion.stats[0].winrate} %
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
			{#each enemyTeam || [] as player, index}
				<div class="w-full relative h-28 flex flex-col justify-between items-end">
					<div class="p-2 flex flex-row content-evenly justify-between h-full w-full">
						<img
							class={`h-28 w-full opacity-60 object-cover object-top absolute top-0 left-0 z-[-1]
								${index === 0 ? 'rounded-tr-lg' : ''}
								${index === 4 ? 'rounded-br-lg' : ''}
							`}
							alt={player.champion?.name}
							src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${getChampionName(
								player.champion?.name || ''
							)}_0.jpg`}
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

	<div class="flex mt-2">
		<select bind:value={damageBonus} class=" w-60" style="width: 80px; border-radius: 0">
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
			<option value={-3}> -3 </option>
			<option value={-5}> -5 </option>
		</select>
		<select
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
		<select
			bind:value={damageBonus}
			class=" w-60 rounded-none"
			style="width: 80px; border-radius: 0"
		>
			<option value={2}> +2 </option>
			<option value={0}> 0 </option>
			<option value={-2}> -2 </option>
		</select>
		<select
			bind:value={damageBonus}
			class=" w-60 rounded-none"
			style="width: 80px; border-radius: 0"
		>
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
</section>
