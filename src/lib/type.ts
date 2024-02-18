import type { Prisma } from "@prisma/client";

export type CompletePStat = Prisma.StatGetPayload<{
	include: {
		playerStat: { include: { game: { include: { players: { include: { champion: true } } } } } };
		champion: { include: { champion: true } };
	};
}>;
