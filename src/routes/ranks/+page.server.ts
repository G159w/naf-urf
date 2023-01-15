import { createContext } from '$lib/server/context';
import type { PageServerLoad  } from './$types';
const { prisma } = await createContext();

export const load = (async () => {
	return {
		users: await prisma.user.findMany({ include: { _count: { select: { gameStats: true } } } })
	};
}) satisfies PageServerLoad
