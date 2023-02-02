import { createContext } from '$lib/server/context';
import type { LayoutServerLoad } from './$types';

const { prisma } = await createContext();

export const load = (async () => {
	return {
		users: await prisma.user.findMany(),
		periods: await prisma.period.findMany({ orderBy: [{ date: 'desc' }] }),
		champions: await prisma.champion.findMany({ orderBy: [{ name: 'asc' }] })
	};
}) satisfies LayoutServerLoad;
