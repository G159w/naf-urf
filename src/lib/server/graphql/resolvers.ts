import { Arg, Query, Resolver } from 'type-graphql';
import type { NonEmptyArray } from 'type-graphql'
import { FindManyUserResolver } from '$type-graphql';

@Resolver()
class FooResolver {

  @Query(() => String)
  async hello(): Promise<string> {
    return `Query graphql passed :)  !`
  }

  @Query(() => String)
  async foo(
    @Arg("servings", () => Number, { defaultValue: 2 }) servings: number,
    @Arg("title", () => String, { nullable: true }) title?: string,
  ): Promise<string> {
    return `${title} ${servings.toString()}`
  }
}

export default [
    FindManyUserResolver,
    FooResolver
  ] as unknown as NonEmptyArray<never>;