import {
	load_AllUsers,
	load_User,
	load_CountGames,
	loadAll,
	load_Games,
	SortOrder
} from '$houdini';
import type { LoadEvent } from '@sveltejs/kit';

export async function load(event: LoadEvent) {
	const user = event.url.searchParams.get('user');
	const page = event.url.searchParams.get('page');

	return {
		...(await loadAll(
			load_Games({
				event,
				variables: {
					where: {
						isMatchLoaded: { equals: true },
						players: user
							? {
									some: {
										user: {
											is: {
												id: {
													equals: +user
												}
											}
										}
									}
							  }
							: undefined
					},
					orderBy: [{ gameCreation: SortOrder.desc }],
					take: 20,
					skip: 20 * +page || 0
				}
			}),
			load_CountGames({ event, variables: { where: { isMatchLoaded: { equals: false } } } }),
			user ? load_User({ event, variables: { where: { id: +user } } }) : load_AllUsers({ event })
		))
	};
}
