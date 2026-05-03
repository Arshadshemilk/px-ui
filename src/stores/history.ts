import { writable } from 'svelte/store';
import type { Command } from '../interfaces/command';

// Disabled persistence to ensure a clean start every time and prevent old banner caching
export const history = writable<Array<Command>>([]);
