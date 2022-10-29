import { UserWhereUniqueInput } from '$type-graphql/resolvers/inputs/UserWhereUniqueInput';
import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateOneUserArgs, User, Game } from '$type-graphql';
import type { GraphQLContext } from '$lib/server/context';
import { PlatformId } from '@fightmegg/riot-api';
import { GraphQLError } from 'graphql';
import { delay, numberOfPossibleRequests } from '$lib/server/utils';

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

	@Mutation(() => [Game])
	async syncUsersMatches(
		@Ctx() { prisma, riotApi }: GraphQLContext,
		@Arg('full', () => Boolean, { nullable: true, defaultValue: false }) full: boolean,
		@Arg('args', () => UserWhereUniqueInput, { nullable: true }) args?: UserWhereUniqueInput
	): Promise<Game[]> {
		const users: User[] = [];
		if (args) {
			users.push(
				await prisma.user.findUnique({ where: { ...args }, include: { gameStats: { take: 1 } } })
			);
		} else {
			users.push(...(await prisma.user.findMany({ include: { gameStats: { take: 1 } } })));
		}

		const totalMatchIds: string[] = [];
		const getUserMatch = async (user: User) => {
			try {
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
				await delay(full ? 1000 : 100);
			} catch (error) {
				throw new GraphQLError(JSON.stringify(error));
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
	}
}
