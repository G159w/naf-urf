import { UserWhereUniqueInput } from './../../../../../$type-graphql/resolvers/inputs/UserWhereUniqueInput';
import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateOneUserArgs, User } from '$type-graphql';
import type { GraphQLContext } from '$lib/server/context';
import { PlatformId, RiotAPITypes } from '@fightmegg/riot-api';
import { GraphQLError } from 'graphql';
import { logger } from '$lib/server/logger';

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async createUser(
		@Ctx() { prisma, riotApi }: GraphQLContext,
		@Args(() => CreateOneUserArgs) args: CreateOneUserArgs
	): Promise<User> {
		const { name, ign } = args.data;
		try {
			const summoner = await riotApi.summoner.getBySummonerName({
				region: PlatformId.EUW1,
				summonerName: ign
			});
			return prisma.user.create({
				data: {
					name,
					ign,
					lolId: summoner.puuid
				}
			});
		} catch (error) {
			throw new GraphQLError(error.message);
		}
	}

	@Mutation(() => [User])
	async syncUsersMatches(
		@Ctx() { prisma, riotApi }: GraphQLContext,
		@Arg('args', () => UserWhereUniqueInput, { nullable: true }) args?: UserWhereUniqueInput
	): Promise<User[]> {
		const users: User[] = [];
		if (args) {
			users.push(await prisma.user.findUnique({ where: { ...args } }));
		} else {
			users.push(...(await prisma.user.findMany()));
		}

		const getUserMatch = async (user: User) => {
			try {
				const matchIds = await riotApi.matchV5.getIdsbyPuuid({
					cluster: PlatformId.EUROPE,
					puuid: user.lolId,
					params: {
						queue: 1900, // 900 for old URF and ARURF and 1900 for new URF (early 2022)
						count: 20
					}
				});

				const games = await prisma.$transaction(
					matchIds.map((matchId) =>
						prisma.game.upsert({
							where: { matchId: matchId },
							update: {},
							create: {
								matchId: matchId
							}
						})
					)
				);

				await prisma.$transaction(
					games.map((game) =>
						prisma.stat.upsert({
							where: {
								gameIdentifier: {
									gameId: game.id,
									userId: user.id
								}
							},
							update: {},
							create: {
								game: { connect: { id: game.id } },
								user: { connect: { id: user.id } }
							}
						})
					)
				);
			} catch (error) {
				throw new GraphQLError(error.message);
			}
		};

		for (const user of users) {
			await getUserMatch(user);
		}
		if (args) {
			return [await prisma.user.findUnique({ where: { ...args } })];
		} else {
			return prisma.user.findMany();
		}
	}
}
