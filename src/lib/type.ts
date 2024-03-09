import type { Prisma, Stat } from '@prisma/client';

export const completePlayerStatInclude = {
	game: { include: { players: { include: { champion: true } } } },
	champion: true,
	user: true,
	stat: true
}

export type CompleteStat = Prisma.StatGetPayload<{
	include: {
		playerStat: {
			include: typeof completePlayerStatInclude
		};
		champion: { include: { champion: true } };
	};
}>;

export type TopStat = Prisma.TopStatsGetPayload<{
	include: typeof completePlayerStatInclude
}>