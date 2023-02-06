import { createContext } from '$lib/server/context';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
const { prisma } = await createContext();

export const load = (async ({ url }) => {
	const periodId = +(url.searchParams.get('period') || 0) || undefined;
	return {
		champions: periodId
			? await prisma.champion.findMany({
					include: {
						stats: {
							where: { periodId }
						}
					},
					orderBy: [{ name: 'asc' }]
			  })
			: []
	};
}) satisfies PageServerLoad;

const registerSchema = z.object({
	championId: z.coerce.number(),
	periodId: z.coerce.number(),
	winrate: z.coerce.number()
});

export const actions: Actions = {
	createChampStat: async ({ request }) => {
		const formaData = Object.fromEntries(await request.formData());
		console.log(formaData);
		try {
			const { championId, periodId, winrate } = registerSchema.parse(formaData);
			const championStat = await prisma.championStat.upsert({
				where: {
					championId_periodId: {
						championId,
						periodId
					}
				},
				update: { winrate },
				create: { winrate, periodId, championId }
			});
			console.log(championStat);
			return { success: true, championStat };
		} catch (err) {
			console.log(err);
			return fail(400, { success: false });
		}
	}
};
