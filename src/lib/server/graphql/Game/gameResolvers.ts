import { UserWhereUniqueInput } from './../../../../../$type-graphql/resolvers/inputs/UserWhereUniqueInput';
import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateOneUserArgs, Game, User } from '$type-graphql';
import type { GraphQLContext } from '$lib/server/context';
import { PlatformId, RiotAPITypes } from '@fightmegg/riot-api';
import { GraphQLError } from 'graphql';
import { logger } from '$lib/server/logger';
import type { Prisma } from '@prisma/client';

@Resolver()
export class GameResolver {
	@Mutation(() => [Game])
	async completeGames(@Ctx() { prisma, riotApi }: GraphQLContext): Promise<Game[]> {
		const games = await prisma.game.findMany({
			where: {
				matchLoaded: false
			}
		});
		try {
			const updates: { id: number; data: Prisma.GameUpdateInput }[] = [];
			for (const game of games) {
				const match = await riotApi.matchV5.getMatchById({
					cluster: PlatformId.EUROPE,
					matchId: game.matchId
				});

				const players = match.info.participants.map((player) => ({
					user: { connect: {} },
					allyTeam: false,
					champion: {
						connectOrCreate: { where: { name: 'AKALI' }, create: { name: 'AKALI' } }
					},
					kills: 0,
					deaths: 0,
					assists: 0,
					damage: 0,
					reduction: 0
				}));

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
			throw new GraphQLError(error.message);
		}
		return games;
	}
}
