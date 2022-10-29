<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import Card, { Content } from '@smui/card';
	import Autocomplete from '@smui-extra/autocomplete';
	import { GQL_AllUsers, QueryMode } from '$houdini';
	import { goto } from '$app/navigation';
	import type { Game } from '$type-graphql';
	export let game: Game;

	const allyTeam = game.players.filter((player) => player.isAllyTeam);
	const enemyTeam = game.players.filter((player) => !player.isAllyTeam);
	const isWin = allyTeam[0].isWin;
</script>

<Card class={`flex text-white ${isWin ? 'bg-indigo-900/50' : 'bg-rose-800/50'}`} padded>
	<div class="flex flex-col">
		<div class="flex justify-between text-xs  mb-4">
			<p>
				{game.duration}
			</p>
			<p>
				{game.gameCreation}
			</p>
		</div>
		<div class="flex">
			<div class="basis-1/2">
				{#each allyTeam || [] as player}
					<div class="flex text-xs">
						<div class="basis-8/12">
							{player.sumName}
						</div>
						<div>
							{player.kills} / {player.deaths} / {player.assists}
						</div>
					</div>
				{/each}
			</div>
			<div class="basis-1/2">
				{#each enemyTeam || [] as player}
					<div class="flex text-xs">
						<div class="basis-8/12">
							{player.sumName}
						</div>
						<div>
							{player.kills} / {player.deaths} / {player.assists}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div />
	</div>
</Card>
