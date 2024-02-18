import { createContext } from '$lib/server/context';
import type { Prisma } from '@prisma/client';
import type { PageServerLoad } from './$types';
import _ from 'lodash';
import type { CompletePStat } from '$lib/type';
const { prisma } = await createContext();

export const load = (async ({ url }) => {
	const periodId = +(url.searchParams.get('period') || 0) || undefined;
	const championId = +(url.searchParams.get('champion') || 0) || undefined;
	const userId = +(url.searchParams.get('user') || 0) || undefined;
	const stats = await prisma.stat.groupBy({
		where: {
			userId: userId,
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
		_max: {
			kills: true,
			deaths: true
		},
		_count: {
			kda: true
		}
	});

	const gameWon = await prisma.playerStat.groupBy({
		by: ['userId'],
		where: {
			isWin: true,
			userId: userId ?? { not: null },
			stat: { isNot: null },
			game: { periodId: periodId },
			championId: championId
		},
		_count: {
			isWin: true
		}
	});

	const gameLost = await prisma.playerStat.groupBy({
		by: ['userId'],
		where: {
			isWin: false,
			userId: userId ?? { not: null },
			stat: { isNot: null },
			game: { periodId: periodId },
			championId: championId
		},
		_count: {
			isWin: true
		}
	});

	const winRates = gameWon.map((gameWon) => {
		const gameLostCount = _.find(gameLost, { userId: gameWon.userId })?._count?.isWin || 0;
		const gameWonCount = gameWon._count?.isWin || 0;
		return {
			userId: gameWon.userId,
			winRate: (gameWonCount / (gameWonCount + gameLostCount)) * 100
		};
	});

	const nbChampionStats = await prisma.playerStat.groupBy({
		by: ['userId', 'championId'],
		where: {
			userId: userId ?? { not: null },
			stat: { isNot: null },
			game: { periodId: periodId },
			championId: championId
		},
		_count: {
			championId: true
		}
	});

	let allStats: CompletePStat[] = [];

	if (userId) {
		allStats = await prisma.stat.findMany({
			where: { userId, champion: { championId }, periodId },
			include: {
				playerStat: {
					include: { game: { include: { players: { include: { champion: true } } } } }
				},
				champion: { include: { champion: true } }
			},
			orderBy: { playerStat: { game: { gameCreation: 'desc' } } }
		});
	}

	return {
		winRates,
		stats,
		nbChampionStats,
		allStats
	};
}) satisfies PageServerLoad;
