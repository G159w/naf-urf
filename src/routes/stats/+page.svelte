<script lang="ts">
	import { scale } from 'svelte/transition';

	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { getChampionImage } from '$lib/utils';
	import Filters from '$lib/component/Filters.svelte';
	import SmallCardStats from '$lib/component/Stats/SmallCardStats.svelte';
	import SmallTableStats from '$lib/component/Stats/SmallTableStats.svelte';
	import { quintIn } from 'svelte/easing';
	import SmallTableOccurrence from '$lib/component/Stats/SmallTableOccurence.svelte';

	export let data: PageData;

</script>

<svelte:head>
	<title>URF | Stats</title>
	<meta name="URF Stats" content="NAF Stats" />
</svelte:head>
{#key data}
	<section class="container h-full mx-auto flex flex-col gap-8 w-full items-center">
		<img
			in:fade={{ delay: 100, easing: quintIn }}
			class={`z-[-1] h-2/3 w-full opacity-60 object-cover object-top absolute top-0 left-0 img`}
			alt={data.championMaxPlays[0].name}
			src={getChampionImage(data.championMaxPlays[0].name || '', 'splash')}
		/>

		<Filters periods={data.periods} users={data.users} />

		<div class="flex flex-row flex-wrap w-full align-top gap-4 ">
			<div class="flex flex-wrap  flex-row gap-4 " in:scale={{ delay: 200 }}>
				<SmallTableOccurrence
					champions={data.championMaxPlays}
					title={'Max Games'}
					subText={'Games'}
				/>
				<SmallTableOccurrence
					champions={data.championMaxWins}
					title={'Max Wins'}
					subText={'Wins'}
				/>
			</div>
			<div class="flex flex-wrap flex-row gap-4 h-fit max-w-lg	">
				<SmallCardStats>
					<span slot="title">Games</span>
					<span slot="stat">
						{data.totalGames}
					</span>
					<span slot="subStat">
						WR: {data.wr.toFixed(2)} %
					</span>
				</SmallCardStats>
				<SmallCardStats>
					<span slot="title">KDA</span>
					<span slot="stat">
						{(((data.avg.kills || 0) + (data.avg.assists || 0)) / (data.avg.deaths || 1)).toFixed(
							2
						)}
					</span>
					<span slot="subStat">
						{data.avg.kills?.toFixed(1)} / {data.avg.deaths?.toFixed(1)} / {data.avg.assists?.toFixed(
							1
						)}
					</span>
				</SmallCardStats>
				<SmallCardStats>
					<span slot="title">Dégâts</span>
					<span slot="stat">
						{data.avg.damage?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
					</span>
				</SmallCardStats>
				<SmallCardStats>
					<span slot="title">Gold</span>
					<span slot="stat">
						{data.avg.goldEarned?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
					</span>
				</SmallCardStats>
				<SmallCardStats>
					<span slot="title">Farm</span>
					<span slot="stat">
						{data.avg.totalCs?.toLocaleString(undefined, { maximumFractionDigits: 0 })} cs
					</span>
				</SmallCardStats>
			</div>
		</div>
		<div class="flex flex-wrap flex-row gap-4 w-full">
			<SmallCardStats>
				<span slot="title">Double kills</span>
				<span slot="stat">
					{data.sum.doubleKills}
				</span>
				<span slot="subStat">
					{((data.avg.doubleKills || 0) * 100).toFixed(2)} %
				</span>
			</SmallCardStats>
			<SmallCardStats>
				<span slot="title">Triple kills</span>
				<span slot="stat">
					{data.sum.tripleKills}
				</span>
				<span slot="subStat">
					{((data.avg.tripleKills || 0) * 100).toFixed(2)} %
				</span>
			</SmallCardStats>
			<SmallCardStats>
				<span slot="title">Quadrakill</span>
				<span slot="stat">
					{data.sum.quadraKills}
				</span>
				<span slot="subStat">
					{((data.avg.quadraKills || 0) * 100).toFixed(2)} %
				</span>
			</SmallCardStats>
			<SmallCardStats>
				<span slot="title">Pentakills</span>
				<span slot="stat">
					{data.sum.pentaKills}
				</span>
				<span slot="subStat">
					{((data.avg.pentaKills || 0) * 100).toFixed(2)} %
				</span>
			</SmallCardStats>
		</div>

		<div class="flex flex-wrap flex-row gap-4 w-full" in:scale={{ delay: 200 }}>
			<SmallTableStats title="Top Kills" playerStats={data.maxKillStats} statKey={'kills'} />
			<SmallTableStats title="Top Deaths" playerStats={data.maxDeathStats} statKey={'deaths'} />
			<SmallTableStats title="Top Dégâts" playerStats={data.maxDamageStats} statKey={'damage'}  />
			<SmallTableStats title="Top Farm" playerStats={data.maxFarmStats} statKey={'totalCs'} />
		</div>
	</section>
{/key}

<style>
	.img {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%);
	}
</style>
