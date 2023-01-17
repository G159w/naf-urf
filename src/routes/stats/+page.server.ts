import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { PlatformId } from '@fightmegg/riot-api';
const { prisma, riotApi } = await createContext();
export const load = (async () => {
	const avg = await prisma.playerStat.aggregate({
		where: {
			user: {
				is: {
					id: {
						gt: 0
					}
				}
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

	const champion = await prisma.champion.findMany({
		include: {
			_count: {
				select: {
					players: {
						where: {
							user: { id: { gt: 0 } }
						}
					}
				}
			}
		},
		orderBy: [
			{
				players: {
					_count: 'desc'
				}
			}
		],
		take: 1
	});

	const championWin = await prisma.champion.findMany({
		include: {
			_count: {
				select: {
					players: {
						where: {
							user: { id: { gt: 0 } },
							isWin: true
						}
					}
				}
			}
		},
		orderBy: [
			{
				players: {
					_count: 'desc'
				}
			}
		],
		take: 1
	});

	return {
		users: await prisma.user.findMany({ include: { _count: { select: { gameStats: true } } } }),
		avg: avg._avg,
		max: {
			...avg._max,
			champion: champion[0],
			championWin: championWin[0]
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
