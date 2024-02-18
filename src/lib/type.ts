import type { Prisma } from '@prisma/client';

export type CompleteStat = Prisma.StatGetPayload<{
	include: {
		playerStat: {
			include: {
				game: { include: { players: { include: { champion: true } } } };
				champion: true;
				user: true;
			};
		};
		champion: { include: { champion: true } };
	};
}>;

export type MaxStat = (CompleteStat['playerStat'] & { stat: Stat | null });
