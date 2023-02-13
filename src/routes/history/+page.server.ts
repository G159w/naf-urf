import { createContext } from '$lib/server/context';
import { numberOfPossibleRequests, sleep } from '$lib/server/utils';
import { PlatformId, RiotAPITypes } from '@fightmegg/riot-api';
import type { Champion, Game, Prisma, PrismaPromise, User } from '@prisma/client';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import _ from 'lodash';
import * as cheerio from 'cheerio';
import { Timer } from 'timer-node';
import { championMapDisplayToDb } from '$lib/utils';

const { prisma, riotApi } = await createContext();

export const load = (async ({ url }) => {
	const page = +(url.searchParams.get('page') || 0);
	const take = +(url.searchParams.get('take') || 20);
	const periodId = +(url.searchParams.get('period') || 0) || undefined;
	const userId = +(url.searchParams.get('user') || 0) || undefined;
	const championId = +(url.searchParams.get('champion') || 0) || undefined;

	const where: Prisma.GameWhereInput = {
		isMatchLoaded: true,
		periodId,
		players: {
			some: {
				AND: [{ userId }, { championId, userId: { not: null } }]
			}
		}
	};

	return {
		games: await prisma.game.findMany({
			where,
			include: {
				players: {
					include: { champion: { include: { stats: true } }, stat: true, items: true, user: true }
				}
			},
			orderBy: [{ gameCreation: 'desc' }],
			take,
			skip: page * take
		}),
		totalGames: await prisma.game.count(),
		totalLoadedGames: await prisma.game.count({ where })
	};
}) satisfies PageServerLoad;

const userGamesSchema = z.object({
	id: z.number().nullish(),
	full: z.boolean().default(true)
});

const createPeriodsSchema = z.object({
	date: z.coerce.date(),
	name: z.string()
});

export const actions: Actions = {
	loadUserGames: async ({ request }) => {
		const timer = new Timer();
		timer.start();
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

			console.log(timer.time(), 'Start calling riot API');
			const totalMatchIds: string[] = [];
			const getUserMatch = async (user: User) => {
				console.log('loading games for', user.name);
				try {
					if (!user.lolId) {
						return;
					}
					const requests = await numberOfPossibleRequests(prisma);
					console.log(requests, 'possible requests before call riot API');
					const urfMatchIds: string[] = [];
					const arurfMatchIds: string[] = [];

					let urfGameRequests = 0;
					let oldResponseLength = 100;
					for (
						;
						urfGameRequests < requests && (full ? oldResponseLength === 100 : urfGameRequests < 1);
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
						console.log(timer.time(), response.length, 'URF game charged for', user.name);
						urfMatchIds.push(...response);
						oldResponseLength = response.length;
					}

					let arurfGameRequests = 0;
					oldResponseLength = 100;
					for (
						;
						urfGameRequests + arurfGameRequests < requests &&
						(full ? oldResponseLength === 100 : arurfGameRequests < 1);
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
						console.log(timer.time(), response.length, 'ARURF game charged for', user.name);
						arurfMatchIds.push(...response);
						oldResponseLength = response.length;
					}
					totalMatchIds.push(...urfMatchIds, ...arurfMatchIds);
					await prisma.lolRequest.create({ data: { count: arurfGameRequests + urfGameRequests } });
				} catch (error) {
					throw new Error(JSON.stringify(error));
				}
			};

			for (const user of users) {
				await getUserMatch(user);
			}

			console.log(timer.time(), 'Start upsert games ids');
			await prisma.game.createMany({
				data: totalMatchIds.map((matchId) => ({
					matchId
				})),
				skipDuplicates: true
			});
			console.log(timer.time(), 'End upsert games ids');
			return {
				success: true
			};
		} catch (err) {
			console.log(err);
			return {
				success: false
			};
		}
	},
	loadGamesDetail: async () => {
		try {
			const timer = new Timer();
			timer.start();
			const requests = await numberOfPossibleRequests(prisma);

			const games = await prisma.game.findMany({
				where: {
					isMatchLoaded: false
				},
				take: requests // > 20 ? 20 : requests
			});

			if (games.length === 0) {
				console.log('No more possible request');
				return 0;
			}
			await prisma.lolRequest.create({ data: { count: games.length } });
			console.log(timer.time(), games.length, 'Number of game requested ');

			const users = await prisma.user.findMany();
			const userLolIds = users.map((user) => user.lolId);

			const prismaUpdates: (() => PrismaPromise<Game>)[] = [];

			console.log(timer.time(), 'Start calling riot API');
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
							totalCs: player.totalMinionsKilled + player.neutralMinionsKilled,
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
				prismaUpdates.push(() =>
					prisma.game.update({
						where: { id: game.id },
						data: {
							duration: match.info.gameDuration,
							gameCreation: new Date(match.info.gameCreation),
							gameMode: match.info.gameMode,
							isMatchLoaded: true,
							players: {
								create: players
							}
						}
					})
				);
				console.log(timer.time(), game.id, 'game riot api call done');
			}

			console.log(timer.time(), 'Start awaiting games update');
			const loadedGames = await prisma.$transaction(prismaUpdates.map((x) => x()));
			console.log(timer.time(), loadedGames.length, 'End awaiting games update');

			return {
				success: true,
				loadedGames: games.length
			};
		} catch (err) {
			console.log(err);
			return { success: false };
		}
	},
	createPeriod: async ({ request }) => {
		try {
			const formaData = Object.fromEntries(await request.formData());
			const { date, name } = createPeriodsSchema.parse(formaData);
			const newPeriod = await prisma.period.create({ data: { date, name } });
			return { success: true, newPeriod };
		} catch (err) {
			console.log(err);
		}
	},
	loadWinRates: async () => {
		const response = await fetch('https://www.metasrc.com/urf/stats');
		const body = await response.text();
		const cheerioApi = cheerio.load(body);
		const champions: { champion: Champion; winRate: number }[] = [];
		const dbChampions = await prisma.champion.findMany({ orderBy: [{ name: 'asc' }] });

		cheerioApi('.stats-table > tbody > tr').map((i, el) => {
			const children = cheerioApi(el).children();
			const champion = cheerioApi(children).first().children().first().text();
			const winRateTd = cheerioApi(children).toArray()[6];
			const winRate = parseFloat(cheerioApi(winRateTd).text());
			const dbChampion = dbChampions.find((c) => championMapDisplayToDb[champion] === c.name);
			if (dbChampion) {
				champions.push({ champion: dbChampion, winRate });
			}
		});

		const lastPeriod = await prisma.period.findFirst({ orderBy: [{ date: 'desc' }] });

		if (!lastPeriod) {
			return { success: false };
		}

		await prisma.$transaction(
			champions.map((x) =>
				prisma.championStat.upsert({
					where: {
						championId_periodId: {
							championId: x.champion.id,
							periodId: lastPeriod.id
						}
					},
					create: {
						periodId: lastPeriod.id,
						championId: x.champion.id,
						winrate: x.winRate
					},
					update: {
						winrate: x.winRate
					}
				})
			)
		);

		return { success: true };
	},
	sanitize: async () => {
		// Attach periods to games
		const timer = new Timer();
		timer.start();
		console.log(timer.time(), 'Start sanitize periods');
		const periods = await prisma.period.findMany({ orderBy: [{ date: 'asc' }] });

		await prisma.$transaction(
			periods.map((period) =>
				prisma.game.updateMany({
					where: { gameCreation: { gte: period.date } },
					data: { periodId: period.id }
				})
			)
		);

		console.log(timer.time(), 'Start sanitize users');
		// Attach users to playerStat
		const users = await prisma.user.findMany({ where: { lolId: { not: null } } });

		await prisma.$transaction(
			users.map((user) =>
				prisma.playerStat.updateMany({
					where: { puuid: { equals: user.lolId || '' } },
					data: {
						userId: user.id
					}
				})
			)
		);

		console.log(timer.time(), 'End sanitize');
		return { success: true };
	}
};
