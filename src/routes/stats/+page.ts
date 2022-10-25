import { load_AllUsers } from '$houdini';
import type { LoadEvent } from '@sveltejs/kit';

export async function load(event: LoadEvent) {
	return {
		...(await load_AllUsers({ event, variables: {} }))
	};
}
