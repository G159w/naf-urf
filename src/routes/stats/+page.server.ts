import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { PlatformId } from '@fightmegg/riot-api';
import type { Prisma } from '@prisma/client';
const { prisma, riotApi } = await createContext();

export const load = (async ({ url }) => {
	const userId = +(url.searchParams.get('user') || 0);
	const periodId = +(url.searchParams.get('period') || 0) || undefined;

	const userWhereInput = userId
		? {
				id: { equals: userId }
		  }
		: {
				isNot: null
		  };

	const avg = await prisma.playerStat.aggregate({
		where: { 
			user: {
				isNot: null
			},
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

	const maxKillStats = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: { user: true, champion: true },
		orderBy: [{ kills: 'desc' }],
		take: 5
	});

	const maxDeathStats = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: { user: true, champion: true },
		orderBy: [{ deaths: 'desc' }],
		take: 5
	});

	const maxDamageStats = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: { user: true, champion: true },
		orderBy: [{ damage: 'desc' }],
		take: 5
	});

	const maxFarmStats = await prisma.playerStat.findMany({
		where: {
			user: userWhereInput,
			game: { periodId }
		},
		include: { user: true, champion: true },
		orderBy: [{ totalCs: 'desc' }],
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
		maxDeathStats,
		maxDamageStats,
		maxFarmStats,
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
