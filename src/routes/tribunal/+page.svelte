<script lang="ts">
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import CreateUser from '$lib/component/CreateUser.svelte';
	import { Coins } from 'lucide-svelte';
	import { Cowled } from 'svelte-game-icons';
	import { getChampionName } from '$lib/utils';
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
	<div class="flex w-2/3 mt-8">
		<div
			class={`basis-1/2 flex flex-col 
			${isWin ? 'border-green-600' : 'border-red-600'}
			border-4	rounded-lg border-r-0 rounded-r-none`}
		>
			{#each allyTeam || [] as player}
				<div class="w-full relative h-28  text-black flex flex-col justify-between">
					<div class="p-2 flex flex-row content-evenly justify-between h-full">
						<img
							class="h-28 w-full opacity-40 object-cover object-top absolute top-0 left-0 z-[-1] font-roboto "
							alt={player.champion?.name}
							src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${getChampionName(
								player.champion?.name || ''
							)}_0.jpg`}
						/>
						<div class=" flex flex-col ">
							<span class="text-xl font-semibold">
								{player.sumName}
							</span>
							<span class="text-lg">
								{player.kills} / {player.deaths} / {player.assists} ({(
									(player.kills + player.assists) /
									(player.deaths || 0)
								).toFixed(1)})
							</span>
						</div>
						<div class=" flex flex-col h-full justify-center font-semibold gap-2 pr-4">
							<span class="flex flex-row gap-2 align-middle text-md text-right">
								<Coins />
								{(player.goldEarned / 1000).toFixed(1).replace('.', ',')} k
							</span>
							<span class="flex flex-row gap-2 align-middle text-md text-right">
								<Cowled strokeWidth="4px" style={'width: 22px'} bg="rgba(0,0,0,0)" />
								{player.totalMinionsKilled + player.neutralMinionsKilled} cs
							</span>
						</div>
					</div>
					<div
						class="h-4 bg-blue-200 absolute bottom-0 left-0 opacity-90 shadow-inner rounded-tr-md font-semibold text-xs text-right pr-4"
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
			border-4 rounded-lg border-l-0 rounded-l-none`}
		>
			{#each enemyTeam || [] as player}
				<div class="w-full relative h-28 text-black flex flex-col justify-between items-end">
					<div class="p-2 flex flex-row content-evenly justify-between h-full w-full">
						<img
							class="h-28 w-full opacity-40 object-cover object-top absolute top-0 left-0 z-[-1]"
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
								<Cowled strokeWidth="4px" style={'width: 22px'} bg="rgba(0,0,0,0)" />
							</span>
						</div>
						<div class=" flex flex-col items-end">
							<span class="text-xl font-semibold">
								{player.sumName}
							</span>
							<span class="text-lg">
								{player.kills} / {player.deaths} / {player.assists} ({(
									(player.kills + player.assists) /
									(player.deaths || 0)
								).toFixed(1)})
							</span>
						</div>
					</div>
					<div
						class="h-4 bg-blue-200 absolute bottom-0 right-0 opacity-90 shadow-inner	 rounded-tl-md font-semibold  text-xs  pl-4"
						style={`width: ${(player.damage / maxDamage) * 95}%`}
					>
						{player.damage.toLocaleString()}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>