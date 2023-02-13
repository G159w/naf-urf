import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { Timer } from 'timer-node';
const { prisma } = await createContext();
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const stat = await prisma.playerStat.findFirst({
		where: {
			stat: {
				is: null
			},
			user: {
				isNot: null
			},
			game: {
				periodId: {
					not: null
				}
			}
		},
		include: {
			champion: {
				include: {
					stats: true
				}
			},
			user: true,
			game: {
				include: {
					players: {
						include: {
							user: true,
							champion: {
								include: {
									stats: true
								}
							}
						}
					}
				}
			}
		},
		orderBy: [
			{
				game: {
					gameCreation: 'asc'
				}
			}
		],
		take: 1
	});
	return {
		stat,
		championsStats: await prisma.championStat.findMany({
			where: { periodId: stat?.game.periodId || -1 },
			include: {
				champion: true
			}
		})
	};
}) satisfies PageServerLoad;

const createStatSchema = z.object({
	playerStatId: z.coerce.number(),
	statId: z.coerce.number().nullable(),
	bonusDamage: z.coerce.number(),
	kda: z.coerce.number(),
	perf: z.coerce.number(),
	xclass: z.coerce.number(),
	comment: z.string().nullable()
});

export const actions: Actions = {
	createStat: async ({ request }) => {
		const timer = new Timer();
		timer.start();
		try {
			const formaData = Object.fromEntries(await request.formData());
			const { bonusDamage, kda, perf, xclass, comment, playerStatId, statId } =
				createStatSchema.parse(formaData);

			const playerStat = await prisma.playerStat.findUnique({
				where: { id: playerStatId },
				include: {
					game: true
				}
			});

			if (!playerStat || !playerStat.userId || !playerStat.game.periodId) {
				console.log(timer.time(), 'No Player Stat');
				return fail(400, { success: false });
			}

			const championStat = await prisma.championStat.findUnique({
				where: {
					championId_periodId: {
						championId: playerStat.championId,
						periodId: playerStat.game.periodId
					}
				}
			});

			if (!championStat) {
				console.log(timer.time(), 'No Champion Stat');
				return fail(400, { success: false });
			}

			const newStat = await prisma.stat.upsert({
				where: { id: statId || undefined },
				update: {
					kda: kda,
					damage: bonusDamage,
					perf: perf,
					xClass: xclass,
					comment: comment
				},
				create: {
					userId: playerStat.userId,
					championStatId: championStat.id,
					periodId: playerStat.game.periodId,
					playerStatId: playerStat.id,
					kills: playerStat.kills,
					deaths: playerStat.deaths,
					assists: playerStat.assists,
					reduction: 0,
					kda: kda,
					damage: bonusDamage,
					perf: perf,
					xClass: xclass,
					comment: comment
				}
			});

			return {
				success: true,
				newStat
			};
		} catch (error) {
			console.log(error);
			return fail(400, { success: false });
		}
	}
};
