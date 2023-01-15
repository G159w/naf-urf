import { writable, type Writable } from 'svelte/store';

export const appRailIndex: Writable<number> = writable(1);
