import * as relationResolversImport from '$type-graphql/resolvers/relations/resolvers.index';
import { Query, Resolver, type NonEmptyArray } from 'type-graphql';
import {
	relationResolvers,
	ChampionCrudResolver,
	ChampionStatCrudResolver,
	GameCrudResolver,
	ItemCrudResolver,
	PeriodCrudResolver,
	PlayerStatCrudResolver,
	StatCrudResolver,
	SumSpellsCrudResolver,
	UserCrudResolver
} from '$type-graphql';
import { UserResolver } from './User/userResolvers';
import { GameResolver } from './Game/gameResolvers';

@Resolver()
class FooResolver {
	@Query(() => String)
	async hello(): Promise<string> {
		return `Query graphql passed :)  !`;
	}
}

export default [
	relationResolversImport.ChampionRelationsResolver,
	relationResolversImport.ChampionStatRelationsResolver,
	relationResolversImport.GameRelationsResolver,
	relationResolversImport.ItemRelationsResolver,
	relationResolversImport.PeriodRelationsResolver,
	relationResolversImport.PlayerStatRelationsResolver,
	relationResolversImport.StatRelationsResolver,
	relationResolversImport.SumSpellsRelationsResolver,
	relationResolversImport.UserRelationsResolver,
	ChampionCrudResolver,
	ChampionStatCrudResolver,
	GameCrudResolver,
	ItemCrudResolver,
	PeriodCrudResolver,
	PlayerStatCrudResolver,
	StatCrudResolver,
	SumSpellsCrudResolver,
	UserCrudResolver,
	UserResolver,
	GameResolver,
	FooResolver
] as unknown as NonEmptyArray<never>;
