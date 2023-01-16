import { writable, type Writable } from 'svelte/store';
import { page } from '$app/stores';

export const appRailIndex: Writable<number> = writable(0);
