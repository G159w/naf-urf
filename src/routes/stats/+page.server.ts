import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { PlatformId } from '@fightmegg/riot-api';
const { prisma, riotApi } = await createContext();
export const load = (async () => {
	const avg = await prisma.playerStat.aggregate({
		where: {
			user: {
				isNot: null
			}
		},
		_avg: {
			kills: true,
			deaths: true,
			assists: true,
			damage: true,
			goldEarned: true,
			doubleKills: true,
			tripleKills: true,
			quadraKills: true,
			pentaKills: true
		},
		_max: {
			kills: true,
			deaths: true,
			assists: true,
			damage: true
		},
		_min: {
			kills: true,
			deaths: true,
			assists: true
		}
	});

	const gamesWon = await prisma.game.count({
		where: {
			players: {
				some: {
					user: {
						id: { gt: 0 }
					},
					isWin: {
						equals: true
					}
				}
			}
		}
	});

	const totalGames = await prisma.game.count({
		where: {
			players: {
				some: {
					user: {
						id: { gt: 0 }
					}
				}
			}
		}
	});

	const maxPlayedOccurrenceChampion = await prisma.playerStat.groupBy({
		where: {
			user: {
				isNot: null
			}
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
		where: {
			id: maxPlayedOccurrenceChampion[0].championId
		},
		include: {
			players: true
		}
	});

	const maxWonOccurrenceChampion = await prisma.playerStat.groupBy({
		where: {
			user: {
				isNot: null
			},
			isWin: true
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
		where: {
			id: maxWonOccurrenceChampion[0].championId
		},
		include: {
			players: true
		}
	});

	const maxKillStat = await prisma.playerStat.findFirst({
		where: {
			user: {
				isNot: null
			},
			kills: avg._max.kills || undefined
		},
		include: {
			champion: true,
			user: true
		}
	});

	const maxDeathStat = await prisma.playerStat.findFirst({
		where: {
			user: {
				isNot: null
			},
			deaths: avg._max.deaths || undefined
		},
		include: {
			champion: true,
			user: true
		}
	});

	const maxAssistStat = await prisma.playerStat.findFirst({
		where: {
			user: {
				isNot: null
			},
			assists: avg._max.assists || undefined
		},
		include: {
			champion: true,
			user: true
		}
	});

	const maxDamageStat = await prisma.playerStat.findFirst({
		where: {
			user: {
				isNot: null
			},
			damage: avg._max.damage || undefined
		},
		include: {
			champion: true,
			user: true
		}
	});

	return {
		users: await prisma.user.findMany({ include: { _count: { select: { gameStats: true } } } }),
		avg: avg._avg,
		max: {
			...avg._max,
			maxKillStat,
			maxDeathStat,
			maxAssistStat,
			maxDamageStat,
			championMaxPlayed: {
				occurrence: maxPlayedOccurrenceChampion[0]._count.championId,
				champion: championMaxPlayed
			},
			championMaxWin: {
				occurrence: maxWonOccurrenceChampion[0]._count.championId,
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
