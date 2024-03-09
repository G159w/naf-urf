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
				<SmallCardStats>
					<span slot="title">Tanked</span>
					<span slot="stat">
						{data.avg.tanked?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
			<SmallTableStats title="Top Kills" playerStats={data.maxKillsStats} statKey={'kills'} />
			<SmallTableStats title="Top Deaths" playerStats={data.maxDeathsStats} statKey={'deaths'} />
			<SmallTableStats title="Top Assists" playerStats={data.maxAssistsStats} statKey={'assists'} />
			<SmallTableStats title="Top Dégâts" playerStats={data.maxDamageStats} statKey={'damage'}  />
			<SmallTableStats title="Top Farm" playerStats={data.maxFarmStats} statKey={'totalMinionsKilled'} />
			<SmallTableStats title="Top Tanked" playerStats={data.maxReceivedStats} statKey={'totalTanked'} />
			<SmallTableStats title="Top CC Time" playerStats={data.maxCCingStats} statKey={'timeCCingOthers'} />
			<SmallTableStats title="Top Gold" playerStats={data.maxGoldEarnedStats} statKey={'goldEarned'} />
			<SmallTableStats title="Top Dead Time" playerStats={data.maxDeadTimeStats} statKey={'totalTimeSpentDead'} />
			<SmallTableStats title="Top Crit Strike" playerStats={data.maxCritStrikeStats} statKey={'largestCriticalStrike'} />
			<SmallTableStats title="Top Killing Spree" playerStats={data.maxKillingSpreeStats} statKey={'largestKillingSpree'} />
			<SmallTableStats title="Top Time Alive" playerStats={data.maxTimeLivingStats} statKey={'longestTimeSpentLiving'} />
			<SmallTableStats title="Top Q Casts" playerStats={data.maxSpell1CastsStats} statKey={'spell1Casts'} />
			<SmallTableStats title="Top Z Casts" playerStats={data.maxSpell2CastsStats} statKey={'spell2Casts'} />
			<SmallTableStats title="Top E Casts" playerStats={data.maxSpell3CastsStats} statKey={'spell3Casts'} />
			<SmallTableStats title="Top R Casts" playerStats={data.maxSpell4CastsStats} statKey={'spell4Casts'} />
			<SmallTableStats title="Top D Casts" playerStats={data.maxSumm1CastsStats} statKey={'summoner1Casts'} />
			<SmallTableStats title="Top F Casts" playerStats={data.maxSumm2CastsStats} statKey={'summoner2Casts'} />
			<SmallTableStats title="Top Heal" playerStats={data.maxHealStats} statKey={'totalHeal'} />
			<SmallTableStats title="Top Heal on Team" playerStats={data.maxHealTeammatesStats} statKey={'totalHealsOnTeammates'} />
			<SmallTableStats title="Top Shield on Team" playerStats={data.maxShieldTeammatesStats} statKey={'totalDamageShieldedOnTeammates'} />
			<SmallTableStats title="Top Damage/Minute" playerStats={data.maxDamagePerMinuteStats} statKey={'dmgPerMinute'} />
			<SmallTableStats title="Top Tanked/Minute" playerStats={data.maxTankedPerMinuteStats} statKey={'tankedPerMinute'} />
			<SmallTableStats title="Top Gold/Minute" playerStats={data.maxGoldPerMinuteStats} statKey={'goldPerMinute'} />
			<SmallTableStats title="Top Damage/Gold" playerStats={data.maxDamagePerGoldStats} statKey={'dmgPerGold'} />
		</div>
	</section>
{/key}

<style>
	.img {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%);
	}
</style>
