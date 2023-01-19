import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { PlatformId } from '@fightmegg/riot-api';
import type { Prisma } from '@prisma/client';
const { prisma, riotApi } = await createContext();

export const load = (async ({ url }) => {
	const userId = +(url.searchParams.get('user') || 0);
	const firstStat = await prisma.playerStat.findMany({
		where: {
			stat: {
				is: null
			},
			user: {
				isNot: null
			}
		},
		include: {
			user: true,
			game: {
				include: {
					players: {
						include: {
							user: true,
							champion: true
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
		users: await prisma.user.findMany({ include: { _count: { select: { gameStats: true } } } }),
		stat: firstStat[0]
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createStat: async ({ request }) => {}
};
