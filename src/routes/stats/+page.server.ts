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
		}
	});

	return {
		users: await prisma.user.findMany({ include: { _count: { select: { gameStats: true } } } }),
		avg: avg._avg
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
