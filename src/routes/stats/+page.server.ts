import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { PlatformId } from '@fightmegg/riot-api';
import type { Prisma } from '@prisma/client';
const { prisma, riotApi } = await createContext();

type UserWhereInput =
	| (Prisma.Without<Prisma.UserRelationFilter, Prisma.UserWhereInput> & Prisma.UserWhereInput)
	| (Prisma.Without<Prisma.UserWhereInput, Prisma.UserRelationFilter> & Prisma.UserRelationFilter)
	| null
	| undefined;

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
			doubleKills: true,
			tripleKills: true,
			quadraKills: true,
			pentaKills: true
		},
		_max: {
			kills: true,
			deaths: true,
			assists: true,
			damage: true,
			totalMinionsKilled: true,
			neutralMinionsKilled: true
		},
		_min: {
			kills: true,
			deaths: true,
			assists: true
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

	const maxPlayedOccurrenceChampion = await prisma.playerStat.groupBy({
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
		take: 1
	});

	const championMaxPlayed = await prisma.champion.findUnique({
		where: { id: maxPlayedOccurrenceChampion?.[0]?.championId || 0 }
	});

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
		take: 1
	});

	const championMaxWin = await prisma.champion.findUnique({
		where: { id: maxWonOccurrenceChampion?.[0]?.championId || 0 }
	});

	const maxFarmStat = await prisma.playerStat.findFirst({
		where: {
			user: userWhereInput,
			totalMinionsKilled: avg._max.totalMinionsKilled || undefined,
			game: { periodId }
		},
		include: {
			champion: true,
			user: true
		}
	});

	const maxKillStat = await prisma.playerStat.findFirst({
		where: {
			user: userWhereInput,
			kills: avg._max.kills || undefined,
			game: { periodId }
		},
		include: {
			champion: true,
			user: true
		}
	});

	const maxDeathStat = await prisma.playerStat.findFirst({
		where: {
			user: userWhereInput,
			deaths: avg._max.deaths || undefined,
			game: { periodId }
		},
		include: {
			champion: true,
			user: true
		}
	});

	const maxAssistStat = await prisma.playerStat.findFirst({
		where: {
			user: userWhereInput,
			assists: avg._max.assists || undefined,
			game: { periodId }
		},
		include: {
			champion: true,
			user: true
		}
	});

	const maxDamageStat = await prisma.playerStat.findFirst({
		where: {
			user: userWhereInput,
			damage: avg._max.damage || undefined,
			game: { periodId }
		},
		include: {
			champion: true,
			user: true
		}
	});

	return {
		periods: await prisma.period.findMany({ orderBy: [{ date: 'desc' }] }),
		totalGames: totalGames,
		avg: avg._avg,
		sum: avg._sum,
		max: {
			...avg._max,
			maxKillStat,
			maxDeathStat,
			maxAssistStat,
			maxDamageStat,
			maxFarmStat,
			championMaxPlayed: {
				occurrence: maxPlayedOccurrenceChampion[0]?._count?.championId || 0,
				champion: championMaxPlayed
			},
			championMaxWin: {
				occurrence: maxWonOccurrenceChampion[0]?._count?.championId || 0,
				champion: championMaxWin
			}
		},
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
