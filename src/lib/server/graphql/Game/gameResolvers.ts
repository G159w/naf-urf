import { numberOfPossibleRequests } from './../../utils';
import { Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { FindManyGameArgs, Game } from '$type-graphql';
import type { GraphQLContext } from '$lib/server/context';
import { PlatformId } from '@fightmegg/riot-api';
import { GraphQLError } from 'graphql';
import type { Prisma } from '@prisma/client';
import _ from 'lodash';

@Resolver()
export class GameResolver {
	@Query(() => Number)
	async countGames(
		@Args(() => FindManyGameArgs) args: FindManyGameArgs,
		@Ctx() { prisma }: GraphQLContext
	): Promise<number> {
		return prisma.game.count({
			...args
		});
	}

	@Mutation(() => [Number])
	async loadGames(@Ctx() { prisma, riotApi }: GraphQLContext): Promise<number> {
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

		try {
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
					throw new GraphQLError('NO REGISTERED USER IN THIS GAME');
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
		} catch (error) {
			console.log(error);
			throw new GraphQLError(error.message);
		}
		return games.length;
	}
}
