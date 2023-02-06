import { createContext } from '$lib/server/context';
import type { PageServerLoad } from './$types';
const { prisma } = await createContext();

export const load = (async ({ url }) => {
	const periodId = +(url.searchParams.get('period') || 0) || undefined;
	const championId = +(url.searchParams.get('champion') || 0) || undefined;

	const stats = await prisma.stat.groupBy({
		where: {
			periodId,
			champion: {
				championId
			}
		},
		by: ['userId'],
		_sum: {
			kda: true,
			perf: true,
			damage: true,
			xClass: true
		},
		_count: {
			kda: true
		}
	});

	return {
		stats
	};
}) satisfies PageServerLoad;
