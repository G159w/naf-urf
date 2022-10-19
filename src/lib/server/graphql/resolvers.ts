import { Arg, Query, Resolver, type NonEmptyArray } from 'type-graphql';
import { 
  ChampionCrudResolver,
  ChampionStatCrudResolver,
  GameCrudResolver,
  ItemCrudResolver,
  PeriodCrudResolver,
  PlayerStatCrudResolver,
  StatCrudResolver,
  SumSpellsCrudResolver,
  UserCrudResolver,
} from '$type-graphql';

@Resolver()
class FooResolver {

  @Query(() => String)
  async hello(): Promise<string> {
    return `Query graphql passed :)  !`
  }

}

export default [
  ChampionCrudResolver,
  ChampionStatCrudResolver,
  GameCrudResolver,
  ItemCrudResolver,
  PeriodCrudResolver,
  PlayerStatCrudResolver,
  StatCrudResolver,
  SumSpellsCrudResolver,
  UserCrudResolver,
      FooResolver
  ] as unknown as NonEmptyArray<never>;