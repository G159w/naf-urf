import { load_User } from '$houdini';
import type { LoadEvent } from '@sveltejs/kit';

export async function load(event: LoadEvent) {
	return {
		...(await load_User({ event, variables: { where: { id: +event.params.id } } }))
	};
}
