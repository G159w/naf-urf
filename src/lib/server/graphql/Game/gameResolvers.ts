import { UserWhereUniqueInput } from './../../../../../$type-graphql/resolvers/inputs/UserWhereUniqueInput';
import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateOneUserArgs, Game, User } from '$type-graphql';
import type { GraphQLContext } from '$lib/server/context';
import { PlatformId, RiotAPITypes } from '@fightmegg/riot-api';
import { GraphQLError } from 'graphql';
import { logger } from '$lib/server/logger';
import type { Prisma } from '@prisma/client';
import _ from 'lodash';

@Resolver()
export class GameResolver {
	@Mutation(() => [Game])
	async loadGames(@Ctx() { prisma, riotApi }: GraphQLContext): Promise<Game[]> {
		const games = await prisma.game.findMany({
			where: {
				isMatchLoaded: false
			}
		});
		const users = await prisma.user.findMany();
		const userLolIds = users.map((user) => user.lolId);

		try {
			const updates: { id: number; data: Prisma.GameUpdateInput }[] = [];
			for (const game of [_.first(games)]) {
				console.log(game);
				const match = await riotApi.matchV5.getMatchById({
					cluster: PlatformId.EUROPE,
					matchId: game.matchId
				});
				console.log(match);

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
							allyTeam: player.teamId === firstRegisteredAlly.teamId,
							champion: {
								connectOrCreate: {
									where: { name: player.championName.toLocaleLowerCase() },
									create: { name: player.championName.toLocaleLowerCase() }
								}
							},
							kills: player.kills,
							deaths: player.deaths,
							assists: player.assists,
							damage: player.totalDamageDealt,
							reduction: player.totalDamageTaken
						};
					}
				);
				updates.push({
					id: game.id,
					data: {
						duration: 0,
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
		return games;
	}
}
