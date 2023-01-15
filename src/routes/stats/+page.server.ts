import { createContext } from '$lib/server/context';
import { numberOfPossibleRequests, sleep } from '$lib/server/utils';
import { PlatformId } from '@fightmegg/riot-api';
import type { Prisma, User } from '@prisma/client';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
const { prisma, riotApi } = await createContext();
import _ from 'lodash';

export const load = (async ({ url }) => {
	const page = +(url.searchParams.get('page') || 0);
	const take = +(url.searchParams.get('take') || 20);
	return {
		users: await prisma.user.findMany(),
		games: await prisma.game.findMany({
			where: { isMatchLoaded: true },
			include: { players: { include: { champion: true } } },
			take,
			skip: page * take
		}),
		totalGames: await prisma.game.count(),
		totalLoadedGames: await prisma.game.count({ where: { isMatchLoaded: true } })
	};
}) satisfies PageServerLoad;

const userGamesSchema = z.object({
	id: z.number().nullish(),
	full: z.boolean().default(true)
});

export const actions: Actions = {
	loadUserGames: async ({ request }) => {
		try {
			const formaData = Object.fromEntries(await request.formData());
			const { id, full } = userGamesSchema.parse(formaData);
			const users: User[] = [];
			if (id) {
				const user = await prisma.user.findUnique({
					where: { id: id },
					include: { gameStats: { take: 1 } }
				});
				if (user) users.push(user);
			} else {
				users.push(...(await prisma.user.findMany({ include: { gameStats: { take: 1 } } })));
			}

			const totalMatchIds: string[] = [];
			const getUserMatch = async (user: User) => {
				try {
					if (!user.lolId) {
						return;
					}
					const requests = await numberOfPossibleRequests(prisma);
					const urfMatchIds: string[] = [];
					const arurfMatchIds: string[] = [];
					let urfGameRequests = 0;

					for (
						;
						urfGameRequests < requests &&
						(full ? urfMatchIds.length % 100 === 0 : urfGameRequests < 1);
						urfGameRequests++
					) {
						const response = await riotApi.matchV5.getIdsbyPuuid({
							cluster: PlatformId.EUROPE,
							puuid: user.lolId,
							params: {
								queue: 1900, // 1900 for new URF (early 2022)
								count: 100,
								start: urfGameRequests * 100
							}
						});
						urfMatchIds.push(...response);
					}

					let arurfGameRequests = 0;
					for (
						;
						urfGameRequests + arurfGameRequests < requests &&
						(full ? arurfMatchIds.length % 100 === 0 : arurfGameRequests < 1);
						arurfGameRequests++
					) {
						const response = await riotApi.matchV5.getIdsbyPuuid({
							cluster: PlatformId.EUROPE,
							puuid: user.lolId,
							params: {
								queue: 900, // 900 for old URF and ARURF
								count: 100,
								start: arurfGameRequests * 100
							}
						});
						arurfMatchIds.push(...response);
					}
					totalMatchIds.push(...urfMatchIds, ...arurfMatchIds);
					await prisma.lolRequest.create({ data: { count: arurfGameRequests + urfGameRequests } });
					await sleep(full ? 1000 : 100);
				} catch (error) {
					throw new Error(JSON.stringify(error));
				}
			};

			for (const user of users) {
				await getUserMatch(user);
			}

			return await prisma.$transaction(
				totalMatchIds.map((matchId) =>
					prisma.game.upsert({
						where: { matchId: matchId },
						update: {},
						create: {
							matchId: matchId
						}
					})
				)
			);
		} catch (err) {
			console.log(err);
		}
	},
	loadGamesDetail: async () => {
		try {
			const requests = await numberOfPossibleRequests(prisma);

			const games = await prisma.game.findMany({
				where: {
					isMatchLoaded: false
				},
				take: requests
			});

			if (games.length === 0) {
				return 0;
			}

			await prisma.lolRequest.create({ data: { count: games.length } });

			const users = await prisma.user.findMany();
			const userLolIds = users.map((user) => user.lolId);

			const updates: { id: number; data: Prisma.GameUpdateInput }[] = [];
			for (const game of games) {
				const match = await riotApi.matchV5.getMatchById({
					cluster: PlatformId.EUROPE,
					matchId: game.matchId
				});

				const firstRegisteredAlly = _.find(match.info.participants, (player) =>
					_.includes(userLolIds, player.puuid)
				);
				if (!firstRegisteredAlly) {
					throw new Error('NO REGISTERED USER IN THIS GAME');
				}

				const players: Prisma.PlayerStatCreateWithoutGameInput[] = match.info.participants.map(
					(player) => {
						const isRegister = _.includes(userLolIds, player.puuid);
						return {
							user: isRegister ? { connect: { lolId: player.puuid } } : undefined,
							isAllyTeam: player.teamId === firstRegisteredAlly.teamId,
							isWin: player.win,
							puuid: player.puuid,
							champion: {
								connectOrCreate: {
									where: { name: player.championName.toLocaleLowerCase() },
									create: { name: player.championName.toLocaleLowerCase() }
								}
							},
							sumName: player.summonerName,
							kills: player.kills,
							deaths: player.deaths,
							assists: player.assists,
							damage: player.totalDamageDealtToChampions,
							tanked: player.totalDamageTaken,
							mitigated: player.damageSelfMitigated,
							isFirstBloodKill: player.firstBloodKill,
							doubleKills: player.doubleKills,
							tripleKills: player.tripleKills,
							quadraKills: player.quadraKills,
							pentaKills: player.pentaKills,
							totalTimeCCDealt: player.totalTimeCCDealt,
							timeCCingOthers: player.timeCCingOthers,
							totalTimeSpentDead: player.totalTimeSpentDead,
							totalMinionsKilled: player.totalMinionsKilled,
							neutralMinionsKilled: player.neutralMinionsKilled,
							goldEarned: player.goldEarned,
							items: {
								connectOrCreate: [
									{ where: { itemId: player.item0 }, create: { itemId: player.item0 } },
									{ where: { itemId: player.item1 }, create: { itemId: player.item1 } },
									{ where: { itemId: player.item2 }, create: { itemId: player.item2 } },
									{ where: { itemId: player.item3 }, create: { itemId: player.item3 } },
									{ where: { itemId: player.item4 }, create: { itemId: player.item4 } },
									{ where: { itemId: player.item5 }, create: { itemId: player.item5 } },
									{ where: { itemId: player.item6 }, create: { itemId: player.item6 } }
								]
							},
							sumSpells: {
								connectOrCreate: [
									{ where: { sumId: player.summoner1Id }, create: { sumId: player.summoner1Id } },
									{ where: { sumId: player.summoner2Id }, create: { sumId: player.summoner2Id } }
								]
							}
						};
					}
				);
				updates.push({
					id: game.id,
					data: {
						duration: match.info.gameDuration,
						gameCreation: new Date(match.info.gameCreation),
						gameMode: match.info.gameMode,
						isMatchLoaded: true,
						players: {
							create: players
						}
					}
				});
			}

			await prisma.$transaction(
				updates.map((update) =>
					prisma.game.update({
						where: { id: update.id },
						data: update.data
					})
				)
			);

			return {
				success: true,
				loadedGames: games.length
			};
		} catch (err) {
			console.log(err);
			return { success: false };
		}
	}
};
