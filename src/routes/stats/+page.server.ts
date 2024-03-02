import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { PlatformId } from '@fightmegg/riot-api';
import type { Prisma, Stat } from '@prisma/client';
import type { MaxStat } from '$lib/type';
const { prisma, riotApi } = await createContext();

type UserWhereInput =
	| (Prisma.Without<Prisma.UserNullableRelationFilter, Prisma.UserWhereInput> &
			Prisma.UserWhereInput)
	| (Prisma.Without<Prisma.UserWhereInput, Prisma.UserNullableRelationFilter> &
			Prisma.UserNullableRelationFilter);


export const load = (async ({ url }) => {
	const userId = +(url.searchParams.get('user') || 0);
	const periodId = +(url.searchParams.get('period') || 0) || undefined;

	const userWhereInput: UserWhereInput = userId
		? {
				id: { equals: userId }
			}
		: {
				isNot: null
			};

	const avg = await prisma.playerStat.aggregate({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		_avg: {
			kills: true,
			deaths: true,
			assists: true,
			damage: true,
			goldEarned: true,
			totalMinionsKilled: true,
			neutralMinionsKilled: true,
			totalCs: true,
			tanked: true,
			mitigated: true,
			doubleKills: true,
			tripleKills: true,
			quadraKills: true,
			pentaKills: true
		},
		_sum: {
			doubleKills: true,
			tripleKills: true,
			quadraKills: true,
			pentaKills: true
		}
	});

	const gamesWon = await prisma.game.count({
		where: {
			periodId,
			players: {
				some: {
					isWin: {
						equals: true
					},
					user: userWhereInput
				}
			}
		}
	});

	const totalGames = await prisma.game.count({
		where: {
			periodId,
			players: {
				some: {
					user: userWhereInput
				}
			}
		}
	});

	const maxPlaysChampions = await prisma.playerStat.groupBy({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		by: ['championId'],
		_count: {
			championId: true
		},
		orderBy: [
			{
				_count: {
					championId: 'desc'
				}
			}
		],
		take: 5
	});

	const championMaxPlaysQuery = await prisma.champion.findMany({
		where: { id: { in: maxPlaysChampions.map((x) => x.championId) } }
	});

	const championMaxPlays = maxPlaysChampions.map((x) => ({
		occurrence: x._count.championId,
		...championMaxPlaysQuery.find((y) => x.championId === y.id)
	}));

	const maxWonOccurrenceChampion = await prisma.playerStat.groupBy({
		where: {
			user: userWhereInput,
			isWin: true,
			game: { periodId }
		},
		by: ['championId'],
		_count: {
			championId: true
		},
		orderBy: [
			{
				_count: {
					championId: 'desc'
				}
			}
		],
		take: 5
	});

	const championMaxWinsQuery = await prisma.champion.findMany({
		where: { id: { in: maxWonOccurrenceChampion.map((x) => x.championId) } }
	});

	const championMaxWins = maxWonOccurrenceChampion.map((x) => ({
		occurrence: x._count.championId,
		...championMaxWinsQuery.find((y) => x.championId === y.id)
	}));

	const maxKillStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ kills: 'desc' }],
		take: 5
	});

	const maxTankedStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ tanked: 'desc' }],
		take: 5
	});

	const maxMitigatedStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ mitigated: 'desc' }],
		take: 5
	});

	const maxDeathStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ deaths: 'desc' }],
		take: 5
	});

	const maxDamageStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ damage: 'desc' }],
		take: 5
	});

	const maxFarmStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ totalCs: 'desc' }],
		take: 5
	});

	const maxCCingStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ timeCCingOthers: 'desc' }],
		take: 5
	});

	const maxGoldEarnedStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ goldEarned: 'desc' }],
		take: 5
	});

	const maxDeadTimeStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ totalTimeSpentDead: 'desc' }],
		take: 5
	});

	const maxCritStrikeStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ largestCriticalStrike: 'desc' }],
		take: 5
	});

	const maxKillingSpreeStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ largestKillingSpree: 'desc' }],
		take: 5
	});

	const maxTimeLivingStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ longestTimeSpentLiving: 'desc' }],
		take: 5
	});

	const maxSpell1CastsStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ spell1Casts: 'desc' }],
		take: 5
	});

	const maxSpell2CastsStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ spell2Casts: 'desc' }],
		take: 5
	});

	const maxSpell3CastsStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ spell3Casts: 'desc' }],
		take: 5
	});

	const maxSpell4CastsStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ spell4Casts: 'desc' }],
		take: 5
	});

	const maxSumm1CastsStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ summoner1Casts: 'desc' }],
		take: 5
	});

	const maxSumm2CastsStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ summoner2Casts: 'desc' }],
		take: 5
	});

	const maxHealStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ totalHeal: 'desc' }],
		take: 5
	})

	const maxHealTeammatesStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ totalHealsOnTeammates: 'desc' }],
		take: 5
	});

	const maxShieldTeammatesStats: MaxStat[] = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: {
			user: true,
			champion: true,
			stat: true,
			game: { include: { players: { include: { champion: true } } } }
		},
		orderBy: [{ totalDamageShieldedOnTeammates: 'desc' }],
		take: 5
	});

	return {
		periods: await prisma.period.findMany({ orderBy: [{ date: 'desc' }] }),
		totalGames: totalGames,
		avg: avg._avg,
		sum: avg._sum,
		championMaxPlays,
		championMaxWins,
		maxKillStats,
		maxTankedStats,
		maxMitigatedStats,
		maxDeathStats,
		maxDamageStats,
		maxFarmStats,
		maxCCingStats,
		maxGoldEarnedStats,
		maxDeadTimeStats,
		maxCritStrikeStats,
		maxKillingSpreeStats,
		maxTimeLivingStats,
		maxSpell1CastsStats,
		maxSpell2CastsStats,
		maxSpell3CastsStats,
		maxSpell4CastsStats,
		maxSumm1CastsStats,
		maxSumm2CastsStats,
		maxHealStats,
		maxHealTeammatesStats,
		maxShieldTeammatesStats,
		wr: (gamesWon / totalGames) * 100
	};
}) satisfies PageServerLoad;

const registerSchema = z.object({
	name: z.string().min(1).max(64).trim(),
	ign: z.string().min(1).max(64).trim()
});

export const actions: Actions = {
	createUser: async ({ request }) => {
		const formaData = Object.fromEntries(await request.formData());
		try {
			const { name, ign } = registerSchema.parse(formaData);
			const summoner = await riotApi.summoner.getBySummonerName({
				region: PlatformId.EUW1,
				summonerName: ign
			});
			await prisma.user.create({
				data: {
					name,
					ign,
					lolId: summoner.puuid
				}
			});
			return { success: true };
		} catch (err) {
			console.log(err);
			return { success: false };
		}
	}
};
